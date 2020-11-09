/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { playSong } from './music.js';
import { refs } from './vendor.js';

export function EnceladusApp(el) {
	const { lobby, start, game, pause } = refs(el);

	start.onclick = () => {
		lobby.classList.add('closed');
		game.classList.remove('closed');
		game.start();
		// playSong();
	};

	pause.onclick = () => {
		lobby.classList.remove('closed');
		game.classList.add('closed');
		game.pause();
	};
}
