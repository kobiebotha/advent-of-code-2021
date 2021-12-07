const fs = require('fs')

function readInputs(): string[] {
    let entries: string[] = [];

    try {
        const data = fs.readFileSync('./inputs/day3', 'utf8');

        entries = data.split('\n');
        
      } catch (err) {
        console.error(err)
      }

    return entries;
}

export function run() {
    let gamma = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let epsilon = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const inputs = readInputs();
    const numEntries = inputs.length;

    const diagLength = 12;
    let ones: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


    ones = countBits(inputs, diagLength);

    for (let i = 0; i < diagLength; i++) {
        if (ones[i] > numEntries/2) {
            gamma[i] = 1;
        }
        else {
            epsilon[i] = 1;
        }
    }

    const gammaInt = parseInt(gamma.join(''), 2)
    const epsInt = parseInt(epsilon.join(''), 2)

    //35
    console.log('result = ', gammaInt*epsInt);
    // 000000011010
    // 011001111011
    // 011001122021
}

function countBits(inputs: string[], diagLength: number): number[] {
    let ones: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    inputs.forEach(element => {
        for (let i = 0; i < diagLength; i++) {
            if (element[i] == '1') {
                ones[i]++;
            }
        }
    });
    return ones;
}

function countZeros(inputs: string[], diagLength: number): number[] {
    let zeros: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    inputs.forEach(element => {
        for (let i = 0; i < diagLength; i++) {
            if (element[i] == '0') {
                zeros[i]++;
            }
        }
    });
    return zeros;
}

function stripNumbers(input: string[], index: number, requiredValue: string): string[] {
    let result: string[] = [];

    input.forEach(element => {
        if (element[index] == requiredValue) {
            result.push(element);
        }
    });

    return result;
}

export function runPart2() {
    const inputs = readInputs();

    // const inputs: string[] = ['00100',
    //     '11110',
    //     '10110',
    //     '10111',
    //     '10101',
    //     '01111',
    //     '00111',
    //     '11100',
    //     '10000',
    //     '11001',
    //     '00010',
    //     '01010']
    // const diagLength = 5;

    const diagLength = 12;
    let oxygenNumbers = inputs;
    let co2Numbers = inputs;
    
    //oxygen
    for (let i = 0; i < diagLength; i++) {
        let ones = countBits(oxygenNumbers, diagLength);
        let numEntries = oxygenNumbers.length;

        if (ones[i] >= numEntries/2) {
            //1 is most common or equal, keep numbers with a 1 in this position
            oxygenNumbers = stripNumbers(oxygenNumbers, i, '1');
        }
        else {
            //zero is most common, keep numbers with a 0 in this position
            oxygenNumbers = stripNumbers(oxygenNumbers, i, '0');
        }

        if (oxygenNumbers.length == 1) {
            break;
        }
    }

    //co2
    for (let i = 0; i < diagLength; i++) {
        let zeros = countZeros(co2Numbers, diagLength);
        let numEntries = co2Numbers.length;

        if (zeros[i] <= numEntries/2) {
            //0 is the least common or equal, keep numbers with a 0 in this position
            co2Numbers = stripNumbers(co2Numbers, i, '0');
        }
        else {
            //1 is most common, keep numbers with a 0 in this position
            co2Numbers = stripNumbers(co2Numbers, i, '1');
        }

        if (co2Numbers.length == 1) {
            break;
        }
    }

    const oxygenInt = parseInt(oxygenNumbers[0], 2)
    const co2Int = parseInt(co2Numbers[0], 2)

    console.log('result = ', oxygenInt*co2Int);

}

