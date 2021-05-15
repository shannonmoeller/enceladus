/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement } from '../vendor/dhtml/define.js';
import { refs } from '../vendor/dhtml/refs.js';
import { html } from '../vendor/dhtml/template.js';

const template = html`
	<canvas></canvas>
`;

defineElement('enc-game', (el) => {
	const view = template();

	el.append(view);
});
