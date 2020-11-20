/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { clearContext, resizeContext, createTickLoop } from './vendor/game.js';

const TAU = Math.PI * 2;

const scale = 40;
// prettier-ignore
const vectors = [
	[[ 1, 1], [ 1, 1], [-1, 1], [-1, 1]],
	[[ 1, 1], [ 1, 1], [-1, 1], [-1, 1]],
	[[ 1,-1], [ 1,-1], [-1,-1], [-1,-1]],
	[[ 1,-1], [ 1,-1], [-1,-1], [-1,-1]],
];

function getVector(x, y) {
	const mapX = Math.floor(x / scale);
	const mapY = Math.floor(y / scale);

	return vectors[mapY]?.[mapX];
}

const particles = [];

export function createFluid(ctx) {
	const camera = {
		x: 0,
		y: 0,
		z: 1,
	};

	const loop = createTickLoop({
		update() {
			particles.forEach((particle) => {
				let { x, x0, y, y0 } = particle;
				let vx = x - x0;
				let vy = y - y0;

				let vector = getVector(x, y);

				if (vector) {
					vx += vector[0] * 0.1;
					vy += vector[1] * 0.1;
				}

				particle.x += vx;
				particle.x0 = x;
				particle.y += vy;
				particle.y0 = y;
			});
		},

		render() {
			clearContext(ctx);

			const height = vectors.length;
			const width = vectors[0].length;

			ctx.save();
			ctx.strokeStyle = 'black';
			ctx.strokeRect(0, 0, scale * width, scale * height);
			ctx.restore();

			particles.forEach(({ x, y }) => {
				ctx.save();
				ctx.beginPath();
				ctx.arc(x, y, 1, 0, TAU);
				ctx.fillStyle = 'black';
				ctx.fill();
				ctx.restore();
			});
		},
	});

	function add(mouseX, mouseY) {
		const x = mouseX / camera.z;
		const y = mouseY / camera.z;

		particles.push({ x, x0: x, y, y0: y });
		particles.splice(0, particles.length - 256);
	}

	function resize() {
		resizeContext(ctx);
	}

	function start() {
		resize();
		loop.start();
	}

	function stop() {
		loop.stop();
	}

	return {
		camera,
		loop,

		add,
		resize,
		start,
		stop,
	};
}
