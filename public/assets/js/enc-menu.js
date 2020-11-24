/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement, refs } from './vendor/dhtml.js';
import { route, checkpoint, deaths, distance, time } from './state.js';
import { START_X } from './constants.js';

defineElement('enc-menu', (el) => {
	const { continueEl, newEl, optionsEl, creditsEl } = refs(el);

	distance.subscribe(
		(state) => {
			continueEl.disabled = state == null;
		},
		{ immediate: true }
	);

	continueEl.onclick = () => {
		route.set('game');
	};

	newEl.onclick = () => {
		deaths.set(0);
		checkpoint.set(START_X);
		distance.set(START_X);
		time.set(0);
		route.set('game');
	};

	optionsEl.onclick = () => {
		route.set('options');
	};

	creditsEl.onclick = () => {
		route.set('credits');
	};
});
