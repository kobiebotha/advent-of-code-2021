const fs = require('fs')

//generates an empty 2D array with m columns and n rows
const zeros = (m: number, n: number) => [...Array(n)].map(e => Array(m).fill('.'));

function loadSlide(debug: boolean): [string[][], (number | string)[][]] {
    let results: string[] = [];
    let grid: string[][] = [[]];
    let instructions: (string | number)[][] = [];

    let test = zeros(3, 4);


    try {
        let path = debug ? './inputs/day13/test' : './inputs/day13/puzzle'
        const data = fs.readFileSync(path, 'utf8');

        results = data.split('\n')

        //scan once to get maxX and maxY
        let maxX = 0, maxY = 0;
        results.forEach(line => {
            if (line[0] != 'f') { //coordinate pair
                let lineX = parseInt(line.split(',')[0]);
                let lineY = parseInt(line.split(',')[1]);
                if (lineX > maxX) {
                    maxX = lineX
                };
                if (lineY > maxY) {
                    maxY = lineY
                };
            }
        });

        grid = zeros(maxX + 1, maxY + 1);

        //load hashes
        results.forEach(line => {
            if (line[0] == 'f') { //fold
                let insParts = line.split('=');
                let insAxis = insParts[0][insParts[0].length - 1]; //get last char
                let insOffset = parseInt(insParts[1]);
                instructions.push([insAxis, insOffset]);
            }
            else { //load point
                let lineX = parseInt(line.split(',')[0]);
                let lineY = parseInt(line.split(',')[1]);
                grid[lineY][lineX] = '#';
            }
        });

    } catch (err) {
        console.error(err)
    }

    return [grid, instructions];
}

function processInstructions(inputGrid: string[][], instructions: (number | string)[][]): string[][] {
    let resultingGrid = inputGrid;
    instructions.forEach(inst => {
        let foldAxis = inst[0];
        let foldOffset = inst[1];
        //@ts-ignore
        resultingGrid = transform(resultingGrid, foldAxis, foldOffset);

        let numPoints = countPoints(resultingGrid);
        console.log('numPoints = ', numPoints);
    });
    return resultingGrid;
}

function countPoints(inputGrid: string[][]) {
    let points = 0;

    for (let col = 0; col < inputGrid[0].length; col++) {
        for (let row = 0; row < inputGrid.length; row++ ) {
            if (inputGrid[row][col] == '#') {
                points++;
            }
        }
    }

    return points;
}

export function reshape(input: string[][], fold_axis: string, fold_value: number): string[][] {
    let result: string[][] = [];
    let numCols = input[0].length; //x
    let numRows = input.length; //y

    if (fold_axis == 'x') { //cut columns in half
        result = zeros(fold_value, numRows);
    }
    else if (fold_axis == 'y') {
        result = zeros(numCols, fold_value);
    }

    // load values from input into result;
    for (let col = 0; col < result[0].length; col++) {
        for (let row = 0; row < result.length; row++) {
            result[row][col] = input[row][col];
        }
    }

    return result;
}


/**
 * 
 * operates on a grid
 * a transform is a function of the point to transform, and the axis about which to transform
 */
export function transform(input: string[][], fold_axis: string, fold_value: number): string[][] {
    let result = input;
    // //make sure input's row count is odd, if the fold_value is even
    // if ((input.length % 2 == 0) || (input[0].length % 2 == 0)) {
    //     throw new Error("dimensions should be odd");
    // }

    if (fold_axis == 'x') {
        for (let col = fold_value+1; col < input[0].length; col++) {
            for (let row = 0; row < input.length; row++) {
                if (input[row][col] == '#') {
                    let distanceFromAxis = col-fold_value;
                    let mirrorPoint = fold_value-distanceFromAxis; 
                    result[row][mirrorPoint] = '#'; //mirror operation
                }
            }
        }
    }

    //switch y: fold bottom up
    else if (fold_axis == 'y') {
        for (let row = fold_value+1; row < input.length; row++) {
            for (let col = 0; col < input[0].length; col++) {
                if (input[row][col] == '#') {
                    let distanceFromAxis = row-fold_value;
                    let mirrorPoint = fold_value-distanceFromAxis; 
                    result[mirrorPoint][col] = '#'; //mirror operation
                }
            }
        }
    }

    //reshape grid
    result = reshape(result, fold_axis, fold_value);
    return result;
}

export function fizzBuzz(n: number): string {
    let output = "";
    for (let i = 1; i <= n; i++) {
        if (i % 5 && i % 3) {
            output += i + ' ';
        }
        if (i % 3 === 0) {
            output += 'Fizz ';
        }
        if (i % 5 === 0) {
            output += 'Buzz ';
        }
    }
    return output;
}

export function run() {
    let data = loadSlide(false);

    let results = processInstructions(data[0], data[1]);

    console.log('it ran')

}
