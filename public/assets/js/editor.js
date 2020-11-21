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
import { createMap, toMapCoords, toWorldCoords } from './map.js';

export function createEditor(ctx) {
	const camera = { x: 0, y: 0, z: 1 };
	const pointer = { x: 0, y: 0 };

	function toPointerCoords() {
		return {
			x: camera.x + (pointer.x - ctx.width / 2) / camera.z,
			y: camera.y + (pointer.y - ctx.height / 2) / camera.z,
		};
	}

	const loop = createTickLoop({
		update() {},

		render() {
			clearContext(ctx);

			const viewport = createViewport(ctx, camera);
			const map = createMap({ notes, sustains });
			const pointerCoords = toPointerCoords();
			const mapCoords = toMapCoords(pointerCoords);
			const worldCoords = toWorldCoords(mapCoords);

			ctx.fillStyle = 'hsl(162 100% 30%)';
			ctx.fill(map.gasPath);

			ctx.fillStyle = 'hsl(0 0% 0% / 50%)';
			ctx.fill(map.icePath);

			ctx.save();
			ctx.globalCompositeOperation = 'overlay';
			ctx.fillStyle = 'hsl(0 0% 100% / 10%)';
			ctx.fillRect(
				worldCoords.left,
				-1000,
				worldCoords.right - worldCoords.left,
				3000
			);
			ctx.restore();

			viewport.restore();
		},
	});

	function add() {
		const pointerCoords = toPointerCoords();
		const mapCoords = toMapCoords(pointerCoords);
		const floorX = Math.floor(mapCoords.x);
		const floorY = Math.floor(mapCoords.y);

		if (floorX < 0 || floorX > notes.length) {
			return;
		}

		sustains[floorX] = Math.max(0, floorY);
	}

	function remove() {
		const pointerCoords = toPointerCoords();
		const mapCoords = toMapCoords(pointerCoords);

		delete sustains[Math.floor(mapCoords.x)];
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
		pointer,
		loop,

		add,
		remove,
		resize,
		start,
		stop,
		serialize,
	};
}
