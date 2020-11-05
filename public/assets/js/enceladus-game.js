import { createGame } from './game.js';
import { clone, refs } from './vendor.js';

function prevent(event) {
	event.preventDefault();
}

export function EnceladusGame(el) {
	const view = clone('gameView');
	const { scene, left, right } = refs(view);
	const game = createGame(scene);

	el.start = game.start;
	el.pause = game.stop;

	left.onclick = prevent;
	left.oncontextmenu = prevent;
	right.onclick = prevent;
	right.oncontextmenu = prevent;

	left.onpointerdown = (event) => {
		game.left = true;
	};

	left.onpointerup = (event) => {
		game.left = false;
	};

	right.onpointerdown = (event) => {
		game.right = true;
	};

	right.onpointerup = (event) => {
		game.right = false;
	};

	document.body.onkeydown = (event) => {
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
	};

	document.body.onkeyup = (event) => {
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
	};

	el.prepend(view);
}
