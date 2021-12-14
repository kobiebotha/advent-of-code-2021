import { exit } from "process";
import _ from "lodash";

const fs = require('fs')

class Point {
    private _value: number;
    private _marked: boolean = false;

    constructor(val: number) {
        this._value = val;
        this._marked = false;
    }

    get value() {
        return this._value;
    }

    set value(val: number) {
        this._value = val;
    }

    get marked() {
        return this._marked;
    }

    set marked(mark: boolean) {
        this._marked = mark;
    }
}

class Board {
    private _mostRecentVal: number = -1;
    private _points: Point[][] = [];

    constructor(numbers: number[][]) {
        for (let row = 0; row < 5; row++) {
            this._points.push([]);
            for (let col = 0; col < 5; col++) {
                this._points[row].push(new Point(numbers[row][col]));
            }
        }
    }

    testAndMarkPoint(val: number) {
        this._mostRecentVal = val;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this._points[row][col].value == val) {
                    this._points[row][col].marked = true;
                }
            }
        }
    }

    boardWon(): boolean {
        //check for a "marked" row
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (!this._points[row][col].marked) {
                    col = 5; //terminate loop, skip to next row
                    continue;
                }
                if (col == 4) {
                    //found a row! 
                    return true;
                }
            }
        }
        //check for a "marked" column
        for (let col = 0; col < 5; col++) {
            let trueThusfar = true;
            for (let row = 0; (row < 5) && trueThusfar; row++) {
                if (!this._points[row][col].marked) {
                    trueThusfar = false;  //terminate loop, skip to next column
                    continue;
                }

                if (row == 4) {
                    //found a column! 
                    return true;
                }
            }
        }

        return false;
    }

    sumUnmarked(): number {
        let sum = 0;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (!this._points[row][col].marked) {
                    sum += this._points[row][col].value;
                }
            }
        }
        return sum;
    }
}

function readSequence(debug: boolean): number[] {
    if (debug) {
        return [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1];
    }

    let entries: number[] = [];

    try {
        const data = fs.readFileSync('./inputs/day4/numbers', 'utf8');

        entries = data.split(',').map((num: string) => parseInt(num));

    } catch (err) {
        console.error(err)
    }

    return entries;
}

function getFirstOpenBoard(boards: Board[]): Board | undefined {
    for (let i = 0; i < boards.length; i++) {
        if (!boards[i].boardWon()) {
            return boards[i];
        }
    }
}

function generateBoard(lines: string[]): Board {
    let numArray: number[][] = [];
    for (let i = 0; i < lines.length; i++) {
        let array = lines[i].split(/\s+/)
        let newArray = _.remove(array, (element) => {
            return (element != '');
        })
        let finalArray = newArray.map(element => parseInt(element))
        numArray.push(finalArray);
    }
    return new Board(numArray);
}

function readBoards(debug: boolean): Board[] {
    let boards: Board[] = [];

    let lines: any[] = [];

    try {
        let path = debug ? './inputs/day4/testboards' : './inputs/day4/boards'
        const data = fs.readFileSync(path, 'utf8');

        lines = data.split('\n')

    } catch (err) {
        console.error(err)
    }

    let buffer: string[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] == '') {
            // console.log('load');
            boards.push(generateBoard(buffer));
            buffer = [];
        }
        else {
            buffer.push(lines[i]);
        }
    }

    return boards;
}

export function run() {
    let debug = false;
    let numberSequence = readSequence(debug);
    let boards = readBoards(debug);
    let numWonBoards = 0;

    for (let seqIndex = 0; seqIndex < numberSequence.length; seqIndex++) {
        for (let board = 0; board < boards.length; board++) {

            if (!boards[board].boardWon()) {
                boards[board].testAndMarkPoint(numberSequence[seqIndex]);
                if (boards[board].boardWon()) {
                    numWonBoards++;
                }
            }

            if (numWonBoards == boards.length - 1) {
                let winningBoard = getFirstOpenBoard(boards);
                if (winningBoard == undefined) {
                    console.log('something went wrong');
                    exit;
                }

                else {
                    //we have the right winning board at this point, now process points until it wins, then calculate score
                    for (let i = seqIndex; i < numberSequence.length; i++) {
                        winningBoard.testAndMarkPoint(numberSequence[i]);
                        if (winningBoard.boardWon()) {
                            let sum = winningBoard.sumUnmarked();
                            let finalValue = numberSequence[i] * sum;
                            console.log('found a winning board! value = ', finalValue);
                            exit;
                        }
                    }
                }
            }
        }
    }
    console.log('done');
}