/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

const MAP_SCALE_X = 16;
const MAP_SCALE_Y = 0.66;

function indexSparseArray(list) {
	const { length } = list;
	const filtered = [];
	const indexed = [];

	let prev = 0;
	for (let i = 0; i < list.length; i++) {
		const item = list[i];

		if (item != null) {
			filtered.push(item);
			indexed.push(++prev);
		} else {
			indexed.push(prev);
		}
	}

	return {
		indexed,
		filtered,

		findCurrent(i) {
			const indexedKey = Math.max(0, Math.min(i, length - 1));
			const filteredKey = indexed[indexedKey];

			return filtered[filteredKey - 1];
		},

		findNearest(i, distance = 1) {
			const indexedKey = Math.max(0, Math.min(i, length - 1));
			const filteredKey = indexed[indexedKey];

			return filtered.slice(
				Math.max(0, filteredKey - distance),
				filteredKey + distance
			);
		},
	};
}

export function toMapCoords(particle) {
	const { x, y } = particle;

	return {
		x: x / MAP_SCALE_X,
		y: y / MAP_SCALE_Y,
	};
}

export function toWorldCoords(particle) {
	const { x, y } = particle;

	return {
		x: x * MAP_SCALE_X,
		y: y * MAP_SCALE_Y,
	};
}

export function createMap({ notes, sustains }) {
	const ice = notes.map((y, x) => toWorldCoords({ x, y }));
	const iceIndex = indexSparseArray(ice);
	const icePath = new Path2D();

	icePath.moveTo(0, -1000);
	icePath.lineTo(0, ice[0].y);
	ice.forEach((point) => icePath.lineTo(point.x, point.y));
	icePath.lineTo(ice[ice.length - 1].x, -1000);
	icePath.closePath();

	const gas = sustains.map((y, x) => toWorldCoords({ x, y }));
	const gasIndex = indexSparseArray(gas);
	const gasPath = new Path2D();

	gasPath.moveTo(0, -1000);
	gasPath.lineTo(0, gas[0].y);

	let prev = { x: 0, y: 0 };
	gas.forEach((point) => {
		gasPath.lineTo(point.x, prev.y);
		prev = point;
		gasPath.lineTo(point.x, prev.y);
	});

	gasPath.lineTo(gas[gas.length - 1].x, -1000);
	gasPath.closePath();

	return {
		ice,
		icePath,

		getIceWalls(x) {
			const mapX = Math.floor(x / MAP_SCALE_X);

			return iceIndex.findNearest(mapX, 2);
		},

		gas,
		gasPath,

		getGasLevel(x) {
			const mapX = Math.floor(x / MAP_SCALE_X);

			return gasIndex.findCurrent(mapX).y;
		},
	};
}
