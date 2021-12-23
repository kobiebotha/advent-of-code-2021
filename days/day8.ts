const fs = require('fs')

const UNKNOWN = 'UNKNOWN';

//can use Oject.values(displayMap).indexOf(LETTER) to get segment position of letter
let displayMap = {
    '0' : UNKNOWN,
    '1': UNKNOWN,
    '2': UNKNOWN,
    '3': UNKNOWN,
    '4': UNKNOWN,
    '5': UNKNOWN,
    '6': UNKNOWN
}

const getKnownSegments = (): object => {
    let result = {}
    for (const segment in displayMap) {
        //@ts-ignore
        if (displayMap[segment] !== UNKNOWN) {
            //@ts-ignore
            result[segment] = displayMap[segment];
        }
    }

    return result;
}

const getUnknownSegments = () => {
    let result = {}
    for (const segment in displayMap) {
        //@ts-ignore
        if (displayMap[segment] === UNKNOWN) {
            //@ts-ignore
            result[segment] = displayMap[segment];
        }
    }

    return result;
}

const readData = (debug: boolean): string[][] => {
    let inputSignals: string[] = []; 
    let outputs: string[] = [];

    try {
        let path = debug ? './inputs/day8/test' : './inputs/day8/puzzle'
        const data = fs.readFileSync(path, 'utf8');

        let allLines = data.split('\n')

        allLines.forEach((thisLine: string) => {
            let inout = thisLine.split('|')
            inputSignals.push(inout[0].trim());
            outputs.push(inout[1].trim());
        });

    } catch (err) {
        console.error(err)
    }
    let inoutPairs = [inputSignals, outputs];

    return inoutPairs;
}

const countOutputs = (outputs: string[]): number => {
    let count = 0;

    outputs.map((thisLine) => {
        let signals = thisLine.split(' ');
        signals.forEach((signal) => {
            if ((signal.length == 2) || 
            (signal.length == 4) ||
            (signal.length == 3) ||
            (signal.length == 7)
            ) {
                count++;
            }
        })
    })
    return count;
}

export function run() {
    let debug = true;
    let debugSums = [8394,9781,1197,9361,4873,8418,4548,1625,8717,4315];
    let data = readData(debug);
    let count = countOutputs(data[1]);
    console.log('it ran, count = ', count);
}