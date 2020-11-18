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

		sustains[Math.floor(mapPoint.x)] = Math.max(0, Math.floor(mapPoint.y));
	}

	function remove(x, y) {
		const mapPoint = toMapCoords({
			x: camera.x + (x - ctx.width / 2) / camera.z,
			y: camera.y + (y - ctx.height / 2) / camera.z,
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
		let data = 'export const sustains = [];';

		sustains.forEach((y, x) => {
			data += `\nsustains[${x}] = ${y};`;
		});

		data += `\nsustains[notes.length - 1] = 0;`;

		return data;
	}

	return {
		camera,
		loop,

		add,
		remove,
		start,
		resize,
		stop,
		serialize,
	};
}
