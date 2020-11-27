/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { createFileStore } from './store.js';

export function encode(data) {
	// Dangerously squash data with sparse arrays
	return JSON.stringify(data).replace(/\bnull\b/g, '');
}

export function decode(data) {
	// Dangerously parse data with sparse arrays
	return Function(`'use strict'; return (${data});`)();
}

export function createFile() {
	const file = createFileStore(
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
			encode,
			decode,
			types: [
				{
					description: 'Enceladus Files',
					accept: {
						'text/enceladus': '.enceladus',
					},
				},
			],
		}
	);

	return file;
}
