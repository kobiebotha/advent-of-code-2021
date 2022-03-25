const fs = require('fs')

function load(debug: boolean): [string, string][] {
    let results: [string,string][] = [];

    try {
        let path = debug ? './inputs/day14/test' : './inputs/day14/puzzle'
        const data = fs.readFileSync(path, 'utf8');

        let lines: string[] = data.split('\n')

        //load hashes
        lines.forEach(line => {
            let pair = line.split('->');
            results.push([pair[0].trim(), pair[1].trim()]);
        });

    } catch (err) {
        console.error(err)
    }

    return results;
}

export function splitPolymer(polymer: string): string[] {
    let pairs: string[] = [];

    for (let i = 0; i < polymer.length-1; i++) {
        pairs.push(polymer[i] + polymer[i+1]);
    }

    return pairs;
}

export function matchingRule(pair: string, rules: [string, string][]): [string,string] {
    let result: [string, string] = ['NONE', 'NONE'];

    rules.forEach(rule => {
        if (rule[0] == pair) {
            result = rule;
        }
    });

    return result;
}

export function stepPolymer(polymer: string, pairs: string[], rules: [string,string][]): string {
    let newpolymer = polymer[0];

    pairs.forEach(pair => {
        let matchResult = matchingRule(pair, rules);
        if (matchResult != ['NONE', 'NONE']) {
            newpolymer+= matchResult[1] + pair[1];
        }
    });

    return newpolymer;
}

export function analyzePolymer(polymer: string): [number,number] {
    let result: [number, number] = [0, 0];
    let dict = {};

    for (let i = 0; i < polymer.length; i++) {
        //@ts-ignore
        if (dict[polymer[i]] === undefined) {
            //@ts-ignore
            dict[polymer[i]] = 1;
        }
        else {
            //@ts-ignore
            dict[polymer[i]]++;
        }
    }

    let minElement = '!';
    let maxElement = '!';
    let minCount = 99999999999;
    let maxCount = 0;

    for (const key in dict) {
        if (Object.prototype.hasOwnProperty.call(dict, key)) {
            //@ts-ignore
            const value = dict[key];
            if (value < minCount) {
                minCount = value;
                minElement = key;
            }
            if (value > maxCount) {
                maxCount = value;
                maxElement = key;
            }
        }
    }

    result = [maxCount, minCount];

    return result;
}

export function fizzBuzz(n: number): string {
    let output = "";
    if (n % 3 === 0) {
        output += 'Fizz ';
    }
    if (n % 5 === 0) {
        output += 'Buzz ';
    }
    return output;
}

export function run() {
    let testpolymer = 'NNCB';
    let polymer = 'KHSSCSKKCPFKPPBBOKVF';

    let instructions = load(false);

    let result = matchingRule('HN', instructions);

    let endpolymer = polymer;
    let stepcount = 10;
    for (let i = 0; i< stepcount; i++) {
        endpolymer = stepPolymer(endpolymer, splitPolymer(endpolymer), instructions)
    }

    // let newpolymer = stepPolymer(testpolymer, splitPolymer(testpolymer), instructions);

    // newpolymer = stepPolymer(newpolymer, splitPolymer(newpolymer), instructions);

    let result2 = analyzePolymer(endpolymer);

    console.log('it ran')
}