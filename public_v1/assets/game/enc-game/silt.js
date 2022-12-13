/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { TAU, WATER_BOUYANCY, WATER_DRAG } from './constants.js';

// mulberry32
// https://stackoverflow.com/a/47593316
export function nextRandom(t) {
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	t = ((t ^ (t >>> 14)) >>> 0) / 4294967296;

	return t;
}

export function updateSilt({ map, silt, viewport }, now) {
	const top = Math.round(viewport.top - 20);
	const bottom = Math.round(viewport.bottom + 20);
	const left = Math.round(viewport.left - 20);
	const right = Math.round(viewport.right + 20);

	for (let x = left; x < right; x++) {
		if (x % 3) {
			continue;
		}

		let rand = nextRandom(x);
		let y = rand * 1500;

		if (y < top || y > bottom) {
			continue;
		}

		if (Math.floor(rand * now) % 100) {
			continue;
		}

		const towLevel = map.tow.getTowLevel(x);

		if (y < towLevel.y) {
			continue;
		}

		silt.push({
			x: x,
			x0: x - towLevel.fx,
			y: y,
			y0: y - towLevel.fy,
		});
	}

	silt.splice(0, silt.length - 100);

	for (const particle of silt) {
		let { x, x0, y, y0 } = particle;
		let vx = x - x0;
		let vy = y - y0;

		const towLevel = map.tow.getTowLevel(x);
		const isInTow = y > towLevel.y;

		vy -= WATER_BOUYANCY * 0.05;

		if (isInTow) {
			vx += towLevel.fx;
			vy += towLevel.fy;
		}

		vx *= WATER_DRAG;
		vy *= WATER_DRAG;

		particle.x += vx;
		particle.x0 = x;
		particle.y += vy;
		particle.y0 = y;
	}
}

export function renderSilt({ ctx, map, silt, viewport }) {
	ctx.save();

	const { top, bottom } = viewport;
	const left = Math.floor(viewport.left);
	const right = Math.ceil(viewport.right);

	for (let x = left; x < right; x++) {
		if (x % 3) {
			continue;
		}

		let y = nextRandom(x) * 1500;

		if (y < top || y > bottom) {
			continue;
		}

		const towLevel = map.tow.getTowLevel(x);

		if (y > towLevel.y) {
			continue;
		}

		ctx.beginPath();
		ctx.arc(x, y, 0.5, 0, TAU);
		ctx.fillStyle = 'hsl(162 100% 50% / 30%)';
		ctx.fill();
	}

	ctx.restore();
	ctx.save();

	for (const particle of silt) {
		const { x, x0, y, y0 } = particle;
		const gasLevel = map.gas.getGasLevel(x);
		const towLevel = map.tow.getTowLevel(x);

		if (y < gasLevel + 5 || y < towLevel.y) {
			continue;
		}

		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x, y);
		ctx.lineCap = 'round';
		ctx.lineWidth = 0.75;
		ctx.strokeStyle = 'hsl(162 100% 50% / 60%)';
		ctx.stroke();
	}

	ctx.restore();
}
