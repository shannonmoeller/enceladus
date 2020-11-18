/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement } from './vendor/dhtml.js';
import { route } from './state.js';

defineElement(
	'enc-route',
	(el) => {
		route.subscribe(
			(state) => {
				el.hidden = state !== el.name;
			},
			{ immediate: true }
		);
	},
	{
		attributes: {
			name: String,
		},
	}
);
