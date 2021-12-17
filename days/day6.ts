const fs = require('fs')

class Fish {
    constructor(private age: number, private newborn: boolean) {

    }

    get getAge() {
        return this.age;
    }

    tick(school: Fish[]) {
        this.age--;
        if (this.age == -1) {
            this.newborn = false;
            this.age = 6;
            this.spawn(school);
        }
    }

    spawn(school: Fish[]) {
        school.push(new Fish(8, true));
    }
}

const readFish = (debug: boolean): Fish[] => {
    let fish: Fish[] = [];

    try {
        let path = debug ? './inputs/day6/testfish' : './inputs/day6/fish'
        const data = fs.readFileSync(path, 'utf8');

        let allFish = data.split(',')

        allFish.forEach((thisAge: string) => {
            fish.push(new Fish(parseInt(thisAge), false));
        });

    } catch (err) {
        console.error(err)
    }

    return fish;
}

export function run() {
    let debug = true;
    let numdays = 256;

    let fish = readFish(debug);

    for (let i = 0; i < numdays; i++) {
        fish.forEach((thisFish) => {
            thisFish.tick(fish);
        })
    }

    console.log('it ran. Total number of fish = ', fish.length);
}