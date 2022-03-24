//FizzBuzz.test.ts
/// <reference types="jest" />

import {transform} from "./day13";
import {reshape} from "./day13";


let testReshapeGrid = [
    ['.','.','.','#','#'],
    ['#','.','.','.','.'],
    ['.','.','.','.','.'],
    ['.','.','.','#','.'],
    ['.','.','.','.','.'],
    ['.','.','.','#','#'],
    ['#','.','.','.','.'],
    ['.','.','.','.','.'],
    ['.','.','.','#','.']
]


let x2ReshResult = [
    ['.','.'],
    ['#','.'],
    ['.','.'],
    ['.','.'],
    ['.','.'],///
    ['.','.'],
    ['#','.'],
    ['.','.'],
    ['.','.']
]
let y4ReshResult = [
    ['.','.','.','#','#'],
    ['#','.','.','.','.'],
    ['.','.','.','.','.'],
    ['.','.','.','#','.']
]

let x2y4ReshResult = [
    ['.','.'],
    ['#','.'],
    ['.','.'],
    ['.','.']
]

test("reshape x = 2", () => {
    expect(reshape(testReshapeGrid, 'x', 2)).toStrictEqual(x2ReshResult);
})
test("reshape y = 4", () => {
    expect(reshape(testReshapeGrid, 'y', 4)).toStrictEqual(y4ReshResult);
})

test("reshape y = 4, x=2", () => {
    expect(reshape(reshape(testReshapeGrid, 'y', 4), 'x', 2)).toStrictEqual(x2y4ReshResult);
})

let testGrid = 
[
    ['.','.','.','#','#'],
    ['#','.','.','.','.'],
    ['.','.','.','.','.'],
    ['.','.','.','#','.'],
    ['.','.','.','#','.']
]
let x2Result = 
[
    ['#','#'],
    ['#','.'],
    ['.','.'],
    ['.','#'],
    ['.','#']
]

let y2Result = 
[
    ['.','.','.','#','#'],
    ['#','.','.','#','.']
]

test("fold x = 2 test", () => {
    expect(transform(testGrid, 'x', 2)).toStrictEqual(x2Result);
})

let testGrid2 = 
[
    ['.','.','.','#','#'],
    ['#','.','.','.','.'],
    ['.','.','.','.','.'],
    ['.','.','.','#','.'],
    ['.','.','.','#','.']
]

test("fold y = 2 test", () => {
    expect(transform(testGrid2, 'y', 2)).toStrictEqual(y2Result);
})