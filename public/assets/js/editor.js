/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	createViewport,
	clearContext,
	resizeContext,
	createTickLoop,
} from './vendor/game.js';
import { notes, sustains } from '../data/lune.js';
import { createMap, toMapCoords } from './map.js';

export function createEditor(ctx) {
	const camera = {
		x: 0,
		y: 0,
		z: 1,
	};

	const loop = createTickLoop({
		update() {},

		render() {
			clearContext(ctx);

			const viewport = createViewport(ctx, camera);
			const map = createMap({ notes, sustains });

			ctx.fillStyle = 'hsl(162 100% 30%)';
			ctx.fill(map.gasPath);

			ctx.fillStyle = 'hsl(0 0% 0% / 50%)';
			ctx.fill(map.icePath);

			viewport.restore();
		},
	});

	function add(x, y) {
		const mapPoint = toMapCoords({
			x: camera.x + (x - ctx.width / 2) / camera.z,
			y: camera.y + (y - ctx.height / 2) / camera.z,
		});
		const floorX = Math.floor(mapPoint.x);
		const floorY = Math.floor(mapPoint.y);

		if (floorX < 0 || floorX > notes.length) {
			return;
		}

		sustains[floorX] = Math.max(0, floorY);
	}

	function remove(mouseX, mouseY) {
		const mapPoint = toMapCoords({
			x: camera.x + (mouseX - ctx.width / 2) / camera.z,
			y: camera.y + (mouseY - ctx.height / 2) / camera.z,
		});

		delete sustains[Math.floor(mapPoint.x)];
	}

	function resize() {
		resizeContext(ctx);
	}

	function start() {
		resize();
		loop.start();
	}

	function stop() {
		loop.stop();
	}

	function serialize() {
		let data = 'export const sustains = [';
		let line = '';

		for (let i = 0; i < notes.length; i++) {
			const value =
				i in sustains ? `${sustains[i]},` : i === notes.length - 1 ? '0' : ',';

			if (line.length + value.length > 78) {
				data += `\n\t${line}`;
				line = value;
			} else {
				line += value;
			}
		}

		data += `\n\t${line}\n];`;

		return data;
	}

	return {
		camera,
		loop,

		add,
		remove,
		resize,
		start,
		stop,
		serialize,
	};
}
