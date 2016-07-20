const preset = {
    id: 'deftones',
    description: 'Deftones',
    settings: {
        config: {
            bpm            : 90,
        },
        beats: [
            {
                id    : 'total',
                bars  : 4,
                beats : 4,
            },
            {
                id          : 'RAND_BEAT_1',
                description : 'Guitars',
                bars        : 4,
                beats       : 4,
                hitChance   : 1,
                allowedLengths : [
                    {
                        id: "1",
                        amount: 1,
                    },
                    {
                        id: "2",
                        amount: 1,
                    },
                ],
            },
            {
                id          : 'RAND_BEAT_2',
                description : 'Bass drum',
                bars        : 1,
                beats       : 4,
                hitChance   : .5,
                allowedLengths : [
                    {
                        id: "1",
                        amount: 4,
                    },
                    {
                        id: "2",
                        amount: 2,
                    },
                    {
                        id: "4",
                        amount: 1,
                    },
                ],
            },
            {
                id          : 'RAND_BEAT_3',
                description : 'Hihat',
                bars        : 2,
                beats       : 4,
                hitChance   : 1,
                allowedLengths : [
                    {
                        id: "1",
                        amount: 1,
                    },
                    {
                        id: "2",
                        amount: 8,
                    },
                    {
                        id: "4",
                        amount: 2,
                    },
                ],
            },
        ],
        instruments: [
            {
                id: 'g',
                repeatHitTypeForXBeat: 8,
                sounds: [
                    {
                        id: 'sixth-4-muted',
                        enabled: true,
                    },
                    {
                        id: 'sixth-8-muted',
                        enabled: true,
                    },
                ],
            },
            {
                id: 'k',
                sequences: [
                    'RAND_BEAT_2',
                ],
                sounds: [
                    {
                        id: 'k',
                        enabled: true,
                    }
                ],
            },
            {
                id: 's',
                sounds: [
                    {
                        id: 's',
                        enabled: true,
                    }
                ],
            },
            {
                id: 'c',
                sequences: [
                    [
                       { beat: .25, volume: 1 },
                   ]
                ],
                sounds: [
                    {
                        id: 'crash-left',
                        enabled: true,
                    },
                    {
                        id: 'crash-right',
                        enabled: true,
                    },
                ],
            },
            {
                id: 'h',
                sequences: [
                    'RAND_BEAT_3',
                ],
                sounds: [
                    {
                        id: 'h',
                        enabled: true,
                    },
                    {
                        id: 'hc',
                        enabled: true,
                    },
                ],
            },
            {
                id: 'd',
                sounds: [
                    {
                        id: 'drone-high',
                        enabled: false,
                    },
                ],
            },
        ]
    }
}

export default preset;
