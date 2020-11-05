import { createGame } from './game.js';
import { clone, refs } from './vendor.js';

export function EnceladusGame(el) {
	const view = clone('gameView');
	const { scene, left, right } = refs(view);
	const game = createGame(scene);

	el.start = game.start;
	el.pause = game.stop;

	left.onpointerdown = (event) => {
		event.preventDefault();
		game.left = true;
	};

	left.onpointerup = (event) => {
		event.preventDefault();
		game.left = false;
	};

	right.onpointerdown = (event) => {
		event.preventDefault();
		game.right = true;
	};

	right.onpointerup = (event) => {
		event.preventDefault();
		game.right = false;
	};

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

	el.prepend(view);
}
