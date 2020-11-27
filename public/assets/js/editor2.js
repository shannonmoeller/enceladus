/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { createFileStore } from './store.js';

function createGameFileStore() {
	return createFileStore(
		{
			name: '',
			startX: 0,
			scaleX: 1,
			scaleY: 1,

			terrain: [],
			pockets: [],
			currents: [],
		},
		{
			encode(data) {
				return JSON.stringify(data).replace(/\bnull\b/g, '');
			},

			decode(data) {
				return Function(`'use strict'; return (${data});`)();
			},
		}
	);
}

function createMap(data) {
	const { name, startX, scaleX, scaleY, terrain, pockets, currents } = data;
}

export function createEditor() {
	const file = createGameFileStore();

	return {
		file,
	};
}
