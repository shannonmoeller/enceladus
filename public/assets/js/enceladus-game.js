import { createGame } from './game.js';
import { clone, refs, createContext, resizeContext } from './vendor.js';

function prevent(event) {
	event.preventDefault();
}

export function EnceladusGame(el) {
	const view = clone('gameView');
	const { scene, left, right } = refs(view);

	const context = createContext(scene);
	const game = createGame(context);

	el.start = () => {
		resizeContext(context);
		game.start();
	};

	el.pause = () => {
		game.stop();
	};

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
		if (!game.isPlaying) {
			return;
		}

		switch (event.key) {
			case 'ArrowLeft':
			case 'a':
				return handleLeftDown(event);
			case 'ArrowRight':
			case 'd':
				return handleRightDown(event);
		}
	}

	function handleKeyUp(event) {
		if (!game.isPlaying) {
			return;
		}

		switch (event.key) {
			case 'ArrowLeft':
			case 'a':
				return handleLeftUp(event);
			case 'ArrowRight':
			case 'd':
				return handleRightUp(event);
		}
	}

	function handleResize(event) {
		if (!game.isPlaying) {
			return;
		}

		resizeContext(context);
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

	document.body.addEventListener('keydown', handleKeyDown);
	document.body.addEventListener('keyup', handleKeyUp);
	window.addEventListener('resize', handleResize, { passive: true });

	el.prepend(view);
}
