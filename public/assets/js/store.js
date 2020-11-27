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

export function createFileStore(initialState, options = {}) {
  const { encode = JSON.stringify, decode = JSON.parse } = options;

  let handle;

  const store = {
    ...createStore(initialState),

    async open(asNew = false) {
      if (asNew || !handle) {
        [handle] = await window.showOpenFilePicker();
      }

      const readable = await handle.getFile();

      store.set(decode(await readable.text()));
    },

    async save(asNew = false) {
      if (asNew || !handle) {
        handle = await window.showSaveFilePicker();
      }

      const writable = await handle.createWritable();

      await writable.write(encode(store.get()));
      await writable.close();
    },
  };

  return store;
}
