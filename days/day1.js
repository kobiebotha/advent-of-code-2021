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
    for (let i = 1; i < depths.length; i++) {
        if (depths[i] > depths[i - 1]) {
            depthIncreaseCounter++;
        }
    }
    console.log('Number of times that depth increased = ', depthIncreaseCounter.toString());
}
/**
 *
 * @param depths array of depth measurements
 * @param index the _end_ index from which to calculate the sliding window
 */
function calcWindow(depths, index, windowWidth) {
    return depths[index - windowWidth + 1] + depths[index - windowWidth + 2] + depths[index - windowWidth + 3];
}
function day1part2() {
    const depths = readInputs();
    const slidingWindowLength = 3;
    let depthIncreaseCounter = 0;
    for (let i = slidingWindowLength; i < depths.length; i++) {
        let thisResult = calcWindow(depths, i, slidingWindowLength);
        let prevResult = calcWindow(depths, i - 1, slidingWindowLength);
        if (thisResult > prevResult) {
            depthIncreaseCounter++;
        }
    }
    console.log('number of changes = ', depthIncreaseCounter);
}
//# sourceMappingURL=day1.js.map