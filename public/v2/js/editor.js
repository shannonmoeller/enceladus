/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	defineElement,
	refs,
} from 'https://code.shannonmoeller.com/dhtml/v1.0.0/dhtml.js';
import {
	createContext,
	resizeContext,
	createTickLoop,
	createViewport,
} from 'https://code.shannonmoeller.com/game/v1.0.0/game.js';

import { createCamera } from './camera.js';
import { createFile } from './file.js';
import { createMap } from './map.js';

const KEYS = {
	ArrowUp: 'up',
	w: 'up',
	ArrowLeft: 'left',
	a: 'left',
	ArrowDown: 'down',
	s: 'down',
	ArrowRight: 'right',
	d: 'right',
};

async function createEditor(canvas) {
	const ctx = createContext(canvas);
	const camera = createCamera();
	const file = createFile();
	const map = await createMap();

	const loop = createTickLoop({
		update() {},
		render() {
			const viewport = createViewport(ctx, camera);

			viewport.apply();
			viewport.restore();
		},
	});

	function resize() {
		resizeContext(ctx);
		camera.z = Math.min(ctx.width / 400, ctx.height / 400);
	}

	return {
		camera,
		file,
		loop,
		map,
		resize,
	};
}

defineElement('enc-editor', async (el) => {
	const { canvasEl, openEl, saveEl, saveAsEl, playEl } = refs(el);
	const editor = await createEditor(canvasEl);

	function handleKeyDown(event) {
		if (event.key in KEYS) {
			event.preventDefault();
			editor.controller[KEYS[event.key]] = true;
		}
	}

	function handleKeyUp(event) {
		if (event.key in KEYS) {
			event.preventDefault();
			editor.controller[KEYS[event.key]] = false;
		}
	}

	function handleOpen() {
		editor.file.open(true);
	}

	function handleSave() {
		editor.file.save();
	}

	function handleSaveAs() {
		editor.file.save(true);
	}

	function handlePlay() {
		window.open('/v2/', 'playtest');
	}

	openEl.addEventListener('click', handleOpen);
	saveEl.addEventListener('click', handleSave);
	saveAsEl.addEventListener('click', handleSaveAs);
	playEl.addEventListener('click', handlePlay);

	el.addEventListener('connect', () => {
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		visualViewport.addEventListener('resize', editor.resize, {
			passive: true,
		});

		editor.resize();
		editor.loop.start();
	});

	el.addEventListener('disconnect', () => {
		editor.loop.stop();

		document.removeEventListener('keydown', handleKeyDown);
		document.removeEventListener('keyup', handleKeyUp);

		visualViewport.removeEventListener('resize', editor.resize, {
			passive: true,
		});
	});

	window.editor = editor;
});
