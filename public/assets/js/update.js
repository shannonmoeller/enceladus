/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { constrainChain } from './vendor/game.js';
import { slot1 } from './state.js';

const BOBBING_DRAG = 0.9895;
const GAS_DRAG = 0.999;
const GAS_GRAVITY = 0.04;
const WATER_BOUYANCY = 0.06;
const WATER_DRAG = 0.98;
const RELAX = 3;

export function updateCamera(player, link, camera) {
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

export function updateParticles(map, particles) {
	// particles
}

export function updatePlayer(map, controller, player) {
	const { left, right } = controller;

	const distanceFromWall = map.getDistanceToIceWalls(player);
	const isDead = distanceFromWall < 5;
	const isMostlyDead = distanceFromWall < 10;

	if (isDead) {
		console.log('x_x');

		const x = player.respawn;
		const y = map.getGasLevel(x) + 2;

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

	const towLevel = map.getTowLevel(x);
	const isInTow = y > towLevel.y;

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

	if (isInTow) {
		vx += towLevel.fx;
		vy += towLevel.fy;
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
