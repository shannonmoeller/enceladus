/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { createFileStore } from '../../vendor/store-file.js';

export function encode(data) {
	// Dangerously squash sparse data
	return `export default ${JSON.stringify(data).replace(/\bnull\b/g, '')};`;
}

export function decode(data) {
	// Dangerously parse sparse data
	return Function(data.replace('export default', 'return'));
}

export function createFile(initialState) {
	return createFileStore(
		{
			name: '',
			startX: 0,
			scaleX: 1,
			scaleY: 1,

			terrain: [0],
			pockets: [0],
			currents: [[0, 0, 0]],

			...initialState,
		},
		{
			encode,
			decode,
			types: [
				{
					description: 'Enceladus Files',
					accept: {
						'text/javascript': '.js',
					},
				},
			],
		}
	);
}
