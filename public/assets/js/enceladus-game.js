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

	left.addEventListener('click', prevent);
	left.addEventListener('contextmenu', prevent);

	left.addEventListener('pointerdown', (event) => {
		event.preventDefault();
		game.left = true;
	});

	left.addEventListener('pointerup', (event) => {
		event.preventDefault();
		game.left = false;
	});

	right.addEventListener('click', prevent);
	right.addEventListener('contextmenu', prevent);

	right.addEventListener('pointerdown', (event) => {
		event.preventDefault();
		game.right = true;
	});

	right.addEventListener('pointerup', (event) => {
		event.preventDefault();
		game.right = false;
	});

	document.body.addEventListener('keydown', (event) => {
		if (!game.isPlaying) {
			return;
		}

		switch (event.key) {
			case 'ArrowLeft':
			case 'a':
				event.preventDefault();
				game.left = true;
				break;
			case 'ArrowRight':
			case 'd':
				event.preventDefault();
				game.right = true;
				break;
		}
	});

	document.body.addEventListener('keyup', (event) => {
		if (!game.isPlaying) {
			return;
		}

		switch (event.key) {
			case 'ArrowLeft':
			case 'a':
				event.preventDefault();
				game.left = false;
				break;
			case 'ArrowRight':
			case 'd':
				event.preventDefault();
				game.right = false;
				break;
		}
	});

	window.addEventListener(
		'resize',
		() => {
			resizeContext(context);
		},
		{ passive: true }
	);

	el.prepend(view);
}
