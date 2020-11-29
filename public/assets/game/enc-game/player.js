/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { checkpoint, deaths, distance } from '../state.js';
import {
	TAU,
	PLAYER_RADIUS,
	BOBBING_DRAG,
	GAS_DRAG,
	GAS_GRAVITY,
	WATER_BOUYANCY,
	WATER_DRAG,
} from './constants.js';

const herschel = new Image();

herschel.src = '/assets/game/herschel.png';

export function updatePlayer({ controller, map, player }) {
	const { left, right } = controller;

	const distanceFromWall = map.ice.getIceDistance(player);
	const isDead = distanceFromWall < PLAYER_RADIUS;
	const isMostlyDead = distanceFromWall < PLAYER_RADIUS * 2;

	if (isDead) {
		deaths.set((x) => x + 1);

		const x = checkpoint.get();
		const y = map.gas.getGasLevel(x);

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

	let { x, x0, y, y0, fuel } = player;
	let vx = x - x0;
	let vy = y - y0;

	const gasLevel = map.gas.getGasLevel(x);
	const isInGas = y < gasLevel;
	const isNearGas = y < gasLevel + PLAYER_RADIUS * 2;
	const isNearWater = y > gasLevel - PLAYER_RADIUS * 3;
	const isSlow = vy < 0.4;
	const isBobbing = isNearGas && isNearWater && isSlow;

	const towLevel = map.tow.getTowLevel(x);
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

	if (!isMostlyDead && isInGas && isSlow && fuel > 80) {
		checkpoint.set(x);
	}

	distance.set(x);

	player.x = Math.max(0, x + vx);
	player.x0 = x;
	player.y = Math.max(0, y + vy);
	player.y0 = y;
	player.fuel = Math.max(0, Math.min(100, fuel));
}

export function renderPlayer({ ctx, player }) {
	ctx.save();
	ctx.translate(player.x, player.y);

	// Herschel
	ctx.save();
	ctx.rotate(TAU * (player.x - player.x0) * 0.04);
	ctx.drawImage(herschel, -7.5, -7.5, 15, 15);
	ctx.restore();

	const empty = TAU * 0.333;
	const full = TAU * 0.666;
	const current = empty + (full - empty) * (player.fuel / 100);

	// Meter
	ctx.globalCompositeOperation = 'screen';

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
