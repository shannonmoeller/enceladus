/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	defineElement,
	refs,
} from 'https://code.shannonmoeller.com/dhtml/v1.0.0/dhtml.js';

import { route } from '../state.js';

defineElement('enc-tutorial', (el) => {
	const { backEl } = refs(el);

	backEl.onclick = () => {
		route.set('menu');
	};
});
