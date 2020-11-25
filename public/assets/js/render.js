/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { toMapCoords } from './map.js';
import { TAU } from './constants.js';

const herschel = new Image();

herschel.src = '/assets/img/herschel.png';

function isDebugging() {
	return location.hash === '#debug';
}

// mulberry32
// https://stackoverflow.com/a/47593316
export function nextRandom(t) {
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	t = ((t ^ (t >>> 14)) >>> 0) / 4294967296;

	return t;
}

export function renderDebug(ctx, player) {
	if (!isDebugging()) {
		return;
	}

	ctx.save();

	const playerX = Math.round(player.x);
	const playerY = Math.round(player.y);
	const playerFuel = Math.round(player.fuel);
	const mapX = Math.round(toMapCoords(player).x);
	const mapY = Math.round(toMapCoords(player).y);

	ctx.fillStyle = 'hsl(0 0% 100%)';
	ctx.fillText(`w ${playerX},${playerY}`, 20, 200);
	ctx.fillText(`m ${mapX},${mapY}`, 20, 210);
	ctx.fillText(`${playerFuel}%`, 20, 220);

	ctx.restore();
}

export function renderSilt(ctx, map, viewport) {
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

		const towLevel = map.getTowLevel(x);
		const isInTow = y > towLevel.y;

		if (isInTow) {
			continue;
		}

		ctx.beginPath();
		ctx.arc(x, y, 0.5, 0, TAU);
		ctx.fillStyle = 'hsl(162 100% 50% / 30%)';
		ctx.fill();
	}

	ctx.restore();
}

export function renderGas(ctx, path) {
	ctx.save();

	ctx.fillStyle = 'hsl(162 50% 40% / 10%)';
	ctx.fill(path);

	ctx.strokeStyle = 'hsl(162 100% 40% / 10%)';
	ctx.stroke(path);

	ctx.translate(0, -4);
	ctx.fillStyle = 'hsl(162 100% 40% / 10%)';
	ctx.fill(path);

	ctx.restore();
}

export function renderIce(ctx, path) {
	ctx.save();

	ctx.fillStyle = 'hsl(162 20% 5%)';
	ctx.fill(path);

	ctx.translate(1.6, -16);
	ctx.fillStyle = 'hsl(0 0% 0%)';
	ctx.fill(path);

	ctx.restore();
}

export function renderMeter(ctx, player) {
	ctx.save();
	ctx.translate(player.x, player.y);
	ctx.globalCompositeOperation = 'screen';

	const empty = TAU * 0.333;
	const full = TAU * 0.666;
	const current = empty + (full - empty) * (player.fuel / 100);

	ctx.beginPath();
	ctx.arc(0, 0, 12, empty, full);
	ctx.strokeStyle = 'hsl(0 0% 100% / 20%)';
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(0, 0, 12, empty, Math.min(current, full));
	ctx.strokeStyle = 'hsl(162 100% 50%)';
	ctx.lineWidth = 3;
	ctx.stroke();

	ctx.restore();
}

export function renderParticles(ctx, map, particles) {
	ctx.save();

	for (const particle of particles) {
		const { x, y } = particle;

		if (y < map.getGasLevel(x) + 10) {
			continue;
		}

		ctx.beginPath();
		ctx.arc(x, y, 0.5, 0, TAU);
		ctx.fillStyle = 'hsl(162 100% 50% / 50%)';
		ctx.fill();
	}

	ctx.restore();
}

export function renderPlayer(ctx, player) {
	ctx.save();
	ctx.translate(player.x, player.y);

	ctx.rotate(TAU * (player.x - player.x0) * 0.04);
	ctx.drawImage(herschel, -7.5, -7.5, 15, 15);

	ctx.restore();
}
