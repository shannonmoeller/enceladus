/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement, refs } from './vendor/dhtml.js';
import { createGame } from './game.js';
import { route } from './state.js';

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
	const { canvasEl, leftEl, rightEl, backEl } = refs(el);
	const game = createGame(canvasEl);

	function unhandle(event) {
		event.preventDefault();
	}

	function handleResize() {
		game.resize();
	}

	function handleKeyDown(event) {
		console.log('down', el);
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
			visualViewport.removeEventListener('resize', handleResize, {
				passive: true,
			});
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
			game.stop();
		}
	});

	window.game = game;
});
