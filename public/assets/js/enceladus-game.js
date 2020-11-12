/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { clone, refs } from './vendor/dhtml.js';
import { createContext } from './vendor/game.js';
import { createGame } from './game.js';

export function EnceladusGame(el) {
	const view = clone('gameView');
	const { scene, left, right } = refs(view);
	const game = createGame(scene);

	el.start = () => {
		game.start();
	};

	el.pause = () => {
		game.stop();
	};

	function prevent(event) {
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
				case '-':
				case '_':
					return game.zoomOut();
				case '=':
				case '+':
					return game.zoomIn();
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

	left.addEventListener('click', prevent);
	left.addEventListener('contextmenu', prevent);
	left.addEventListener('pointerdown', handleLeftDown);
	left.addEventListener('pointerup', handleLeftUp);
	left.addEventListener('pointerout', handleLeftUp);

	right.addEventListener('click', prevent);
	right.addEventListener('contextmenu', prevent);
	right.addEventListener('pointerdown', handleRightDown);
	right.addEventListener('pointerup', handleRightUp);
	right.addEventListener('pointerout', handleRightUp);

	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keyup', handleKeyUp);

	el.prepend(view);
}
