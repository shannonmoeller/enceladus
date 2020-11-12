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

const PI = Math.PI;
const TAU = Math.PI * 2;
const GAS_DRAG = 0.999;
const GAS_GRAVITY = 0.04;
const WATER_BOUYANCY = 0.06;
const WATER_DRAG = 0.98;
const RELAX = 3;
const X_SCALE = 16;
const Y_SCALE = 0.66;

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

	gas.lineTo(sustains.length * X_SCALE, 0);
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
		x: 800,
		x0: 800,
		y: 150,
		y0: 150,
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
		z: 1,
		mass: 1,
		scale: 1,
	};

	const controller = {
		left: false,
		right: false,
	};

	const scale = 1;

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
			const isNearGas = y < nearestGas + 10;

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
			} else if (isNearGas && now - player.enteredGas > 100) {
				if (!fuel) {
					fuel += 0.5;
				}
				fuel *= 1.02;
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
					length: 12,
					strength: 0.025,
				});
				constrainChain(link, camera, {
					length: 6,
					strength: 0.05,
				});
			}
		},

		render() {
			clearContext(ctx);

			const viewport = createViewport(ctx, {
				...camera,
				x: camera.x + 120,
				y: camera.y - 40,
			});

			ctx.fillStyle = 'hsl(162 100% 50% / 50%)';
			ctx.fill(gas);

			ctx.strokeStyle = 'hsl(162 100% 20%)';
			ctx.stroke(map);
			ctx.fillStyle = 'hsl(162 100% 5% / 50%)';
			ctx.fill(map);

			ctx.beginPath();
			ctx.arc(player.x0, player.y0, 5.5, 0, TAU);
			ctx.closePath();
			ctx.fillStyle = 'red';
			ctx.fill();

			ctx.beginPath();
			ctx.arc(player.x, player.y, 5, 0, TAU);
			ctx.closePath();
			ctx.fillStyle = 'white';
			ctx.fill();

			ctx.beginPath();
			ctx.arc(player.x, player.y, 10, TAU * 0.333, TAU * 0.666);
			ctx.strokeStyle = 'hsl(0 0% 100% / 50%)';
			ctx.lineWidth = 3;
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(
				player.x,
				player.y,
				10,
				TAU * 0.333,
				TAU * 0.333 + TAU * 0.333 * (player.fuel / 100)
			);
			ctx.strokeStyle = 'hsl(0 0% 100%)';
			ctx.lineWidth = 3;
			ctx.stroke();

			ctx.fillStyle = 'white';
			ctx.fillText(
				`${Math.round(player.x)},${Math.round(player.y)}`,
				viewport.left,
				viewport.top + 10
			);
			ctx.fillText(
				`${Math.round(player.x / X_SCALE)},${Math.round(player.y / Y_SCALE)}`,
				viewport.left,
				viewport.top + 20
			);
			ctx.fillText(
				`${Math.round(player.fuel)}%`,
				viewport.left,
				viewport.top + 30
			);
			ctx.restore();
		},
	});

	function resize() {
		resizeContext(ctx);

		camera.z = Math.min(ctx.width / 620, ctx.height / 380) * camera.scale;
	}

	addEventListener('resize', resize, { passive: true });

	const game = {
		controller,
		player,
		link,
		camera,

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
			resize();
			loop.start();
		},

		stop() {
			loop.stop();
		},

		zoomIn() {
			camera.scale *= 1.1;
			resize();
		},

		zoomOut() {
			camera.scale /= 1.1;
			resize();
		},
	};

	window.game = game;

	return game;
}
