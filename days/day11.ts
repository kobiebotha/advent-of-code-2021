import { trimEnd } from "lodash";

const fs = require('fs')

let energyMap: number[][] = [[]];

let totalFlashes = 0;

function loadStrings(debug: boolean): number[][] {
    let results: string[] = [];
    let energyMap: number[][] = [[]]

    try {
        let path = debug ? './inputs/day11/test' : './inputs/day11/puzzle'
        const data = fs.readFileSync(path, 'utf8');

        results = data.split('\n')

        let lineNum = 0;
        results.forEach(element => {
            energyMap[lineNum] = element.split('').map((elem) => { return Number.parseInt(elem) });
            lineNum++;
        });

    } catch (err) {
        console.error(err)
    }

    return energyMap;
}

function hasFlashed(matrix: [number, number][], cell: [number, number]): boolean {
    let hasFlashed = false;
    matrix.forEach(element => {
        if (element[0] == cell[0] && element[1] == cell[1])
            hasFlashed = true;
    });

    return hasFlashed
}

function tic():boolean {
    const mapHeight = energyMap.length;
    const mapWidth = energyMap[0].length;

    let flashedCells: [number, number][] = [];

    //increase energy level of all by 1
    for (let row = 0; row < mapHeight; row++) {
        for (let col = 0; col < mapWidth; col++) {
            energyMap[row][col]++;
        }
    }

    let flashesLeft: boolean = true;

    while (flashesLeft) {
        flashesLeft = false;

        for (let row = 0; row < mapHeight; row++) {
            for (let col = 0; col < mapWidth; col++) {
                if (energyMap[row][col] > 9) {
                    if (!hasFlashed(flashedCells, [row, col])) {
                        flashPixel(row, col);
                        flashedCells.push([row,col]);
                        flashesLeft = true;
                    }
                }
            }
        }
    }

    // set all pixels that flashed to zero
    for (let row = 0; row < mapHeight; row++) {
        for (let col = 0; col < mapWidth; col++) {
            if (energyMap[row][col] > 9) {
                energyMap[row][col] = 0;
            }
        }
    }

    //check whether all have flashed
    let allFlashed = true;
    for (let row = 0; (row < mapHeight && allFlashed); row++) {
        for (let col = 0; (col < mapWidth && allFlashed); col++) {
            if (energyMap[row][col] != 0) {
                allFlashed = false;
            }
        }
    }
    return allFlashed;
}

function flashPixel(row: number, col: number) {
    //get neighbors
    let neighbors = getNeighbors(row, col);

    //increment each neighbor
    neighbors.forEach(element => {
        energyMap[element[0]][element[1]]++;
    });

    totalFlashes++;
}

function getNeighbors(row: number, col: number): [number, number][] {
    let neighbors: [number, number][] = []; //[row,col]
    const mapHeight = energyMap.length;
    const mapWidth = energyMap[0].length;


    if (row == 0 && col == 0) {
        neighbors = [[row + 1, col], [row + 1, col + 1], [row, col + 1]]
    }
    //top right corner
    else if (row == 0 && col == mapWidth - 1) {
        neighbors = [[row, col - 1], [row + 1, col - 1], [row + 1, col]]
    }
    //bottom left corner
    else if (row == mapHeight - 1 && col == 0) {
        neighbors = [[row - 1, col], [row - 1, col + 1], [row, col + 1]]
    }
    //bottom right corner
    else if (row == mapHeight - 1 && col == mapWidth - 1) {
        neighbors = [[row, col - 1], [row - 1, col - 1], [row - 1, col]]
    }
    //top edge
    else if (row == 0) {
        neighbors = [[row, col - 1], [row + 1, col - 1], [row + 1, col], [row + 1, col + 1], [row, col + 1]]
    }
    //left edge
    else if (col == 0) {
        neighbors = [[row - 1, col], [row - 1, col + 1], [row, col + 1], [row + 1, col + 1], [row + 1, col]]
    }
    //right edge
    else if (col == mapWidth - 1) {
        neighbors = [[row - 1, col], [row - 1, col - 1], [row, col - 1], [row + 1, col - 1], [row + 1, col]]
    }
    //bottom edge
    else if (row == mapHeight - 1) {
        neighbors = [[row, col - 1], [row - 1, col - 1], [row - 1, col], [row - 1, col + 1], [row, col + 1]]
    }

    //everything else
    else {
        neighbors = [
            [row, col - 1],
            [row - 1, col - 1],
            [row - 1, col],
            [row - 1, col + 1],
            [row, col + 1],
            [row + 1, col + 1],
            [row + 1, col],
            [row + 1, col - 1]]
    }

    return neighbors;
}

export function run() {
    energyMap = loadStrings(false);
    // energyMap = [
    //     [1, 1, 1, 1, 1,],
    //     [1, 9, 9, 9, 1],
    //     [1, 9, 1, 9, 1],
    //     [1, 9, 9, 9, 1],
    //     [1, 1, 1, 1, 1]]

    for (let i = 0; i < 200000; i++) {
        let allFlashed = tic();
        if (allFlashed) {
            console.log('STOP');
        }
    }

    console.log('done');
}