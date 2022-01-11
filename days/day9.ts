import { RecordWithTtl } from "dns";
import { ceil, forEach } from "lodash";

const fs = require('fs')

let gasMap: number[][] = [[]]; //gasmap[0] returns the first row
let mapWidth: number, mapHeight: number = 0; //x, y with 0,0 being top left


function loadMap(debug: boolean) {
    let inputSignals: string[] = [];
    let outputs: string[] = [];

    try {
        let path = debug ? './inputs/day9/test' : './inputs/day9/puzzle'
        const data = fs.readFileSync(path, 'utf8');

        let allLines = data.split('\n')

        mapWidth = allLines[0].length;
        mapHeight = allLines.length;

        let lineNum = 0;
        allLines.forEach((thisLine: string) => {
            gasMap[lineNum] = (thisLine.split('')).map((elem) => { return Number.parseInt(elem) });
            lineNum++;
        });

    } catch (err) {
        console.error(err)
    }
}

/**
 * Returns all neighbors as an arrow of row/col tuples
 * @param gasMap the array 
 * @param row y coord of cell to get neighbors of
 * @param col x coord
 */
function getNeighbors(gasMap: number[][], row: number, col: number): [number, number][] {
    let neighbors: [number, number][] = []; //[row,col]

    if (row == 0 && col == 0) {
        neighbors = [[row+1 ,col], [row, col+1]] 
    }
    //top right corner
    else if (row == 0 && col == mapWidth - 1) {
        neighbors = [[row,col - 1],[row + 1,col]]
    }
    //bottom left corner
    else if (row == mapHeight - 1 && col == 0) {
        neighbors = [[row-1,col],[row,col+1]]
    }
    //bottom right corner
    else if (row == mapHeight - 1 && col == mapWidth-1) {
        neighbors = [[row,col-1],[row-1,col]]
    }
    //top edge
    else if (row == 0) {
        neighbors= [[row, col-1],[row+1,col],[row,col+1]]
    }
    //left edge
    else if (col == 0) {
        neighbors= [[row-1,col],[row,col+1],[row+1,col]]
    }
    //right edge
    else if (col==mapWidth-1) {
        neighbors= [[row-1,col],[row,col-1],[row+1,col]]
    }
    //bottom edge
    else if (row==mapHeight-1) {
        neighbors= [[row,col-1],[row-1,col],[row,col+1]]
    }

    //everything else
    else {
        neighbors= [[row,col-1],[row-1,col],[row,col+1],[row+1,col]]        
    }

    return neighbors;
}

function getLargerNeighbors(gasMap: number[][], point: [number, number]): [number, number][] {
    let filteredNeighbors: [number, number][] = []; //[row,col]
    let startingCell = gasMap[point[0]][point[1]];

    //for each neighbors:
    let neighbors = getNeighbors(gasMap, point[0], point[1]);
    neighbors.forEach(element => {
        let cellValue = gasMap[element[0]][element[1]];
        if (cellValue < 9 && cellValue > startingCell) { //prevents going back to already visited cells
            filteredNeighbors.push(element);
        }
    });

    return filteredNeighbors;
}

function isLowPoint(gasMap: number[][], point: [number,number]) {
    let neighbors = getNeighbors(gasMap, point[0], point[1]);
    let thisCell = gasMap[point[0]][point[1]];

    let lowPoint = true;
    neighbors.forEach(element => {
        if (gasMap[element[0]][element[1]] < thisCell) {
            lowPoint = false;
        }
    });

    return lowPoint;
}

function getLowPoints(gasMap: number[][]): [number, number][] {
    let points: [number, number][] = [];

    for (let row = 0; row < mapHeight; row++) {
        for (let col = 0; col < mapWidth; col++) {
            if (isLowPoint(gasMap, [row,col])) {
                points.push([row, col]);
            }
        }
    }

    return points;
}

function getRisk(gasMap: number[][]): number {
    let risk: number = 0;

    for (let col = 0; col < mapWidth; col++) {
        for (let row = 0; row < mapHeight; row++) {
            let thisCell = gasMap[row][col];
            //special cases
            //top left corner
            if (row == 0 && col == 0) {
                if ((thisCell < gasMap[row + 1][col]) &&
                    thisCell < gasMap[row][col + 1]) {
                    risk += thisCell + 1;
                }
            }
            //top right corner
            else if (row == 0 && col == mapWidth - 1) {
                if ((thisCell < gasMap[row][col - 1]) &&
                    (thisCell < gasMap[row + 1][col])) {
                    risk += thisCell + 1;
                }
            }
            //bottom left corner
            else if (row == mapHeight - 1 && col == 0) {
                if ((thisCell < gasMap[row - 1][col]) && (thisCell < gasMap[row][col + 1])) {
                    risk += thisCell + 1;
                }
            }
            //bottom right corner
            //top edge
            else if (row == 0) {
                if ((thisCell < gasMap[row][col - 1]) &&
                    (thisCell < gasMap[row + 1][col]) &&
                    (thisCell < gasMap[row][col + 1])) {
                    risk += thisCell + 1;
                }
            }
            //left edge
            else if (col == 0) {
                if ((thisCell < gasMap[row-1][col]) &&
                (thisCell < gasMap[row][col+1]) &&
                (thisCell < gasMap[row+1][col])) {
                    risk += thisCell + 1;
                }
            }
            //right edge
            else if (col==mapWidth-1) {
                if ((thisCell < gasMap[row-1][col]) && 
                (thisCell < gasMap[row][col-1]) &&
                (thisCell < gasMap[row+1][col])) {
                    risk += thisCell + 1;
                }
            }
            //bottom edge
            else if (row==mapHeight-1) {
                if ((thisCell < gasMap[row][col-1]) &&
                (thisCell < gasMap[row-1][col]) &&
                (thisCell < gasMap[row][col+1])) {
                    risk += thisCell + 1;
                }
            }

            //everything else
            else {
                if ((thisCell < gasMap[row][col-1]) && 
                (thisCell < gasMap[row-1][col]) &&
                (thisCell < gasMap[row][col+1]) &&
                (thisCell < gasMap[row+1][col])) {
                    risk += thisCell + 1;
                }
            }
        }
    }
    return risk;
}

function addPointIfNew(basin: [number, number][], point: [number, number]): [number, number][] {
    let newBasin = basin;

    let exists = false;
    basin.forEach(element => {
        if (element[0] == point[0] && element[1] == point[1]) {
            exists = true;
        }
    });

    if (!exists) {
        newBasin.push(point);
    }

    return newBasin;
}

function getBasin(gasMap: number[][], point: [number, number]): [number, number][] {
    let newPoints: [number, number][] = [point];
    let newNeighbors = getLargerNeighbors(gasMap, point);

    if (newNeighbors.length > 0) {
        newNeighbors.forEach(element => {
            newPoints = addPointIfNew(newPoints, element);
            let newBasin = getBasin(gasMap, element);
            newBasin.forEach(element => {
                addPointIfNew(newPoints, element)
            });
        });
    }

    return newPoints;
}

export function run() {
    let basins: [number, number][][] = []; // an array of basins. each basin is an array of [row,col] points
    loadMap(false);
    // let risk = getRisk(gasMap);
    let lowPoints = getLowPoints(gasMap);

    lowPoints.forEach(element => {
        let basin = getBasin(gasMap, element);
        basins.push(basin);
    });

    //get three highest basins
    let sortedBasins = basins.sort((a , b) => {
        if (a.length < b.length) {
            return 1;
        }
        if (a.length > b.length) {
            return -1;
        }

        return 0;
    })

    console.log(`done. length = ${(sortedBasins[0].length*sortedBasins[1].length*sortedBasins[2].length)}`);
}