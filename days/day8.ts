const fs = require('fs')

const UNKNOWN = 'UNKNOWN';
let ZERO = UNKNOWN; //will eventually have a value like 'ab' 
let ONE = UNKNOWN;
let TWO = UNKNOWN;
let THREE = UNKNOWN;
let FOUR = UNKNOWN;
let FIVE = UNKNOWN;
let SIX = UNKNOWN;
let SEVEN = UNKNOWN;
let EIGHT = UNKNOWN;
let NINE = UNKNOWN;

//     0
// 1  |-| 2
//     3
//     -
// 4  |_| 5
//     6
//can use Oject.values(displayMap).indexOf(LETTER) to get segment position of letter
let displayMap = {
    '0': UNKNOWN,
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

function getSequences(sequence: string, length: number): string[] {
    let results: string[] = [];
    let sequences = sequence.split(' ');
    for (const seq of sequences) {
        if (seq.length == length) {
            results.push(seq);
        }
    }
    return results;
}

/**
 * used to calculate the set difference between two sequences. only use with examples such as:
 * seq0 = abc, seq0 = abcd <-- returns 'd'
 * seq0 = defg, seq1 = dfg <-- returns 'e'
 */
function tokenDiff(seq0: string, seq1: string): string {
    if (Math.abs(seq0.length - seq0.length) > 1) {
        throw new Error("can't use tokenDiff this way");
    }

    if (seq0.length > seq1.length) {
        for (let i = 0; i < seq1.length; i++) {
            seq0 = seq0.replace(seq1[i], '');
        }
        return seq0
    }

    for (let i = 0; i < seq0.length; i++) {
        seq1 = seq1.replace(seq0[i], '');
    }
    return seq1
}

//finds the first token in seq0 that is not in seq1
function tokenDiffOrdered(seq0: string, seq1: string): string {
    let char = '';

    for (let i = 0; i < seq0.length; i++) {
        if (!seq1.includes(seq0[i])) {
            char = seq0[i];
            break;
        }
    }
    return char;
}

function tokenIntersection(seq0: string, seq1: string): string {
    let char = '';

    //eg afcd, efg -> g
    if (seq0.length > seq1.length) {
        for (let i = 0; i < seq1.length; i++) {
            if (seq0.includes(seq1[i])) {
                char += seq1[i];
            }
        }
    }
    else {
        for (let i = 0; i < seq0.length; i++) {
            if (seq1.includes(seq0[i])) {
                char += seq0[i];
            }
        }
    }

    return char;
}

function sequencesEqual(seq0: string, seq1: string): boolean {
    if (seq0.length != seq1.length) {
        return false;
    }

    for (let i = 0; i < seq0.length; i++) {
        if (!seq1.includes(seq0[i]) || !seq0.includes(seq1[i])) {
            return false;
        }
    }

    return true;
}

function validateSegment(segment: string, length: number) {
    if (segment.length != length) {
        throw new Error("Segment validation failed");
    }
}

function getDigitFromSequence(sequence: string): string {
    if (sequencesEqual(sequence, ZERO)) {
        return '0';
    }
    else if (sequencesEqual(sequence, ONE)) {
        return '1';
    }
    else if (sequencesEqual(sequence, TWO)) {
        return '2';
    }
    else if (sequencesEqual(sequence, THREE)) {
        return '3';
    }
    else if (sequencesEqual(sequence, FOUR)) {
        return '4';
    }
    else if (sequencesEqual(sequence, FIVE)) {
        return '5';
    }
    else if (sequencesEqual(sequence, SIX)) {
        return '6';
    }
    else if (sequencesEqual(sequence, SEVEN)) {
        return '7';
    }
    else if (sequencesEqual(sequence, EIGHT)) {
        return '8';
    }
    else if (sequencesEqual(sequence, NINE)) {
        return '9';
    }

    return '-1';
}

function getNumberFromSegments(desiredNumber: string): string {
    if (desiredNumber == 'six') {
        return [displayMap[0], displayMap[1], displayMap[4], displayMap[6], displayMap[5], displayMap[3]].join('')
    }
    else if (desiredNumber == 'nine') {
        return [displayMap[6], displayMap[5], displayMap[2], displayMap[0], displayMap[1], displayMap[3]].join('');
    }

    return "it broke";
}

function getLastChar(): string {
    let fullSet = 'abcdefg';
    for (let segment in displayMap) {
        //@ts-ignore
        if (fullSet.includes(displayMap[segment])) {
            //@ts-ignore
            fullSet = fullSet.replace(displayMap[segment], '');
        }
    }
    return fullSet;
}


function processSequence(sequence: string) {
    //1, 4, 7, 8
    let tokens = sequence.split(' ');

    ONE = getSequences(sequence, 2)[0];
    SEVEN = getSequences(sequence, 3)[0];
    FOUR = getSequences(sequence, 4)[0];
    EIGHT = getSequences(sequence, 7)[0];

    //get segment 0, 7 and 1 overlap at a single segment
    let segment0 = tokenDiff(ONE, SEVEN);
    validateSegment(segment0, 1);
    displayMap[0] = segment0;

    let twoThreeAndFive = getSequences(sequence, 5);

    let test1 = tokenIntersection(twoThreeAndFive[0], ONE);
    let test2 = tokenIntersection(twoThreeAndFive[1], ONE);
    let test3 = tokenIntersection(twoThreeAndFive[2], ONE);
    let twoAndFive = [];
    //the test sequence that has two overlapping with 1 is three
    if (test1.length == 2) {
        THREE = twoThreeAndFive[0];
        twoAndFive = [twoThreeAndFive[1], twoThreeAndFive[2]];
    }
    else if (test2.length == 2) {
        THREE = twoThreeAndFive[1];
        twoAndFive = [twoThreeAndFive[0], twoThreeAndFive[2]];
    }
    else {
        THREE = twoThreeAndFive[2];
        twoAndFive = [twoThreeAndFive[0], twoThreeAndFive[1]];
    }
    let segment1 = tokenDiffOrdered(FOUR, THREE);
    displayMap[1] = segment1;

    //now we can figure out five given segment1
    if (twoAndFive[0].includes(displayMap[1])) {
        FIVE = twoAndFive[0];
        TWO = twoAndFive[1];
    }
    else {
        TWO = twoAndFive[0];
        FIVE = twoAndFive[1];
    }

    let segment5 = tokenIntersection(FIVE, ONE);
    let segment2 = tokenIntersection(TWO, ONE);
    displayMap[5] = segment5;
    displayMap[2] = segment2;

    let segment4 = tokenDiffOrdered(TWO, THREE);
    displayMap[4] = segment4;

    let sixNineZero = getSequences(sequence, 6);
    //zero is the one that contains both segment2 and 4 
    for (let i in sixNineZero) {
        if (sixNineZero[i].includes(segment4) && sixNineZero[i].includes(segment2)) {
            ZERO = sixNineZero[i];
        }
    }
    let segment3 = tokenDiffOrdered(THREE, ZERO);
    displayMap[3] = segment3;
    displayMap[6] = getLastChar();

    SIX = getNumberFromSegments('six');
    NINE = getNumberFromSegments('nine');
}

function resetDisplayMap() {
    displayMap = {
        '0': UNKNOWN,
        '1': UNKNOWN,
        '2': UNKNOWN,
        '3': UNKNOWN,
        '4': UNKNOWN,
        '5': UNKNOWN,
        '6': UNKNOWN
    }
    ONE = TWO = THREE = FOUR = FIVE = SIX = SEVEN = EIGHT = NINE = UNKNOWN;
}



export function run() {
    let debug = false;
    let debugSums = [8394, 9781, 1197, 9361, 4873, 8418, 4548, 1625, 8717, 4315];
    let data = readData(debug);

    processSequence('acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab');

    let digit = getDigitFromSequence('fcadb');
    let output: string[] = 'cdfeb fcadb cdfeb cdbaf'.split(' ');
    output = output.map((seq) => getDigitFromSequence(seq));

    let allSignals = data[0];
    let allNumbers = data[1];
    let sum = 0;
    for (let i = 0; i < allSignals.length; i++) {
        resetDisplayMap();
        processSequence(allSignals[i]);
        let thisNumber: string[] = allNumbers[i].split(' ');
        let number = thisNumber.map((seq) => getDigitFromSequence(seq));
        sum += parseInt(number.join(''));
    }

    console.log('sum = ', sum);
}