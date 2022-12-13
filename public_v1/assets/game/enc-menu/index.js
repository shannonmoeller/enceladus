/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement } from '../../vendor/define.js';
import { refs } from '../../vendor/refs.js';
import { route, checkpoint, deaths, distance, time } from '../state.js';

defineElement('enc-menu', (el) => {
  const { continueEl, newEl, howToEl, optionsEl, creditsEl } = refs(el);

  checkpoint.subscribe((state) => {
    continueEl.disabled = !state;
  });

  continueEl.onclick = () => {
    distance.set(checkpoint.get());
    route.set('game');
  };

  newEl.onclick = () => {
    deaths.set(0);
    checkpoint.set(0);
    distance.set(0);
    time.set(0);
    route.set('game');
  };

  howToEl.onclick = () => {
    route.set('howTo');
  };

  optionsEl.onclick = () => {
    route.set('options');
  };

  creditsEl.onclick = () => {
    route.set('credits');
  };
});
