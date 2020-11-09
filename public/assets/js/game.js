/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { lune } from '../data/lune.js';
import { prelude } from '../data/prelude.js';
import { createTickLoop, createViewport, clearContext } from './vendor.js';

const TAU = 2 * Math.PI;
const WATER_DRAG = 0.98;
const WATER_BOUYANCY = 0.05;
const GAS_DRAG = 0.999;
const GAS_GRAVITY = 0.04;

function createMap(notes) {
	const max = Math.max(...notes.filter(Boolean));
	const xScale = 10;
	const yScale = 0.2;
	const map = new Path2D();

	map.moveTo(0, 0);
	map.lineTo(0, max * yScale);
	notes.forEach((y, x) => y && map.lineTo(x * xScale, y * yScale));
	map.lineTo(notes.length * xScale, 0);
	map.closePath();

	return map;
}

export function createGame(ctx) {
	let left = false;
	let right = false;

	const player = {
		x: 220,
		x0: 220,
		y: 220,
		y0: 220,
	};

	const map = createMap(lune);
	const loop = createTickLoop({
		update() {
			const { x, x0, y, y0 } = player;

			let vx = x - x0;
			let vy = y - y0;

			if (left) {
				vx -= 0.075;
			}

			if (right) {
				vx += 0.075;
			}

			if (left && right) {
				vy += 0.125;
			} else if (left || right) {
				vy += 0.1;
			}

			const isInGas = x > 200 && x < 300 && y > 100 && y < 200;

			if (isInGas) {
				vx *= GAS_DRAG;
				vy *= GAS_DRAG;
				vy += GAS_GRAVITY;
			} else {
				vx *= WATER_DRAG;
				vy *= WATER_DRAG;
				vy -= WATER_BOUYANCY;
			}

			player.x = Math.max(0, x + vx);
			player.x0 = x;
			player.y = Math.max(0, y + vy);
			player.y0 = y;
		},

		render() {
			clearContext(ctx);

			const scale = Math.max(ctx.height, ctx.width) / 600;
			const height = ctx.height / scale;
			const halfWidth = ctx.width / 2 / scale;

			ctx.save();
			ctx.scale(scale, scale);
			ctx.translate(halfWidth - player.x, 0);

			ctx.fillStyle = 'hsl(162 100% 50% / 20%)';
			ctx.fillRect(200, 100, 100, 100);

			ctx.fillStyle = 'hsl(162 100% 5%)';
			ctx.strokeStyle = 'hsl(162 100% 20%)';
			ctx.stroke(map);
			ctx.fill(map);

			ctx.fillStyle = 'red';
			ctx.beginPath();
			ctx.arc(player.x0, player.y0, 5.5, 0, TAU);
			ctx.closePath();
			ctx.fill();

			if (player.y < height + 5) {
				ctx.fillStyle = 'white';
				ctx.beginPath();
				ctx.arc(player.x, player.y, 5, 0, TAU);
				ctx.closePath();
				ctx.fill();
			} else {
				ctx.fillStyle = 'white';
				ctx.beginPath();
				ctx.moveTo(player.x, height);
				ctx.lineTo(player.x - 10, height - 20);
				ctx.lineTo(player.x + 10, height - 20);
				ctx.closePath();
				ctx.fill();
			}

			ctx.fillStyle = 'white';
			ctx.fillText(
				`${Math.round(player.x)},${Math.round(player.y)}`,
				player.x,
				10
			);
			ctx.restore();
		},
	});

	return {
		get isPlaying() {
			return loop.isPlaying;
		},

		set left(value) {
			left = value;
		},

		set right(value) {
			right = value;
		},

		start() {
			loop.start();
		},

		stop() {
			loop.stop();
		},
	};
}
