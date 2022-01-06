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

export function run() {
    loadMap(false);
    let risk = getRisk(gasMap);

    console.log(`risk = ${risk}`);
}