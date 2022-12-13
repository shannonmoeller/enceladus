/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

export function renderCursor({ ctx, pointer }) {
  ctx.save();

  ctx.fillStyle = 'white';
  ctx.fillRect(pointer.x, pointer.y, 20, 20);

  ctx.restore();
}
