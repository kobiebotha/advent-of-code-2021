"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const fs = require('fs');
function readInputs() {
    let entries = [];
    try {
        const data = fs.readFileSync('./inputs/day2', 'utf8');
        entries = data.split('\n');
    }
    catch (err) {
        console.error(err);
    }
    return entries;
}
function run() {
    console.log('this is day 2');
    let horizontal = 0;
    let depth = 0;
    let aim = 0;
    let entries = readInputs();
    entries.forEach(element => {
        switch (element[0]) {
            case 'f':
                let deltaX = parseInt(element[element.length - 1]);
                horizontal += deltaX;
                depth += deltaX * aim;
                break;
            case 'd':
                aim += parseInt(element[element.length - 1]);
                break;
            case 'u':
                aim -= parseInt(element[element.length - 1]);
                break;
            default:
                break;
        }
    });
    console.log(`total = ${horizontal * depth}`);
}
exports.run = run;
//# sourceMappingURL=day2.js.map