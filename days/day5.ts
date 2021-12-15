import { forEach, map } from "lodash";

const fs = require('fs')


class Point {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}

class Line {
    private _start: Point;
    private _end: Point;
    constructor(start: Point, end: Point) {
        this._start = start;
        this._end = end;
    }

    get startX() {
        return this._start.x;
    }

    get startY() {
        return this._start.y;
    }

    get endX() {
        return this._end.x;
    }

    get endY() {
        return this._end.y;
    }

}

const parseLine = (input: string): Line => {
    const re = /(\d+)\,(\d+)\s\-\>\s(\d+),(\d+)/
    const results = input.match(re) || '';
    const point1 = new Point(parseInt(results[1]), parseInt(results[2]));
    const point2 = new Point(parseInt(results[3]), parseInt(results[4]));
    const line = new Line(point1, point2);
    return line;
}

const filterLines = (inLines: Line[]): Line[] => {
    let result = inLines.filter(element => {
        if ((element.startX == element.endX) || (element.startY == element.endY)) {
            return element;
        }
    })
    return result;
}

const readLines = (debug: boolean): Line[] => {
    let lines: Line[] = [];

    try {
        let path = debug ? './inputs/day5/testlines' : './inputs/day5/lines'
        const data = fs.readFileSync(path, 'utf8');

        let lineData = data.split('\n')

        lineData.forEach((thisLine: string) => {
            lines.push(parseLine(thisLine));
        });

    } catch (err) {
        console.error(err)
    }

    return lines;
}

const getGridSize = (lines: Line[]): [number, number] => {
    let maxX: number = 0;
    let maxY: number = 0;
    lines.forEach((line) => {
        if (line.startX > maxX) {
            maxX = line.startX;
        }

        if (line.startY > maxY) {
            maxY = line.startY;
        }

        if (line.endX > maxX) {
            maxX = line.endX;
        }

        if (line.endY > maxY) {
            maxY = line.endY;
        }
    })

    return [maxX+1, maxY+1];
}

const absLine = (line: Line): Line => {
    let startX = line.startX;
    let startY = line.startY;
    let endX = line.endX;
    let endY = line.endY;

    if (line.startX > line.endX) {
        startX = line.endX;
        endX = line.startX;
    }

    if (line.startY > line.endY) {
        startY = line.endY;
        endY = line.startY;
    }

    return new Line(new Point(startX, startY), new Point(endX, endY));
}

const processGrid = (lines: Line[], grid: number[][]): number[][] => {
    let absLines = lines.map((line) => {
        return absLine(line);
    });

    absLines.forEach((line) => {
        for (let i = line.startX; i <= line.endX; i++) {
            for (let j = line.startY; j <= line.endY; j++) {
                grid[j][i]++;
            }
        }
    })

    return grid;
}

const countOverlap = (grid: number[][]): number => {
    let sum = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++ ) {
            if (grid[i][j] > 1) {
                sum++;
            }
        }
    }

    return sum;
}

const zeros = (m: number, n: number) => [...Array(m)].map(e => Array(n).fill(0));

export function run() {
    const debug = false;
    const lines = readLines(debug);

    const gridSize = getGridSize(lines);
    let grid: number[][] = zeros(gridSize[0], gridSize[1]);

    const filteredLines = filterLines(lines);

    const processedGrid = processGrid(filteredLines, grid);

    const sum = countOverlap(processedGrid);

    console.log('it ran')
}