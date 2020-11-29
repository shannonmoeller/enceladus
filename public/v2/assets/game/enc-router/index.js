/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement } from 'https://code.shannonmoeller.com/dhtml/v1.0.0/dhtml.js';

import { route } from '../state.js';

defineElement('enc-router', () => {});

defineElement(
	'enc-route',
	(el) => {
		const { parentElement } = el;

		route.subscribe((state) => {
			if (state === el.name) {
				parentElement.append(el);
			} else {
				el.remove();
			}
		});

		el.hidden = false;
	},
	{
		attributes: {
			name: String,
		},
	}
);
