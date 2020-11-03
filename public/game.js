export function createGame(canvas) {
	let left = false;
	let right = false;

	return {
		set left(value) {
			console.log('left', value);
			left = value;
		},

		set right(value) {
			console.log('right', value);
			right = value;
		},

		start() {
			console.log('start');
		},

		pause() {
			console.log('pause');
		},
	};
}
