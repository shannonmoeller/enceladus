/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	getDistance,
	findClosest,
} from 'https://code.shannonmoeller.com/game/v1.0.0/game.js';
import { decode } from './file.js';

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

	function findNearest(i, distance = 1) {
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
		findNearest,
	};
}

async function loadMap() {
	const request = await fetch('/v2/maps/lune.enceladus');
	const text = await request.text();
	const data = decode(text);

	console.log(data);

	return data;
}

export async function createMap() {
	let mapData =
		window.opener?.location?.origin === location.origin &&
		window.opener?.editor?.file?.get();

	if (!mapData) {
		mapData = await loadMap();
	}

	console.log(mapData);

	const map = {
		render() {
			// TODO
		},
	};

	return map;
}
