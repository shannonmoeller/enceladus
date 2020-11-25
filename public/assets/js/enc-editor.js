/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { defineElement, refs } from './vendor/dhtml.js';
import { createContext } from './vendor/game.js';
import { createEditor } from './editor.js';

defineElement('enc-editor', (el) => {
	const { canvasEl } = refs(el);
	const ctx = createContext(canvasEl);
	const editor = createEditor(ctx);

	let isDown = false;
	let isDragging = false;

	function handleResize() {
		editor.resize();
	}

	function handleClick(event) {
		if (isDragging) {
			isDragging = false;
			return;
		}

		event.preventDefault();
		editor.add();
	}

	function handleRightClick(event) {
		if (isDragging) {
			isDragging = false;
			return;
		}

		event.preventDefault();
		editor.remove();
	}

	function handlePointerDown() {
		isDown = true;
	}

	function handlePointerUp() {
		isDown = false;
	}

	function handlePointerMove(event) {
		editor.pointer.x = event.offsetX;
		editor.pointer.y = event.offsetY;

		if (isDown) {
			isDragging = true;
			editor.camera.x -= event.movementX / editor.camera.z;
			editor.camera.y -= event.movementY / editor.camera.z;
		}
	}

	function handleWheel(event) {
		event.preventDefault();
		editor.camera.z *= Math.pow(1.01, -event.deltaY);
	}

	visualViewport.addEventListener('resize', handleResize, { passive: true });

	canvasEl.addEventListener('click', handleClick);
	canvasEl.addEventListener('contextmenu', handleRightClick);
	canvasEl.addEventListener('pointerdown', handlePointerDown);
	canvasEl.addEventListener('pointermove', handlePointerMove);
	canvasEl.addEventListener('pointerup', handlePointerUp);
	canvasEl.addEventListener('pointerout', handlePointerUp);
	canvasEl.addEventListener('wheel', handleWheel);

	window.editor = editor;
	editor.start();
});
