import {
    loopSequence,
    generateTimeMap,
} from './sequences';

import {
    randFromTo,
    repeatArray,
} from './tools';

import { playSound } from './audio';

const defaultInstrument = {
    id: '',
    buffers: [],
    durations: [],
    hitTypes: [],
    sounds: [],
    sequence: [],
    sources: [],
    timeMap: [],
}

const getInstrumentsSequences = (instruments, sequences, totalBeats) => Object.keys(sequences).map(instrumentId => ({ ...instruments.find(i => i.id === instrumentId), sequence: loopSequence(sequences[instrumentId]) }));

const generateInstrumentTimeMap = (instrument) => {
    const timeMap = generateTimeMap(instrument.sequence);

    return {
        ...instrument,
        timeMap
    }
}

const generateInstrumentHitTypes = (instrument) => {
    const activeSounds = instrument.sounds.reduce((newArr, sound, i) => sound.enabled ? [ ...newArr, { ...sound, index: i } ] : newArr, []);
    let hitTypes = [];

    if (activeSounds.length) {
        hitTypes = instrument.sequence.map((hit) => activeSounds[randFromTo(0, activeSounds.length-1)].index);
    }

    return {
        ...instrument,
        hitTypes
    }
}

const renderInstrumentSoundsAtTempo = (instruments, totalBeats, bpmMultiplier) => {
    const timeLength = totalBeats * bpmMultiplier;
    const offlineCtx = new OfflineAudioContext(2, 44100 * timeLength, 44100);

    instruments.forEach((instrument) => {
        let startTimes = [];
        let durations  = [];
        const sources = instrument.timeMap.reduce((sources, time, i) => {
            const instrumentSound = instrument.buffers[instrument.hitTypes[i]];
            const startTime       = offlineCtx.currentTime + (time * bpmMultiplier);
            const duration        = instrument.ringout ? instrumentSound.duration : (1 / instrument.sequence[i].beat) * bpmMultiplier;
            const source          = playSound(offlineCtx, instrumentSound, startTime, duration, instrument.sequence[i].volume, 0);

            startTimes[i] = startTime;
            durations[i]   = duration;

            return [ ...sources, source ];
        }, []);
    })
    return new Promise((res, rej) => {
        offlineCtx.oncomplete = ev => res(ev.renderedBuffer);
        offlineCtx.onerror    = ev => rej(ev.renderedBuffer);
        offlineCtx.startRendering();
    })
}

const repeatHits = instrument => {
    const hitTypes = repeatArray(instrument.hitTypes, instrument.sequence.length);

    return {
        ...instrument,
        hitTypes
    }
}

const repeatSequence = (instrument, beats) => {
    const sequence = loopSequence(instrument.sequence, beats);

    return {
        ...instrument,
        sequence
    }
}


export {
    getInstrumentsSequences,
    generateInstrumentTimeMap,
    generateInstrumentHitTypes,
    renderInstrumentSoundsAtTempo,
    repeatHits,
    repeatSequence,
}
