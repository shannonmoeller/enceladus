/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	createContext,
	createViewport,
	clearContext,
	resizeContext,
	createTickLoop,
	getDistance,
	findClosest,
	constrainChain,
	constrainStick,
} from './vendor/game.js';
import * as lune from '../data/lune.js';
import { createMap } from './map.js';

const PI = Math.PI;
const TAU = Math.PI * 2;
const GAS_DRAG = 0.999;
const GAS_GRAVITY = 0.04;
const WATER_BOUYANCY = 0.06;
const WATER_DRAG = 0.98;
const RELAX = 3;
const MAP_SCALE_X = 16;
const MAP_SCALE_Y = 0.66;

function isDead(player, walls) {
	const length = walls.length - 1;

	for (let i = 0; i < length; i++) {
		const a = walls[i];
		const b = walls[i + 1];
		const closest = findClosest(a, b, player);
		const distance = getDistance(player, closest);

		if (distance < 5) {
			return true;
		}
	}

	return false;
}

export function createGame(canvas) {
	const ctx = createContext(canvas);
	const map = createMap(lune);

	const player = {
		enteredGas: performance.now(),
		wasNearGas: false,
		fuel: 100,
		x: 1440,
		x0: 1440,
		y: 220,
		y0: 220,
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

	const loop = createTickLoop({
		update({ now }) {
			const { left, right } = controller;
			let { fuel, x, x0, y, y0 } = player;
			let vx = x - x0;
			let vy = y - y0;

			const iceWalls = map.getIceWalls(x);

			if (isDead(player, iceWalls)) {
				console.log('x_x');
			}

			const gasLevel = map.getGasLevel(x);

			const isInGas = y < gasLevel;
			const isNearGas = y < gasLevel + 10;

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

			const iceWalls = map.getIceWalls(player.x);
			const viewport = createViewport(ctx, {
				...camera,
				x: camera.x + 120,
				y: camera.y - 40,
			});

			ctx.fillStyle = 'hsl(162 100% 50% / 50%)';
			ctx.fill(map.gasPath);

			ctx.strokeStyle = 'hsl(162 100% 20%)';
			ctx.stroke(map.icePath);
			ctx.fillStyle = 'hsl(162 100% 5% / 50%)';
			ctx.fill(map.icePath);

			ctx.beginPath();
			ctx.arc(player.x0, player.y0, 5.5, 0, TAU);
			ctx.closePath();
			ctx.fillStyle = 'red';
			ctx.fill();

			ctx.beginPath();
			ctx.arc(player.x, player.y, 5, 0, TAU);
			ctx.closePath();
			ctx.fillStyle = isDead(player, iceWalls) ? 'red' : 'white';
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

			const playerX = Math.round(player.x);
			const playerY = Math.round(player.y);
			const playerFuel = Math.round(player.fuel);
			const mapX = Math.round(player.x / MAP_SCALE_X);
			const mapY = Math.round(player.y / MAP_SCALE_Y);

			ctx.fillStyle = 'white';
			ctx.fillText(`p ${playerX},${playerY}`, viewport.left, viewport.top + 10);
			ctx.fillText(`m ${mapX},${mapY}`, viewport.left, viewport.top + 20);
			ctx.fillText(`${playerFuel}%`, viewport.left, viewport.top + 30);
			ctx.restore();
		},
	});

	function resize() {
		resizeContext(ctx);

		camera.z = Math.min(ctx.width / 400, ctx.height / 400) * camera.scale;
	}

	addEventListener('resize', resize, { passive: true });

	const game = {
		ctx,
		map,
		player,
		link,
		camera,
		controller,
		loop,

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
