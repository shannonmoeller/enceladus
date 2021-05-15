/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { getDistance, findClosest } from '../../vendor/particles.js';

function indexSparseArray(list) {
	const { length } = list;
	const filtered = [];
	const indexed = [];

	for (let i = 0, prev = 0; i < list.length; i++) {
		const item = list[i];

		if (item != null) {
			filtered.push(item);
			indexed.push(++prev);
		} else {
			indexed.push(prev);
		}
	}

	function findCurrent(i) {
		const indexedKey = Math.max(0, Math.min(i, length - 1));
		const filteredKey = indexed[indexedKey];

		return filtered[filteredKey - 1];
	}

	function findNeighbors(i, distance = 1) {
		const indexedKey = Math.max(0, Math.min(i, length - 1));
		const filteredKey = indexed[indexedKey];

		return filtered.slice(
			Math.max(0, filteredKey - distance),
			filteredKey + distance
		);
	}

	return {
		indexed,
		filtered,
		findCurrent,
		findNeighbors,
	};
}

export function toMapCoords(particle, options) {
	const { x, y } = particle;
	const { scaleX, scaleY } = options;

	const scaledX = x / scaleX;
	const scaledY = y / scaleY;
	const left = Math.floor(scaledX);
	const right = left + 1;

	return {
		x: scaledX,
		y: scaledY,
		left,
		right,
	};
}

export function toWorldCoords(particle, options) {
	const { x, y, left, right } = particle;
	const { scaleX, scaleY } = options;

	return {
		x: x * scaleX,
		y: y * scaleY,
		left: left * scaleX,
		right: right * scaleX,
	};
}

export function createGas(values, options) {
	const gas = values.map((y, x) => toWorldCoords({ x, y }, options));
	const index = indexSparseArray(gas);
	const path = new Path2D();
	let prev = { x: 0, y: 0 };

	path.moveTo(0, -1000);
	path.lineTo(0, gas[0].y);
	gas.forEach((point) => {
		path.lineTo(point.x, prev.y);
		prev = point;
		path.lineTo(point.x, prev.y);
	});
	path.lineTo(gas[gas.length - 1].x, -1000);
	path.closePath();

	function getGasLevel(x) {
		const mapX = Math.floor(x / options.scaleX);

		return index.findCurrent(mapX).y;
	}

	return {
		path,
		getGasLevel,
	};
}

export function renderGas({ ctx, map }) {
	ctx.save();

	ctx.fillStyle = 'hsl(162 50% 40% / 10%)';
	ctx.fill(map.gas.path);

	ctx.strokeStyle = 'hsl(162 100% 40% / 10%)';
	ctx.stroke(map.gas.path);

	ctx.translate(0, -4);
	ctx.fillStyle = 'hsl(162 100% 40% / 10%)';
	ctx.fill(map.gas.path);

	ctx.restore();
}

export function createIce(values, options) {
	const ice = values.map((y, x) => toWorldCoords({ x, y }, options));
	const index = indexSparseArray(ice);
	const path = new Path2D();

	path.moveTo(0, -1000);
	path.lineTo(0, ice[0].y);
	ice.forEach((point) => path.lineTo(point.x, point.y));
	path.lineTo(ice[ice.length - 1].x, -1000);
	path.closePath();

	function getIceDistance(particle) {
		const mapX = Math.floor(particle.x / options.scaleX);
		const walls = index.findNeighbors(mapX, 2);
		const length = walls.length - 1;
		let distance = Infinity;

		for (let i = 0; i < length; i++) {
			const a = walls[i];
			const b = walls[i + 1];
			const closest = findClosest(a, b, particle);

			distance = Math.min(distance, getDistance(particle, closest));
		}

		return distance;
	}

	return {
		path,
		getIceDistance,
	};
}

export function renderIce({ ctx, map }) {
	ctx.save();

	ctx.fillStyle = 'hsl(162 20% 5%)';
	ctx.fill(map.ice.path);

	ctx.translate(1.6, -16);
	ctx.fillStyle = 'hsl(0 0% 0%)';
	ctx.fill(map.ice.path);

	ctx.restore();
}

export function createTow(values, options) {
	const tow = values.map(([y, fx, fy], x) => ({
		...toWorldCoords({ x, y }, options),
		fx,
		fy,
	}));

	const index = indexSparseArray(tow);
	const path = new Path2D();
	let prev = { x: 0, y: 0 };

	path.moveTo(0, 2500);
	path.lineTo(0, tow[0].y);
	tow.forEach((point) => {
		path.lineTo(point.x, prev.y);
		prev = point;
		path.lineTo(point.x, prev.y);
	});
	path.lineTo(tow[tow.length - 1].x, 2500);
	path.closePath();

	function getTowLevel(x) {
		const mapX = Math.floor(x / options.scaleX);

		return index.findCurrent(mapX);
	}

	return {
		path,
		getTowLevel,
	};
}

export function createMap(mapData) {
	return {
		gas: createGas(mapData.pockets, mapData),
		ice: createIce(mapData.terrain, mapData),
		tow: createTow(mapData.currents, mapData),
	};
}

export function renderMap(app) {
	renderGas(app);
	renderIce(app);
}
