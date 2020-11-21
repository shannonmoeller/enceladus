/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { createStore } from './vendor/store.js';

function getStorage(key) {
	try {
		return JSON.parse(localStorage.getItem(key));
	} catch (e) {
		return null;
	}
}

function setStorage(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		return;
	}
}

function createPersistentStore(key, value) {
	const store = createStore(getStorage(key) ?? value);

	store.subscribe((state) => {
		setStorage(key, state);
	});

	return store;
}

export const route = createStore('menu');
export const slot1 = createPersistentStore('slot1', null);
export const volume = createPersistentStore('volume', 1);
export const quality = createPersistentStore('quality', 1);
