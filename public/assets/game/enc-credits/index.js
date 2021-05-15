/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement } from '../../vendor/define.js';
import { refs } from '../../vendor/refs.js';
import { route } from '../state.js';

defineElement('enc-credits', (el) => {
	const { backEl } = refs(el);

	backEl.onclick = () => {
		route.set('menu');
	};
});
