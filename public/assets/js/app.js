/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { refs } from './vendor/dhtml.js';
import { createContext } from './vendor/game.js';
import { createGame } from './game.js';

export function EnceladusApp(el) {
	const { lobbyEl, startEl, gameEl, canvasEl, leftEl, rightEl, pauseEl } = refs(
		el
	);
	const game = createGame(canvasEl);

	function handleStart() {
		lobbyEl.classList.add('closed');
		gameEl.classList.remove('closed');
		game.start();
	}

	function handlePause() {
		lobbyEl.classList.remove('closed');
		gameEl.classList.add('closed');
		game.pause();
	}

	function handlePrevent(event) {
		event.preventDefault();
	}

	function handleLeftDown(event) {
		event.preventDefault();
		game.left = true;
	}

	function handleLeftUp(event) {
		event.preventDefault();
		game.left = false;
	}

	function handleRightDown(event) {
		event.preventDefault();
		game.right = true;
	}

	function handleRightUp(event) {
		event.preventDefault();
		game.right = false;
	}

	function handleKeyDown() {
		if (game.isPlaying) {
			switch (event.key) {
				case 'ArrowLeft':
				case 'a':
					return handleLeftDown(event);
				case 'ArrowRight':
				case 'd':
					return handleRightDown(event);
				case '=':
				case '+':
					return game.zoomIn();
				case '-':
				case '_':
					return game.zoomOut();
			}
		}
	}

	function handleKeyUp(event) {
		if (game.isPlaying) {
			switch (event.key) {
				case 'ArrowLeft':
				case 'a':
					return handleLeftUp(event);
				case 'ArrowRight':
				case 'd':
					return handleRightUp(event);
			}
		}
	}

	function resize() {
		const height = `${visualViewport.height}px`;
		const width = `${visualViewport.width}px`;

		document.documentElement.style.height = height;
		document.documentElement.style.width = width;

		document.body.style.height = height;
		document.body.style.width = width;

		game.resize();
	}

	startEl.addEventListener('click', handleStart);
	pauseEl.addEventListener('click', handlePause);

	leftEl.addEventListener('click', handlePrevent);
	leftEl.addEventListener('contextmenu', handlePrevent);
	leftEl.addEventListener('pointerdown', handleLeftDown);
	leftEl.addEventListener('pointerup', handleLeftUp);
	leftEl.addEventListener('pointerout', handleLeftUp);

	rightEl.addEventListener('click', handlePrevent);
	rightEl.addEventListener('contextmenu', handlePrevent);
	rightEl.addEventListener('pointerdown', handleRightDown);
	rightEl.addEventListener('pointerup', handleRightUp);
	rightEl.addEventListener('pointerout', handleRightUp);

	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keyup', handleKeyUp);

	visualViewport.addEventListener('resize', resize, { passive: true });

	window.game = game;
	resize();
}
