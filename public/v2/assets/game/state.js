/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { createStore } from 'https://code.shannonmoeller.com/store/v1.0.0/store.js';
import { createLocalStore } from 'https://code.shannonmoeller.com/store/v1.0.0/local.js';

export const route = createStore('menu');

export const quality = createLocalStore('quality', 1);
export const volume = createLocalStore('volume', 1);

export const deaths = createLocalStore('deaths', 0);
export const distance = createStore('distance', 0);
export const checkpoint = createLocalStore('checkpoint', 0);
export const time = createLocalStore('time', 0);
