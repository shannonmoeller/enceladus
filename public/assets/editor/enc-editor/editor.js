/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { createContext, clearContext, resizeContext } from '../../vendor/canvas.js';
import { createTickLoop } from '../../vendor/loop.js';

import { renderCursor } from './cursor.js';
import { createFile } from './file.js';
import { createMap, renderMap } from './map.js';
import { updateViewport, applyViewport, restoreViewport } from './viewport.js';

export function createEditor(canvas) {
	const ctx = createContext(canvas);
	const file = createFile();

	const camera = {
		x: 0,
		y: 0,
		z: 1,
	};

	const cursor = 0;

	const pointer = {
		x: 0,
		y: 0,
	};

	const map = createMap(file.get());
	const viewport = {};

	const editor = {
		ctx,
		camera,
		cursor,
		file,
		map,
		pointer,
		viewport,
	};

	const loop = createTickLoop({
		update() {
			updateViewport(editor);
		},

		render() {
			clearContext(ctx);
			applyViewport(editor);
			renderMap(editor);
			renderCursor(editor);
			restoreViewport(editor);
		},
	});

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

	return {
		...editor,
		resize,
		start,
		stop,
	};
}
