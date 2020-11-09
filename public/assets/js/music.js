/**
 * Copyright © Shannon Moeller. All rights reserved. Learn, don't loot.
 */

import { lune } from '../data/lune.js';
import { prelude } from '../data/prelude.js';

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

console.log(NOTES);

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audio = null;

function createDistortion(amount) {
	const samples = 256;

	return new Float32Array(samples).map((_, i) => {
		let x = (i * 2) / samples - 1;
		return (x * (Math.PI + amount)) / (Math.PI + amount * Math.abs(x));
	});
}

export async function playSong() {
	audio = audio || new AudioContext();

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
