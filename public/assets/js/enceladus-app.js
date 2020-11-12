/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { refs } from './vendor/dhtml.js';

export function EnceladusApp(el) {
	const { lobby, start, game, pause } = refs(el);

	start.addEventListener('click', () => {
		lobby.classList.add('closed');
		game.classList.remove('closed');
		game.start();
	});

	pause.addEventListener('click', () => {
		lobby.classList.remove('closed');
		game.classList.add('closed');
		game.pause();
	});
}
