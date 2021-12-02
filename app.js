"use strict";
const fs = require('fs');
function readInputs() {
    let depths = [];
    try {
        const data = fs.readFileSync('./inputs/day1', 'utf8');
        depths = data.split('\n').map((x) => parseInt(x));
    }
    catch (err) {
        console.error(err);
    }
    return depths;
}
function day1() {
    const depths = readInputs();
    let depthIncreaseCounter = 0;
    let loopCounter = 0;
    for (let i = 1; i < depths.length; i++) {
        if (depths[i] > depths[i - 1]) {
            depthIncreaseCounter++;
        }
        loopCounter = i;
    }
    console.log('Number of times that depth increased = ', depthIncreaseCounter.toString());
    console.log('done');
}
day1();
//# sourceMappingURL=app.js.map