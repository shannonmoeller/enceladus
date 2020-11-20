/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement, refs } from './vendor/dhtml.js';
import { createContext } from './vendor/game.js';
import { createFluid } from './fluid.js';

defineElement('enc-fluid', (el) => {
	const { canvasEl } = refs(el);
	const ctx = createContext(canvasEl);
	const fluid = createFluid(ctx);
	let isDown = false;
	let isDragging = false;

	function unhandle(event) {
		event.preventDefault();
	}

	function handleResize() {
		fluid.resize();
	}

	function handleClick(event) {
		if (isDragging) {
			isDragging = false;
			return;
		}

		event.preventDefault();
	}

	function handlePointerDown() {
		isDown = true;
	}

	function handlePointerUp() {
		isDown = false;
	}

	function handlePointerMove(event) {
		if (isDown) {
			isDragging = true;
			fluid.add(event.offsetX, event.offsetY);
		}
	}

	function handleWheel(event) {
		event.preventDefault();
		fluid.camera.z *= Math.pow(1.01, -event.deltaY);
	}

	visualViewport.addEventListener('resize', handleResize, { passive: true });

	canvasEl.addEventListener('click', handleClick);
	canvasEl.addEventListener('contextmenu', unhandle);
	canvasEl.addEventListener('pointerdown', handlePointerDown);
	canvasEl.addEventListener('pointermove', handlePointerMove);
	canvasEl.addEventListener('pointerup', handlePointerUp);
	canvasEl.addEventListener('pointerout', handlePointerUp);
	canvasEl.addEventListener('wheel', handleWheel);

	window.fluid = fluid;
	fluid.start();
});
