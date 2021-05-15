/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { constrainChain } from 'https://code.shannonmoeller.com/game/v1.0.0/game.js';

import { RELAXATIONS } from './constants.js';

export function updateCamera({ camera, link, player }) {
	for (let i = RELAXATIONS; i--; ) {
		constrainChain(player, link, {
			length: 12,
			strength: 0.025,
		});

		constrainChain(link, camera, {
			length: 6,
			strength: 0.025,
		});
	}
}
