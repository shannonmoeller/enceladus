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
} from './vendor/game.js';
import * as lune from '../data/lune.js';
import { createMap } from './map.js';
import {
	renderSilt,
	renderGas,
	renderIce,
	renderPlayer,
	renderMeter,
	renderDebug,
} from './render.js';
import { slot1, quality } from './state.js';

const BOBBING_DRAG = 0.9895;
const GAS_DRAG = 0.999;
const GAS_GRAVITY = 0.04;
const WATER_BOUYANCY = 0.06;
const WATER_DRAG = 0.98;
const RELAX = 3;

export function createGame(main) {
	const ctx = createContext(main);
	const map = createMap(lune);

	const controller = {
		up: false,
		down: false,
		left: false,
		right: false,
	};

	const player = {
		x: 1440,
		x0: 1440,
		y: 220,
		y0: 220,
		died: false,
		fuel: 100,
		mass: 0,
		respawn: 1440,
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
	};

	function updatePlayer() {
		const { left, right } = controller;

		const distanceFromWall = map.getDistanceToIceWalls(player);
		const isDead = distanceFromWall < 5;
		const isMostlyDead = distanceFromWall < 10;

		if (isDead) {
			console.log('x_x');

			const x = player.respawn;
			const y = map.getGasLevel(x);

			player.x = x;
			player.x0 = x;
			player.y = y;
			player.y0 = y;
			player.died = true;
			player.fuel = 100;

			return;
		}

		if (player.died && (left || right)) {
			return;
		}

		player.died = false;

		let { fuel, x, x0, y, y0 } = player;
		let vx = x - x0;
		let vy = y - y0;

		const gasLevel = map.getGasLevel(x);
		const isInGas = y < gasLevel;
		const isNearGas = y < gasLevel + 10;
		const isNearWater = y > gasLevel - 15;
		const isBobbing = isNearGas && isNearWater && vy < 0.4;

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

		if (isInGas) {
			vy += GAS_GRAVITY;
		} else {
			vy -= WATER_BOUYANCY;
		}

		if (isBobbing) {
			vx *= BOBBING_DRAG;
			vy *= BOBBING_DRAG;
		} else if (isInGas) {
			vx *= GAS_DRAG;
			vy *= GAS_DRAG;
		} else {
			vx *= WATER_DRAG;
			vy *= WATER_DRAG;
		}

		if (left && right) {
			fuel -= 0.75;
		} else if (left || right) {
			fuel -= 0.5;
		} else if (isBobbing) {
			if (fuel < 0.3) {
				fuel += 0.3;
			}
			fuel *= 1.03;
		}

		if (!isMostlyDead && isBobbing && fuel > 80) {
			player.respawn = x;
			slot1.set(x);
		}

		player.x = Math.max(0, x + vx);
		player.x0 = x;
		player.y = Math.max(0, y + vy);
		player.y0 = y;
		player.fuel = Math.max(0, Math.min(100, fuel));
	}

	function updateCamera() {
		for (let i = RELAX; i--; ) {
			constrainChain(player, link, {
				length: 12,
				strength: 0.025,
			});

			constrainChain(link, camera, {
				length: 6,
				strength: 0.025,
			});
		}
	}

	const loop = createTickLoop({
		update() {
			updatePlayer();
			updateCamera();
		},

		render() {
			clearContext(ctx);

			const viewport = createViewport(ctx, {
				...camera,
				x: camera.x + 120,
				y: camera.y - 20,
			});

			renderSilt(ctx, viewport);
			renderGas(ctx, map.gasPath);
			renderIce(ctx, map.icePath);
			renderPlayer(ctx, player);
			renderMeter(ctx, player);
			renderDebug(ctx, player, viewport);

			viewport.restore();
		},
	});

	function goTo(x) {
		const y = map.getGasLevel(x);

		player.x = player.x0 = x;
		player.y = player.y0 = y;
		link.x = link.x0 = x;
		link.y = link.y0 = y;
		camera.x = camera.x0 = x;
		camera.y = camera.y0 = y;
	}

	function resize() {
		resizeContext(ctx, { quality: quality.get() });
		camera.z = Math.min(ctx.width / 400, ctx.height / 400);
	}

	function start() {
		resize();
		goTo(slot1.get());
		loop.start();
	}

	function stop() {
		loop.stop();
	}

	quality.subscribe(resize);

	return {
		camera,
		controller,
		loop,
		map,
		player,

		goTo,
		resize,
		start,
		stop,
	};
}
