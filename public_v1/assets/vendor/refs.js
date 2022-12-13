/**
 * MIT (c) Shannon Moeller https://code.shannonmoeller.com
 */

export function refs(node) {
	const refs = {};

	node.querySelectorAll('[ref]').forEach((el) => {
		refs[el.getAttribute('ref')] = el;
		el.removeAttribute('ref');
	});

	return refs;
}
