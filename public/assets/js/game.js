/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	createContext,
	createViewport,
	clearContext,
	resizeContext,
	createTickLoop,
} from './vendor/game.js';
import * as lune from '../data/lune.js';
import { createMap } from './map.js';
import {
	renderDebug,
	renderGas,
	renderIce,
	renderMeter,
	renderParticles,
	renderPlayer,
	renderSilt,
} from './render.js';
import {
	updateCamera,
	updateParticles,
	updatePlayer,
	updateTime,
} from './update.js';
import { checkpoint, quality } from './state.js';

export function createGame(main) {
	const ctx = createContext(main);
	const map = createMap(lune);

	const controller = {
		up: false,
		down: false,
		left: false,
		right: false,
	};

	const player = {
		x: 1440,
		x0: 1440,
		y: 220,
		y0: 220,
		died: false,
		fuel: 100,
		mass: 0,
		respawn: 1440,
	};

	const particles = [];

	const link = {
		x: player.x,
		y: player.y,
		mass: 0.5,
	};

	const camera = {
		x: player.x,
		y: player.y,
		z: 1,
		mass: 1,
	};

	const loop = createTickLoop({
		update({ delta }) {
			updatePlayer(map, controller, player);
			updateParticles(map, particles);
			updateCamera(player, link, camera);
			updateTime(delta);
		},

		render() {
			clearContext(ctx);

			const viewport = createViewport(ctx, {
				...camera,
				x: camera.x + 120,
				y: camera.y - 20,
			});

			renderGas(ctx, map.gasPath);
			renderSilt(ctx, viewport);
			renderParticles(ctx, particles);
			renderIce(ctx, map.icePath);
			renderPlayer(ctx, player);
			renderMeter(ctx, player);

			viewport.restore();

			renderDebug(ctx, player);
		},
	});

	function goTo(x) {
		const y = map.getGasLevel(x);

		player.x = player.x0 = x;
		player.y = player.y0 = y;
		link.x = link.x0 = x;
		link.y = link.y0 = y;
		camera.x = camera.x0 = x;
		camera.y = camera.y0 = y;
	}

	function resize() {
		resizeContext(ctx, { quality: quality.get() });
		camera.z = Math.min(ctx.width / 400, ctx.height / 400);
	}

	function start() {
		resize();
		goTo(checkpoint.get());
		loop.start();
	}

	function stop() {
		loop.stop();
	}

	quality.subscribe(resize);

	return {
		camera,
		controller,
		loop,
		map,
		player,

		goTo,
		resize,
		start,
		stop,
	};
}
