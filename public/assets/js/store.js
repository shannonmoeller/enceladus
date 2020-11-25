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

export function createLocalStore(key, initialState) {
	const store = createStore(getStorage(key) ?? initialState);

	store.subscribe((state) => {
		setStorage(key, state);
	});

	return store;
}


export function createFileStore(initialState) {
	let handle;
	let readable;
	let writable;

	const store = {
		...createStore(initialState),

		async open() {
			await store.close();

			[handle] = await window.showOpenFilePicker();
			readable = await handle.getFile();
			writable = await handle.createWritable();

			store.set(JSON.parse(await readable.text()));
		},

		async save() {
			if (!handle) {
				handle = await window.showSaveFilePicker();
				readable = await handle.getFile();
				writable = await handle.createWritable();
			}

			await writable.write(JSON.stringify(store.get()));
		},

		async close() {
			try {
				if (handle) {
					await writable.close();
				}
			} finally {
				handle = null;
				readable = null;
				writable = null;
			}
		},
	};

	return store;
}
