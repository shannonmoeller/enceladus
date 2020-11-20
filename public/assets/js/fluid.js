/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	clearContext,
	resizeContext,
	createTickLoop,
	constrainSeries,
} from './vendor/game.js';

const RELAX = 3;
const SCALE = 60;

// prettier-ignore
const vectors = [
	[[ 1, 1], [ 1, 1], [ 1, 1], [-1, 1], [-1, 1], [-1, 1]],
	[[ 1, 1], [ 1, 1], [ 1, 1], [-1, 1], [-1, 1], [-1, 1]],
	[[ 1,-1], [ 1,-1], [ 1,-1], [-1,-1], [-1,-1], [-1,-1]],
	[[ 1,-1], [ 1,-1], [ 1,-1], [-1,-1], [-1,-1], [-1,-1]],
];

function getVector(x, y) {
	const mapX = Math.floor(x / SCALE);
	const mapY = Math.floor(y / SCALE);

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
				const { x, x0, y, y0 } = particle;
				let vx = x - x0;
				let vy = y - y0;

				let vector = getVector(x, y);

				if (vector) {
					vx += vector[0] * 0.025;
					vy += vector[1] * 0.025;
				}

				particle.x += vx;
				particle.x0 = x;
				particle.y += vy;
				particle.y0 = y;
			});

			for (let i = RELAX; i--; ) {
				constrainSeries(particles, {
					length: 100,
					strength: 0.01,
				});
			}
		},

		render() {
			clearContext(ctx);

			const height = vectors.length;
			const width = vectors[0].length;

			ctx.save();
			ctx.strokeStyle = 'black';
			ctx.strokeRect(0, 0, SCALE * width, SCALE * height);
			ctx.restore();

			ctx.save();
			ctx.globalCompositeOperation = 'overlay';
			particles.forEach((particle) => {
				const { x, x0, y, y0 } = particle;
				const value = Math.hypot(x - x0, y - y0);
				const color = `hsl(180 100% 80% / ${50 * value}%)`;

				ctx.beginPath();
				ctx.moveTo(x0, y0);
				ctx.lineTo(x, y);
				ctx.lineCap = 'round';
				ctx.lineWidth = Math.min(value, 2);
				ctx.strokeStyle = color;
				ctx.stroke();
			});
			ctx.restore();
		},
	});

	function add(mouseX, mouseY) {
		const x = mouseX / camera.z;
		const y = mouseY / camera.z;

		particles.push({ x, x0: x, y, y0: y });
		particles.splice(0, particles.length - 512);
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
