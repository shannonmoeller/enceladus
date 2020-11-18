/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement, refs } from './vendor/dhtml.js';
import { route, volume, quality, bloom } from './state.js';

defineElement('enc-options', (el) => {
	const { volumeEl, qualityEl, bloomEl, backEl } = refs(el);

	volumeEl.value = volume.get();
	volumeEl.onchange = () => {
		volume.set(Number(volumeEl.value));
	};

	qualityEl.value = quality.get();
	qualityEl.onchange = () => {
		quality.set(Number(qualityEl.value));
	};

	bloomEl.checked = bloom.get();
	bloomEl.onchange = () => {
		bloom.set(bloomEl.checked);
	};

	backEl.onclick = () => {
		route.set('menu');
	};
});
