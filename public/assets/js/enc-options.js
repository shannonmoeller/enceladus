/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement, refs } from './vendor/dhtml.js';
import { route, volume, quality } from './state.js';

defineElement('enc-options', (el) => {
	const { volumeEl, qualityEl, backEl } = refs(el);

	volumeEl.value = volume.get();
	volumeEl.onchange = () => {
		volume.set(Number(volumeEl.value));
	};

	qualityEl.value = quality.get();
	qualityEl.onchange = () => {
		quality.set(Number(qualityEl.value));
	};

	backEl.onclick = () => {
		route.set('menu');
	};
});
