/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	createContext,
	clearContext,
	resizeContext,
	createTickLoop,
} from 'https://code.shannonmoeller.com/game/v1.0.0/game.js';

import { checkpoint, quality, time } from '../state.js';
import { updateCamera } from './camera.js';
import { createMap, renderMap } from './map.js';
import { updatePlayer, renderPlayer } from './player.js';
import { updateSilt, renderSilt } from './silt.js';
import { updateViewport, applyViewport, restoreViewport } from './viewport.js';

console.log(`
Well, hello there. Looking to cheat? Cool.
Let me save you some time. Try:

  game.goTo(20000);

https://github.com/shannonmoeller/enceladus
`);

export function createGame(canvas, mapData) {
	const ctx = createContext(canvas);
	const map = createMap(mapData);

	const startX = mapData.startX;
	const startY = map.gas.getGasLevel(startX);

	const controller = {
		up: false,
		down: false,
		left: false,
		right: false,
	};

	const player = {
		x: startX,
		x0: startX,
		y: startY,
		y0: startY,
		died: false,
		fuel: 100,
		mass: 0,
	};

	const link = {
		x: startX,
		y: startY,
		mass: 0.5,
	};

	const camera = {
		x: startX,
		y: startY,
		z: 1,
		mass: 1,
	};

	const viewport = {};
	const silt = [];

	const game = {
		ctx,
		camera,
		controller,
		link,
		map,
		player,
		silt,
		viewport,
	};

	const loop = createTickLoop({
		update({ now, delta }) {
			updateViewport({
				...game,
				camera: {
					...camera,
					x: camera.x + 120,
					y: camera.y - 20,
				},
			});

			updatePlayer(game);
			updateCamera(game);
			updateSilt(game, now);

			time.set((x) => x + delta);
		},

		render() {
			clearContext(ctx);
			applyViewport(game);
			renderSilt(game);
			renderMap(game);
			renderPlayer(game);
			restoreViewport(game);
		},
	});

	function goTo(x) {
		const y = map.gas.getGasLevel(x);
		const patch = { x, x0: x, y, y0: y };

		Object.assign(player, patch);
		Object.assign(link, patch);
		Object.assign(camera, patch);
	}

	function resize() {
		resizeContext(ctx);
		camera.z = Math.min(ctx.width / 400, ctx.height / 400);
	}

	function start() {
		resize();
		goTo(checkpoint.get() || mapData.startX);
		loop.start();
	}

	function stop() {
		loop.stop();
	}

	quality.subscribe(resize);

	return {
		...game,
		loop,
		goTo,
		resize,
		start,
		stop,
	};
}
