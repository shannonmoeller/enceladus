/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement, refs } from './vendor/dhtml.js';
import { route, slot1 } from './state.js';

defineElement('enc-menu', (el) => {
	const { continueEl, newEl, optionsEl, creditsEl } = refs(el);

	slot1.subscribe(
		(state) => {
			continueEl.disabled = state == null;
		},
		{ immediate: true }
	);

	continueEl.onclick = () => {
		route.set('game');
	};

	newEl.onclick = () => {
		slot1.set(1440);
		route.set('game');
	};

	optionsEl.onclick = () => {
		route.set('options');
	};

	creditsEl.onclick = () => {
		route.set('credits');
	};
});
