/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

export function applyViewport({ ctx, viewport }) {
	ctx.save();
	ctx.scale(viewport.scale, viewport.scale);
	ctx.translate(viewport.x, viewport.y);
}

export function restoreViewport({ ctx }) {
	ctx.restore();
}

export function updateViewport({ ctx, camera, viewport }) {
	const { height, width } = ctx;
	let { x = 0, y = 0, z = 1 } = camera;

	const scale = Math.max(0, z);
	const scaledHeight = height / scale;
	const scaledWidth = width / scale;
	const halfScaledHeight = scaledHeight / 2;
	const halfScaledWidth = scaledWidth / 2;

	viewport.scale = scale;
	viewport.height = scaledHeight;
	viewport.width = scaledWidth;

	viewport.x = halfScaledWidth - x;
	viewport.y = halfScaledHeight - y;
	viewport.top = y - halfScaledHeight;
	viewport.bottom = y + halfScaledHeight;
	viewport.left = x - halfScaledWidth;
	viewport.right = x + halfScaledWidth;
}
