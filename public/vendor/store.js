/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

export function createStore(state) {
  const listeners = new Set();

  return {
    get() {
      return state;
    },

    set(next) {
      state = typeof next === 'function' ? next(state) : next;

      return Promise.all(
        [...listeners].map(async (listener) => {
          await listener(state);
        })
      );
    },

    subscribe(listener, options = {}) {
      const { immediate = true } = options;

      listeners.add(listener);

      if (immediate) {
        listener(state);
      }

      return () => {
        listeners.delete(listener);
      };
    },

    unsubscribe(listener) {
      listeners.delete(listener);
    },
  };
}

export function createFileStore(initialState, options = {}) {
  const { encode = JSON.stringify, decode = JSON.parse, ...rest } = options;

  let handle;

  const store = {
    ...createStore(initialState),

    async open(asNew = false) {
      if (asNew || !handle) {
        // @ts-ignore
        [handle] = await window.showOpenFilePicker({
          multiple: false,
          ...rest,
        });
      }

      const readable = await handle.getFile();

      store.set(decode(await readable.text()));
    },

    async save(asNew = false) {
      if (asNew || !handle) {
        // @ts-ignore
        handle = await window.showSaveFilePicker({
          excludeAcceptAllOption: true,
          ...rest,
        });
      }

      const writable = await handle.createWritable();

      await writable.write(encode(store.get()));
      await writable.close();
    },
  };

  return store;
}

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
