/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	defineElement,
	refs,
} from 'https://code.shannonmoeller.com/dhtml/v1.0.0/dhtml.js';
import {
	createContext,
	clearContext,
	resizeContext,
	createTickLoop,
	createViewport,
} from 'https://code.shannonmoeller.com/game/v1.0.0/game.js';

import { createCamera } from './camera.js';
import { createController } from './controller.js';
import { createMap } from './map.js';
import { createPlayer } from './player.js';
import { createSilt } from './silt.js';

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

async function createGame(canvas) {
	const ctx = createContext(canvas);
	const camera = createCamera();
	const controller = createController();
	const map = await createMap();
	const player = createPlayer();
	const silt = createSilt();

	const loop = createTickLoop({
		update() {
			player.update(map, controller);
			camera.update(map, player);

			const viewport = createViewport(ctx, camera);

			silt.update(map, viewport);
		},

		render() {
			clearContext(ctx);

			const viewport = createViewport(ctx, camera);

			viewport.apply();
			silt.render(ctx);
			map.render(ctx);
			player.render(ctx);
			viewport.restore();
		},
	});

	function resize() {
		resizeContext(ctx);
		camera.z = Math.min(ctx.width / 400, ctx.height / 400);
	}

	return {
		camera,
		controller,
		loop,
		map,
		player,
		resize,
		silt,
	};
}

defineElement('enc-game', async (el) => {
	const { canvasEl, leftEl, rightEl, pauseEl } = refs(el);
	const game = await createGame(canvasEl);

	function unhandle(event) {
		event.preventDefault();
	}

	function handleKeyDown(event) {
		if (event.key in KEYS) {
			event.preventDefault();
			game.controller[KEYS[event.key]] = true;
		}
	}

	function handleKeyUp(event) {
		if (event.key in KEYS) {
			event.preventDefault();
			game.controller[KEYS[event.key]] = false;
		}
	}

	function handleLeftDown(event) {
		event.preventDefault();
		game.controller.left = true;
	}

	function handleLeftUp(event) {
		event.preventDefault();
		game.controller.left = false;
	}

	function handleRightDown(event) {
		event.preventDefault();
		game.controller.right = true;
	}

	function handleRightUp(event) {
		event.preventDefault();
		game.controller.right = false;
	}

	function handlePause(event) {
		event.preventDefault();
	}

	canvasEl.addEventListener('click', unhandle);
	canvasEl.addEventListener('contextmenu', unhandle);
	canvasEl.addEventListener('touchstart', unhandle);

	leftEl.addEventListener('click', unhandle);
	leftEl.addEventListener('contextmenu', unhandle);
	leftEl.addEventListener('touchstart', unhandle);
	leftEl.addEventListener('pointerdown', handleLeftDown);
	leftEl.addEventListener('pointerup', handleLeftUp);

	rightEl.addEventListener('click', unhandle);
	rightEl.addEventListener('contextmenu', unhandle);
	rightEl.addEventListener('touchstart', unhandle);
	rightEl.addEventListener('pointerdown', handleRightDown);
	rightEl.addEventListener('pointerup', handleRightUp);

	pauseEl.addEventListener('click', handlePause);

	el.addEventListener('connect', () => {
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		visualViewport.addEventListener('resize', game.resize, {
			passive: true,
		});

		game.resize();
		game.loop.start();
	});

	el.addEventListener('disconnect', () => {
		game.loop.stop();

		document.removeEventListener('keydown', handleKeyDown);
		document.removeEventListener('keyup', handleKeyUp);

		visualViewport.removeEventListener('resize', game.resize, {
			passive: true,
		});
	});

	window.game = game;
});
