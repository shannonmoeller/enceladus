/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement } from '../vendor/dhtml/define.js';
import { refs } from '../vendor/dhtml/refs.js';

defineElement('enc-edit', (el) => {
	const canvas = document.createElement('canvas');

	el.append(canvas);

	console.log('edit', el, canvas);
});
