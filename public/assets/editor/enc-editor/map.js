/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { createMap } from '../../game/enc-game/map.js';

export function renderMap({ ctx, map }) {
	ctx.save();

	ctx.fillStyle = 'hsl(162 100% 50% / 30%)';
	ctx.fill(map.gas.path);

	ctx.fillStyle = 'hsl(210 100% 50% / 30%)';
	ctx.fill(map.tow.path);

	ctx.fillStyle = 'hsl(0 0% 0% / 30%)';
	ctx.fill(map.ice.path);

	ctx.restore();
}
