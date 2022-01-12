import { parse } from "path/posix";

const fs = require('fs')

const closingMap = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
}

const scoreMap = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
}

function loadStrings(debug: boolean) {
    let results: string[] = [];

    try {
        let path = debug ? './inputs/day10/test' : './inputs/day10/puzzle'
        const data = fs.readFileSync(path, 'utf8');

        results = data.split('\n')

    } catch (err) {
        console.error(err)
    }

    return results;
}

function parseString(thisStr: string): object {
    let callStack: string[] = []
    let result = {
        code: 'OK',
        errorCharacter: ''
    }

    let tokenTracker = {
        '(': 0,
        '[': 0,
        '{': 0,
        '<': 0,
        'expectedClose': ''
    }

    // const openRe = /\(\[\{\</;
    // const closeRe = /\)\]\}\>/;

    for (let i = 0; i< thisStr.length; i++) {
        switch (thisStr[i]) {
            //opening, always accept
            case '(':
                tokenTracker['(']++;
                callStack.push(thisStr[i]);
                break;
            case '[':
                tokenTracker['[']++;
                callStack.push(thisStr[i]);
                break;
            case '{':
                tokenTracker['{']++;
                callStack.push(thisStr[i]);
                break;
            case '<':
                tokenTracker['<']++;
                callStack.push(thisStr[i]);
                break;
            //closing
            case ')':
            case ']':
            case '}':
            case '>':
                //get the matchin opening character for current closing character
                const thisChar: string = thisStr[i];
                //@ts-ignore
                const matching = closingMap[thisChar];
                const topCall = callStack.slice(-1);
                if (matching != topCall) {
                    result = {code: 'ERROR_WRONG_CLOSE', errorCharacter: thisStr[i]};
                    return result;
                }
                //@ts-ignore
                if (tokenTracker[matching] == 0) {
                    result = {code: 'ERROR_UNEXPECTED_CLOSE', errorCharacter: thisStr[i]};
                    return result;
                }
                else {
                    //@ts-ignore
                    tokenTracker[matching]--;
                    //@ts-ignore
                    callStack.pop(closingMap[thisChar]);
                }
        }
    }
    return result;
}

export function run() {
    const test='{([(<{}[<>[]}>{[]{[(<()>';
    let result = parseString(test);


    let strings = loadStrings(false);
    let score = 0;

    strings.forEach(element => {
        let result = parseString(element);
        //@ts-ignore
        if (result.code != 'OK') {
            //@ts-ignore
            score += scoreMap[result.errorCharacter]; 
        }
    });

    console.log(`it ran, score = ${score}`);

    //for i = 0, i < length of string:
        //opening chars are always accepted
        //increment opening char count
        //if closing char:
            //if matchin opening char count == 0, corrupt
            //else decrement opening char count

}