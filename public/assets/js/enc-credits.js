/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement, refs } from './vendor/dhtml.js';
import { route } from './state.js';

defineElement('enc-credits', (el) => {
	const { backEl } = refs(el);

	backEl.onclick = () => {
		route.set('menu');
	};
});
