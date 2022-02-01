const fs = require('fs')


/**
 * 
 * operates on a grid
 * a transform is a function of the point to transform, and the axis about which to transform
 */
function transform() {

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
    console.log('it ran')
}