/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	createViewport,
	clearContext,
	resizeContext,
	createTickLoop,
} from './vendor/game.js';
import { notes, pockets, currents } from '../data/lune.js';
import { createMap, toMapCoords, toWorldCoords } from './map.js';
import { createFileStore, createLocalStore } from './store.js';

const cameraX = createLocalStore('editorX', 0);
const cameraY = createLocalStore('editorY', 0);
const cameraZ = createLocalStore('editorZ', 1);

const camera = {
	get x() {
		return cameraX.get();
	},
	set x(value) {
		cameraX.set(value);
	},
	get y() {
		return cameraY.get();
	},
	set y(value) {
		cameraY.set(value);
	},
	get z() {
		return cameraZ.get();
	},
	set z(value) {
		cameraZ.set(value);
	},
};

export function createEditor(ctx) {
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
			const map = createMap({ notes, pockets, currents });
			const pointerCoords = toPointerCoords();
			const mapCoords = toMapCoords(pointerCoords);
			const worldCoords = toWorldCoords(mapCoords);

			ctx.fillStyle = 'hsl(162 100% 30%)';
			ctx.fill(map.gasPath);

			ctx.fillStyle = 'hsl(210 100% 30%)';
			ctx.fill(map.towPath);

			ctx.fillStyle = 'hsl(0 0% 0% / 50%)';
			ctx.fill(map.icePath);

			ctx.save();
			ctx.globalCompositeOperation = 'overlay';
			ctx.fillStyle = 'hsl(0 0% 100% / 10%)';
			ctx.fillRect(
				worldCoords.left,
				0,
				worldCoords.right - worldCoords.left,
				1584
			);
			ctx.restore();

			viewport.restore();

			ctx.fillStyle = 'hsl(0 0% 100%)';
			ctx.fillText(
				`w ${worldCoords.left},${Math.floor(worldCoords.y)}`,
				20,
				30
			);
			ctx.fillText(`m ${mapCoords.left},${Math.floor(mapCoords.y)}`, 20, 40);
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

		pockets[floorX] = Math.max(0, floorY);
	}

	function remove() {
		const pointerCoords = toPointerCoords();
		const mapCoords = toMapCoords(pointerCoords);

		delete pockets[Math.floor(mapCoords.x)];
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
		let data = 'export const pockets = [';
		let line = '';

		for (let i = 0; i < notes.length; i++) {
			const value =
				i in pockets ? `${pockets[i]},` : i === notes.length - 1 ? '0' : ',';

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

window.fileStore = createFileStore({
	name: 'lune',
	startX: 1440,
	scaleX: 16,
	scaleY: 0.66,

	notes,
	pockets,
	currents,
});
