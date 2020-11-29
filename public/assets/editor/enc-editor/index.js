/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import {
	defineElement,
	refs,
} from 'https://code.shannonmoeller.com/dhtml/v1.0.0/dhtml.js';

import { createEditor } from './editor.js';

defineElement('enc-editor', (el) => {
	const { canvasEl, openEl, saveEl, saveAsEl, playEl } = refs(el);
	const editor = createEditor(canvasEl);

	let isDown = false;
	let isDragging = false;

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

	function handleOpen() {
		editor.file.open(true);
	}

	function handleSave() {
		editor.file.save();
	}

	function handleSaveAs() {
		editor.file.save(true);
	}

	function handlePlay() {
		window.open('/v2/test.html', 'playtest');
	}

	function handleConnect() {
		visualViewport.addEventListener('resize', editor.resize, {
			passive: true,
		});

		editor.start();
	}

	function handleDisconnect() {
		editor.stop();

		visualViewport.removeEventListener('resize', editor.resize, {
			passive: true,
		});
	}

	el.addEventListener('connect', handleConnect);
	el.addEventListener('disconnect', handleDisconnect);

	canvasEl.addEventListener('click', handleClick);
	canvasEl.addEventListener('contextmenu', handleRightClick);
	canvasEl.addEventListener('pointerdown', handlePointerDown);
	canvasEl.addEventListener('pointermove', handlePointerMove);
	canvasEl.addEventListener('pointerup', handlePointerUp);
	canvasEl.addEventListener('pointerout', handlePointerUp);
	canvasEl.addEventListener('wheel', handleWheel);

	openEl.addEventListener('click', handleOpen);
	saveEl.addEventListener('click', handleSave);
	saveAsEl.addEventListener('click', handleSaveAs);
	playEl.addEventListener('click', handlePlay);

	window.editor = editor;
});
