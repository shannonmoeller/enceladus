/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	defineElement,
	refs,
} from 'https://code.shannonmoeller.com/dhtml/v1.0.0/dhtml.js';

import { deaths, distance, route, time } from '../state.js';
import { HOURS, MINUTES, SECONDS, PLAYER_RADIUS } from './constants.js';
import { createGame } from './game.js';
import lune from './lune.js';

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

defineElement('enc-game', (el) => {
	const {
		canvasEl,
		leftEl,
		rightEl,
		pauseEl,
		deathsEl,
		distanceEl,
		timeEl,
	} = refs(el);

	let mapData =
		window.opener?.location?.origin === location.origin &&
		window.opener?.editor?.file?.get();

	if (!mapData) {
		mapData = lune;
	}

	const game = createGame(canvasEl, mapData);

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
		if (event.key === 'Escape') {
			return handlePause(event);
		}

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
		route.set('menu');
	}

	function handleConnect() {
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		visualViewport.addEventListener('resize', game.resize, {
			passive: true,
		});

		game.start();
	}

	function handleDisconnect() {
		game.stop();

		document.removeEventListener('keydown', handleKeyDown);
		document.removeEventListener('keyup', handleKeyUp);

		visualViewport.removeEventListener('resize', game.resize, {
			passive: true,
		});
	}

	el.addEventListener('connect', handleConnect);
	el.addEventListener('disconnect', handleDisconnect);

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

	deaths.subscribe((state) => {
		deathsEl.textContent = state;
	});

	distance.subscribe((state) => {
		const km = (state - mapData.startX) / PLAYER_RADIUS / 1000;

		distanceEl.textContent = `${km.toFixed(2)}km`;
	});

	time.subscribe((state) => {
		let hours = Math.floor((state / HOURS) % 24);
		let minutes = Math.floor((state / MINUTES) % 60);
		let seconds = Math.floor((state / SECONDS) % 60);

		hours = String(hours).padStart(2, '0');
		minutes = String(minutes).padStart(2, '0');
		seconds = String(seconds).padStart(2, '0');

		timeEl.textContent = `${hours}:${minutes}:${seconds}`;
	});

	window.game = game;
});
