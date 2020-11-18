/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { toMapCoords } from './map.js';

const TAU = Math.PI * 2;

function isDebugging() {
	return location.hash === '#debug';
}

export function renderGas(ctx, path) {
	ctx.save();
	ctx.fillStyle = 'hsl(162 100% 50% / 20%)';
	ctx.fill(path);
	ctx.restore();
}

export function renderIce(ctx, path) {
	ctx.save();
	ctx.fillStyle = 'hsl(0 0% 0%)';
	ctx.fill(path);
	ctx.restore();
}

export function renderPlayer(ctx, player) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(player.x, player.y, 5, 0, TAU);
	ctx.closePath();
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.restore();
}

export function renderMeter(ctx, player) {
	ctx.save();

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

	ctx.restore();
}

export function renderDebug(ctx, player, viewport) {
	if (!isDebugging()) {
		return;
	}

	const playerX = Math.round(player.x);
	const playerY = Math.round(player.y);
	const playerFuel = Math.round(player.fuel);
	const mapX = Math.round(toMapCoords(player).x);
	const mapY = Math.round(toMapCoords(player).y);

	ctx.save();
	ctx.fillStyle = 'hsl(0 0% 100% / 50%)';
	ctx.fillText(
		`w ${playerX},${playerY}`,
		viewport.left + 20,
		viewport.top + 30
	);
	ctx.fillText(`m ${mapX},${mapY}`, viewport.left + 20, viewport.top + 40);
	ctx.fillText(`${playerFuel}%`, viewport.left + 20, viewport.top + 50);
	ctx.restore();
}
