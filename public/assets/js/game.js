/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	createContext,
	createViewport,
	clearContext,
	resizeContext,
	createTickLoop,
	constrainChain,
	constrainStick,
} from './vendor/game.js';
import { notes, sustains } from '../data/lune.js';

const TAU = 2 * Math.PI;
const GAS_DRAG = 0.999;
const GAS_GRAVITY = 0.04;
const WATER_BOUYANCY = 0.06;
const WATER_DRAG = 0.98;
const RELAX = 3;
const X_SCALE = 5;
const Y_SCALE = 0.2;

export function findNearestIce(x) {
	const { length } = notes;
	const i = Math.floor(x / X_SCALE);
	const series = [];

	for (let l = i, lc = 2; l >= 0; l--) {
		if (notes[l] != null) {
			series.unshift({
				x: l * X_SCALE,
				y: notes[l] * Y_SCALE,
			});

			if (--lc <= 0) {
				break;
			}
		}
	}

	for (let r = i + 1, rc = 2; r < length; r++) {
		if (notes[r] != null) {
			series.push({
				x: r * X_SCALE,
				y: notes[r] * Y_SCALE,
			});

			if (--rc <= 0) {
				break;
			}
		}
	}

	return series;
}

export function findNearestGas(x) {
	const i = Math.floor(x / X_SCALE);

	for (let l = i; l >= 0; l--) {
		if (sustains[l] != null) {
			return sustains[l] * Y_SCALE;
		}
	}

	return 0;
}

export function createMap() {
	const map = new Path2D();

	map.moveTo(0, 0);
	map.lineTo(0, notes[0] * Y_SCALE);
	notes.forEach((y, x) => y && map.lineTo(x * X_SCALE, y * Y_SCALE));
	map.lineTo(notes.length * X_SCALE, 0);
	map.closePath();

	const gas = new Path2D();

	gas.moveTo(0, 0);
	gas.lineTo(0, sustains[0] * Y_SCALE);

	let last = 0;
	sustains.forEach((y, x) => {
		gas.lineTo(x * X_SCALE, last);
		last = y * Y_SCALE;
		gas.lineTo(x * X_SCALE, last);
	});

	gas.lineTo(sustains.length, 0);
	gas.closePath();

	return {
		map,
		gas,
	};
}

export function createGame(canvas) {
	const ctx = createContext(canvas);

	const player = {
		enteredGas: performance.now(),
		wasNearGas: false,
		fuel: 100,
		x: 500,
		x0: 500,
		y: 70,
		y0: 70,
		mass: 0,
	};

	const link = {
		x: player.x,
		y: player.y,
		mass: 0.5,
	};

	const camera = {
		x: player.x,
		y: player.y,
		mass: 1,
	};

	const controller = {
		left: false,
		right: false,
	};

	const { map, gas } = createMap();
	const loop = createTickLoop({
		update({ now }) {
			const { left, right } = controller;
			let { fuel, x, x0, y, y0 } = player;
			let vx = x - x0;
			let vy = y - y0;

			const nearestGas = findNearestGas(x);
			const nearestIce = findNearestIce(x);

			const isInGas = y < nearestGas;
			const isNearGas = y < nearestGas + 3;

			if (isNearGas) {
				if (!player.wasNearGas) {
					player.enteredGas = now;
				}
				player.wasNearGas = true;
			} else {
				player.wasNearGas = false;
			}

			if (fuel > 0) {
				if (left) {
					vx -= 0.06;
				}

				if (right) {
					vx += 0.06;
				}

				if (left && right) {
					vy += 0.13;
				} else if (left || right) {
					vy += 0.1;
				}
			}

			if (left && right) {
				fuel -= 0.75;
			} else if (left || right) {
				fuel -= 0.5;
			} else if (isNearGas && now - player.enteredGas > 600) {
				fuel += 0.25;
			}

			if (isInGas) {
				vx *= GAS_DRAG;
				vy *= GAS_DRAG;
				vy += GAS_GRAVITY;
			} else {
				vx *= WATER_DRAG;
				vy *= WATER_DRAG;
				vy -= WATER_BOUYANCY;
			}

			player.fuel = Math.max(0, Math.min(100, fuel));
			player.x += vx;
			player.x0 = x;
			player.y = Math.max(0, y + vy);
			player.y0 = y;

			for (let i = RELAX; i--; ) {
				constrainChain(player, link, {
					length: 25,
					strength: 0.025,
				});
				constrainStick(link, camera, {
					strength: 0.025,
				});
			}
		},

		render() {
			clearContext(ctx);

			const viewport = createViewport(ctx, {
				...camera,
				x: camera.x + 200,
			});

			ctx.fillStyle = 'hsl(162 100% 50% / 50%)';
			ctx.fill(gas);

			ctx.fillStyle = 'hsl(162 100% 5% / 50%)';
			ctx.strokeStyle = 'hsl(162 100% 20%)';
			ctx.stroke(map);
			ctx.fill(map);

			ctx.fillStyle = 'red';
			ctx.beginPath();
			ctx.arc(player.x0, player.y0, 5.5, 0, TAU);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = 'white';
			ctx.beginPath();
			ctx.arc(player.x, player.y, 5, 0, TAU);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = 'white';
			ctx.fillText(
				`${Math.round(player.x)},${Math.round(player.y)}`,
				viewport.left,
				viewport.top + 10
			);
			ctx.fillText(
				`${Math.round(player.fuel)}%`,
				viewport.left,
				viewport.top + 20
			);
			ctx.restore();
		},
	});

	function resize() {
		resizeContext(ctx);

		camera.z = Math.min(ctx.width / 500, ctx.height / 500);
	}

	return {
		get isPlaying() {
			return loop.isPlaying;
		},

		set left(value) {
			controller.left = value;
		},

		set right(value) {
			controller.right = value;
		},

		start() {
			addEventListener('resize', resize, { passive: true });
			resize();
			loop.start();
		},

		stop() {
			removeEventListener('resize', resize, { passive: true });
			loop.stop();
		},
	};
}
