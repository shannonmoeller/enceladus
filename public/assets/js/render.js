/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { toMapCoords } from './map.js';

const TAU = Math.PI * 2;
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
	ctx.fillText(`w ${playerX},${playerY}`, 20, 30);
	ctx.fillText(`m ${mapX},${mapY}`, 20, 40);
	ctx.fillText(`${playerFuel}%`, 20, 50);

	ctx.restore();
}

export function renderSilt(ctx, viewport) {
	ctx.save();

	const left = Math.floor(viewport.left);
	const right = Math.floor(viewport.right);

	for (let x = left; x < right; x++) {
		let y = nextRandom(x) * 2000;

		if (x % 3) {
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

	ctx.beginPath();
	ctx.arc(0, 0, 12, TAU * 0.333, TAU * 0.666);
	ctx.strokeStyle = 'hsl(0 0% 100% / 20%)';
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(
		0,
		0,
		12,
		TAU * 0.333,
		TAU * 0.333 + TAU * 0.333 * (player.fuel / 100)
	);
	ctx.strokeStyle = 'hsl(0 0% 100%)';
	ctx.lineWidth = 3;
	ctx.stroke();

	ctx.restore();
}

export function renderParticles(ctx, particles) {
	ctx.save();

	for (const { x, y } of particles) {
		ctx.beginPath();
		ctx.arc(x, y, 0.5, 0, TAU);
		ctx.fillStyle = 'hsl(162 100% 50% / 30%)';
		ctx.fill();
	}

	ctx.restore();
}

export function renderPlayer(ctx, player) {
	ctx.save();

	ctx.translate(player.x, player.y);
	ctx.rotate(TAU * (player.x - player.x0) * 0.05);
	ctx.drawImage(herschel, -7, -7.5, 15, 15);

	ctx.restore();
}
