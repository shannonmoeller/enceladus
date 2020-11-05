import {
	createTickLoop,
	createContext,
	clearContext,
	resizeContext,
} from './vendor.js';

const DRAG = 0.997;
const GRAVITY = -0.0981;

function drag([old, curr], value = DRAG) {
	const velocity = curr - old;

	return [old, old + velocity * value];
}

function gravity([old, curr], value = GRAVITY) {
	return [old, curr + value];
}

function move([old, curr]) {
	const velocity = curr - old;

	return [curr, curr + velocity];
}

export function createGame(canvas) {
	let left = false;
	let right = false;

	const context = createContext(canvas);
	const player = {
		x: 0,
		x0: 0,
		y: 0,
		y0: 0,
	};

	let loop = createTickLoop({
		update() {
			let { x, x0, y, y0 } = player;

			let vx = x - x0;
			let vy = y - y0;

			if (left) {
				vx -= 0.025;
			}

			if (right) {
				vx += 0.025;
			}

			if (left || right) {
				vy += 0.1;
			}

			vx *= 0.98;
			vy *= 0.98;
			vy -= 0.05;

			player.x = Math.max(0, x + vx);
			player.x0 = x;
			player.y = Math.max(0, y + vy);
			player.y0 = y;
		},

		render() {
			clearContext(context);
			context.fillStyle = 'white';
			context.fillRect(player.x, player.y, 10, 10);
		},
	});

	return {
		get isPlaying() {
			return loop.isPlaying;
		},

		set left(value) {
			left = value;
		},

		set right(value) {
			right = value;
		},

		start() {
			resizeContext(context);
			loop.start();
		},

		stop() {
			loop.stop();
		},
	};
}
