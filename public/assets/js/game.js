import { createTickLoop, clearContext } from './vendor.js';

const WATER_DRAG = 0.98;
const WATER_BOUYANCY = 0.05;
const GAS_DRAG = 0.99;
const GAS_GRAVITY = 0.05;

export function createGame(ctx) {
	let left = false;
	let right = false;

	const player = {
		x: 0,
		x0: 0,
		y: 0,
		y0: 0,
	};

	const loop = createTickLoop({
		update() {
			let { x, x0, y, y0 } = player;
			let vx = x - x0;
			let vy = y - y0;

			let isInGas = x > 200 && x < 300 && y > 100 && y < 200;

			if (left) {
				vx -= 0.03;
			}

			if (right) {
				vx += 0.03;
			}

			if (left && right) {
				vy += 0.125;
			} else if (left || right) {
				vy += 0.1;
			}

			if (isInGas) {
				vx *= GAS_DRAG;
				vy *= GAS_DRAG;
				vy += GAS_GRAVITY;
			} else {
				vx *= WATER_DRAG;
				vy *= WATER_DRAG;
				vy -= WATER_BOUYANCY;
			}

			player.x = Math.max(0, x + vx);
			player.x0 = x;
			player.y = Math.max(0, y + vy);
			player.y0 = y;
		},

		render() {
			clearContext(ctx);

			ctx.fillStyle = 'hsl(162 100% 50% / 20%)';
			ctx.fillRect(200, 100, 100, 100);

			ctx.fillStyle = 'red';
			ctx.fillRect(player.x0, player.y0, 10, 10);

			ctx.fillStyle = 'white';
			ctx.fillRect(player.x, player.y, 10, 10);
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
			loop.start();
		},

		stop() {
			loop.stop();
		},
	};
}
