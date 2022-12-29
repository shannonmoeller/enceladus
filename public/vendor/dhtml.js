/*!
 * @license MIT
 * Copyright (c) 2022 Shannon Moeller
 * https://github.com/shannonmoeller/code
 */

export function defineElement(name, init, options) {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
        init(this);
      }
    },
    options
  );
}
