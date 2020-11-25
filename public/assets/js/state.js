/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { createStore } from './vendor/store.js';
import { createLocalStore } from './store.js';

export const route = createStore('menu');

export const quality = createLocalStore('quality', 1);
export const volume = createLocalStore('volume', 1);

export const deaths = createLocalStore('deaths', null);
export const distance = createLocalStore('distance', null);
export const checkpoint = createLocalStore('checkpoint', null);
export const time = createLocalStore('time', null);
