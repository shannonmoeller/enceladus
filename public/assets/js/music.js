/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

const NOTES = {
	'C': 16.35,
	'C#': 17.32,
	'Db': 17.32,
	'D': 18.35,
	'D#': 19.45,
	'Eb': 19.45,
	'E': 20.6,
	'F': 21.83,
	'F#': 23.12,
	'Gb': 23.12,
	'G': 24.5,
	'G#': 25.96,
	'Ab': 25.96,
	'A': 27.5,
	'A#': 29.14,
	'Bb': 29.14,
	'B': 30.87,
};

for (const [key, hz] of Object.entries(NOTES)) {
	for (let i = 0; i < 10; i++) {
		NOTES[`${key}${i}`] = hz * Math.pow(2, i);
	}
}

// prettier-ignore
const prelude = [
	'G2', 'D3', 'B3', 'A3', 'B3', 'D3', 'B3', 'D3', 'G2', 'D3', 'B3', 'A3',
	'B3', 'D3', 'B3', 'D3', 'G2', 'E3', 'C4', 'B3', 'C4', 'E3', 'C4', 'E3',
	'G2', 'E3', 'C4', 'B3', 'C4', 'E3', 'C4', 'E3', 'G2', 'F#3', 'C4', 'B3',
	'C4', 'F#3', 'C4', 'F#3', 'G2', 'F#3', 'C4', 'B3', 'C4', 'F#3', 'C4', 'F#3',
	'G2', 'G3', 'B3', 'A3', 'B3', 'G3', 'B3', 'G3', 'G2', 'G3', 'B3', 'A3',
	'B3', 'G3', 'B3', 'F#3', 'G2', 'E3', 'B3', 'A3', 'B3', 'G3', 'F#3', 'G3',
	'E3', 'G3', 'F#3', 'G3', 'B2', 'D3', 'C#3', 'B2', 'C#3', 'G3', 'A3', 'G3',
	'A3', 'G3', 'A3', 'G3', 'C#3', 'G3', 'A3', 'G3', 'A3', 'G3', 'A3', 'G3',
	'F#3', 'A3', 'D4', 'C#4', 'D4', 'A3', 'G3', 'A3', 'F#3', 'A3', 'G3', 'A3',
	'D3', 'F#3', 'E3', 'D3', 'E2', 'B2', 'G3', 'F#3', 'G3', 'B2', 'G3', 'B2',
	'E2', 'B2', 'G3', 'F#3', 'G3', 'B2', 'G3', 'B2', 'E2', 'C#3', 'D3', 'E3',
	'D3', 'C#3', 'B2', 'A2', 'G3', 'F#3', 'E3', 'D4', 'C#4', 'B3', 'A3', 'G3',
	'F#3', 'E3', 'D3', 'D4', 'A3', 'D4', 'F#3', 'A3', 'D3', 'E3', 'F#3', 'A3',
	'G3', 'F#3', 'E3', 'D3', 'G#3', 'D3', 'F3', 'E3', 'F3', 'D3', 'G#3', 'D3',
	'B3', 'D3', 'F3', 'E3', 'F3', 'D3', 'G#3', 'D3', 'C3', 'E3', 'A3', 'B3',
	'C4', 'A3', 'E3', 'D3', 'C3', 'E3', 'A3', 'B3', 'C4', 'A3', 'F#3', 'E3',
	'D#3', 'F#3', 'D#3', 'F#3', 'A3', 'F#3', 'A3', 'F#3', 'D#3', 'F#3', 'D#3', 'F#3',
	'A3', 'F#3', 'A3', 'F#3', 'G3', 'F#3', 'E3', 'G3', 'F#3', 'G3', 'A3', 'F#3',
	'G3', 'F#3', 'E3', 'D3', 'C3', 'B2', 'A2', 'G2', 'F#2', 'C3', 'D3', 'C3',
	'D3', 'C3', 'D3', 'C3', 'F#2', 'C3', 'D3', 'C3', 'D3', 'C3', 'D3', 'C3',
	'G2', 'B2', 'F3', 'E3', 'F3', 'B2', 'F3', 'B2', 'G2', 'B2', 'F3', 'E3',
	'F3', 'B2', 'F3', 'B2', 'G2', 'C3', 'E3', 'D3', 'E3', 'C3', 'E3', 'C3',
	'G2', 'C3', 'E3', 'D3', 'E3', 'C3', 'E3', 'C3', 'G2', 'F#3', 'C4', 'B3',
	'C4', 'F#3', 'C4', 'F#3', 'G2', 'F#3', 'C4', 'B3', 'C4', 'F#3', 'C4', 'F#3',
	'G2', 'D3', 'B3', 'A3', 'B3', 'G3', 'F#3', 'E3', 'D3', 'C3', 'B2', 'A2',
	'G2', 'F#2', 'E2', 'D2', 'C#2', 'A2', 'E3', 'F#3', 'G3', 'E3', 'F#3', 'G3',
	'C#2', 'A2', 'E3', 'F#3', 'G3', 'E3', 'F#3', 'G3', 'C2', 'A2', 'D3', 'E3',
	'F#3', 'D3', 'E3', 'F#3', 'C2', 'A2', 'D3', 'E3', 'F#3', 'D3', 'E3', 'F#3',
	'C2', 'A2', 'D3', 'F#3', 'A3', 'C#4', 'D4', 'A2', 'B2', 'C3', 'D3', 'E3',
	'F#3', 'G3', 'A3', 'F#3', 'D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C4', 'A3',
	'F#3', 'G3', 'A3', 'B3', 'C4', 'D4', 'D#4', 'D4', 'C#4', 'D4', 'D4', 'C4',
	'B3', 'C4', 'C4', 'A3', 'F#3', 'E3', 'D3', 'A2', 'B2', 'C3', 'D2', 'A2',
	'D3', 'F#3', 'A3', 'B3', 'C4', 'A3', 'B3', 'G3', 'D3', 'C3', 'B2', 'G2',
	'A2', 'B2', 'D2', 'G2', 'B2', 'D3', 'G3', 'A3', 'B3', 'G3', 'C#4', 'A#3',
	'A3', 'A#3', 'A#3', 'A3', 'G#3', 'A3', 'A3', 'G3', 'F#3', 'G3', 'G3', 'E3',
	'C#3', 'B2', 'A2', 'C#3', 'E3', 'G3', 'A3', 'C#4', 'D4', 'C#4', 'D4', 'A3',
	'F#3', 'E3', 'F#3', 'A3', 'D3', 'F#3', 'A2', 'D3', 'C#3', 'B2', 'A2', 'G2',
	'F#2', 'E2', 'D2', 'C4', 'B3', 'A3', 'G3', 'F#3', 'E3', 'D3', 'C4', 'B3',
	'A3', 'G3', 'F#3', 'E3', 'D3', 'C3', 'B3', 'A3', 'G3', 'F#3', 'E3', 'D3',
	'C3', 'B2', 'A3', 'G3', 'F#3', 'E3', 'D3', 'C3', 'B2', 'A2', 'G3', 'F#3',
	'E3', 'F#3', 'A3', 'D3', 'A3', 'E3', 'A3', 'F#3', 'A3', 'G3', 'A3', 'E3',
	'A3', 'F#3', 'A3', 'D3', 'A3', 'G3', 'A3', 'E3', 'A3', 'F#3', 'A3', 'D3',
	'A3', 'G3', 'A3', 'E3', 'A3', 'F#3', 'A3', 'D3', 'A3', 'E3', 'A3', 'F#3',
	'A3', 'G3', 'A3', 'A3', 'A3', 'B3', 'A3', 'D3', 'A3', 'A3', 'A3', 'B3',
	'A3', 'C4', 'A3', 'D3', 'A3', 'B3', 'A3', 'C4', 'A3', 'D4', 'A3', 'B3',
	'A3', 'C4', 'A3', 'B3', 'A3', 'C4', 'A3', 'A3', 'A3', 'B3', 'A3', 'A3',
	'A3', 'B3', 'A3', 'G3', 'A3', 'A3', 'A3', 'G3', 'A3', 'A3', 'A3', 'F#3',
	'A3', 'G3', 'A3', 'F#3', 'A3', 'G3', 'A3', 'E3', 'A3', 'F#3', 'A3', 'D3',
	'E3', 'F3', 'D3', 'F#3', 'D3', 'G3', 'D3', 'G#3', 'D3', 'A3', 'D3', 'A#3',
	'D3', 'B3', 'D3', 'C4', 'D3', 'C#4', 'D3', 'D4', 'D3', 'D#4', 'D3', 'E4',
	'D3', 'F4', 'D3', 'F#4', 'D3', 'G4', 'B3', 'D3', 'B3', 'G4', 'B3', 'G4',
	'B3', 'G4', 'B3', 'D3', 'B3', 'G4', 'B3', 'G4', 'B3', 'G4', 'A3', 'D3',
	'A3', 'G4', 'A3', 'G4', 'A3', 'G4', 'A3', 'D3', 'A3', 'G4', 'A3', 'G4',
	'A3', 'F#4', 'C4', 'D3', 'C4', 'F#4', 'C4', 'F#4', 'C4', 'F#4', 'C4', 'D3',
	'C4', 'F#4', 'C4', 'F#4', 'C4', 'G4',
];

const audio = new (window.AudioContext || window.webkitAudioContext)();

function createDistortion(amount) {
	const samples = 256;

	return new Float32Array(samples).map((_, i) => {
		let x = (i * 2) / samples - 1;
		return (x * (Math.PI + amount)) / (Math.PI + amount * Math.abs(x));
	});
}

export async function playSong() {
	const attack = 0.001;
	const decay = 0.04;

	const oscillatorNodeA = audio.createOscillator();
	oscillatorNodeA.frequency.setValueAtTime(
		NOTES[prelude[0]],
		audio.currentTime
	);
	oscillatorNodeA.type = 'triangle';

	const oscillatorNodeB = audio.createOscillator();
	oscillatorNodeB.detune.setValueAtTime(300, audio.currentTime);
	oscillatorNodeB.frequency.setValueAtTime(
		NOTES[prelude[0]],
		audio.currentTime
	);
	oscillatorNodeB.type = 'sine';

	const waveNode = audio.createWaveShaper();
	waveNode.curve = createDistortion(100);

	const gainNode = audio.createGain();

	const compressor = audio.createDynamicsCompressor();
	compressor.threshold.setValueAtTime(-50, audio.currentTime);
	compressor.knee.setValueAtTime(40, audio.currentTime);
	compressor.ratio.setValueAtTime(12, audio.currentTime);
	compressor.attack.setValueAtTime(0, audio.currentTime);
	compressor.release.setValueAtTime(0.25, audio.currentTime);

	oscillatorNodeA.connect(gainNode);
	oscillatorNodeB.connect(waveNode);
	waveNode.connect(gainNode);
	gainNode.connect(compressor);
	compressor.connect(audio.destination);

	oscillatorNodeA.start(audio.currentTime);
	oscillatorNodeB.start(audio.currentTime);
	gainNode.gain.setValueAtTime(0.0001, audio.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(1, audio.currentTime + attack);

	for (const note of prelude.slice(0, 9)) {
		oscillatorNodeA.frequency.exponentialRampToValueAtTime(
			NOTES[note],
			audio.currentTime + attack
		);
		oscillatorNodeB.frequency.exponentialRampToValueAtTime(
			NOTES[note],
			audio.currentTime + attack
		);
		await sleep(250);
	}

	gainNode.gain.setValueAtTime(1, audio.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + decay);
	oscillatorNodeA.stop(audio.currentTime + decay);
	oscillatorNodeB.stop(audio.currentTime + decay);
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}
