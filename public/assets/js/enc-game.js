/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement, refs } from './vendor/dhtml.js';
import { createGame } from './game.js';
import { route, deaths, distance, time } from './state.js';
import {
	HOURS,
	MINUTES,
	SECONDS,
	PLAYER_RADIUS,
	START_X,
} from './constants.js';

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

function formatDistance(x) {
	const km = (x - START_X) / PLAYER_RADIUS / 1000;

	return `${km.toFixed(2)}km`;
}

function formatTime(ms) {
	let hours = Math.floor((ms / HOURS) % 24);
	let minutes = Math.floor((ms / MINUTES) % 60);
	let seconds = Math.floor((ms / SECONDS) % 60);

	hours = String(hours).padStart(2, '0');
	minutes = String(minutes).padStart(2, '0');
	seconds = String(seconds).padStart(2, '0');

	return `${hours}:${minutes}:${seconds}`;
}

function unhandle(event) {
	event.preventDefault();
}

defineElement('enc-game', (el) => {
	const {
		canvasEl,
		leftEl,
		rightEl,
		deathsEl,
		distanceEl,
		timeEl,
		backEl,
	} = refs(el);

	const game = createGame(canvasEl);

	function handleResize() {
		game.resize();
	}

	function handleKeyDown(event) {
		if (el.hidden) {
			return;
		}

		if (event.key in KEYS) {
			event.preventDefault();
			game.controller[KEYS[event.key]] = true;
		}
	}

	function handleKeyUp(event) {
		if (el.hidden) {
			return;
		}

		if (event.key === 'Escape') {
			return handleBack(event);
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

	function handleBack(event) {
		event.preventDefault();
		route.set('menu');
	}

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

	backEl.addEventListener('click', handleBack);

	route.subscribe((state) => {
		if (state === 'game') {
			visualViewport.addEventListener('resize', handleResize, {
				passive: true,
			});
			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('keyup', handleKeyUp);
			game.start();
		} else {
			game.stop();
			visualViewport.removeEventListener('resize', handleResize, {
				passive: true,
			});
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		}
	});

	deaths.subscribe(
		(state) => {
			deathsEl.textContent = state;
		},
		{ immediate: true }
	);

	distance.subscribe(
		(state) => {
			distanceEl.textContent = formatDistance(state);
		},
		{ immediate: true }
	);

	time.subscribe(
		(state) => {
			timeEl.textContent = formatTime(state);
		},
		{ immediate: true }
	);

	window.game = game;
});
