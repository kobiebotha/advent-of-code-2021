const fs = require('fs')

class School {
    public newBornFish: number[] = [0,0,0,0,0,0,0,0,0]
    public oldTimers: number[] = [0,0,0,0,0,0,0]

    constructor(fishies: Fish[]) {
        fishies.forEach((fish) => {
            this.oldTimers[fish.getAge]++;
        })
    }

    tick() {
        let newBorns = this.newBornFish[0]; //these were one year olds from previous tick, and will create newborns at the end of this tick
        let otnewBorns = this.oldTimers[0];

        //process newborns. shift all left by 1
        for (let i = 0; i < this.newBornFish.length-1; i++) {
            this.newBornFish[i] = this.newBornFish[i+1];
        }
        
        //process old timers
        for (let i = 0; i < this.oldTimers.length-1; i++) {
            this.oldTimers[i] = this.oldTimers[i+1];
        }
        
        //each zero from newborn must add to eights from newborns AND
        //each zero from old timers must add to eights from newborns
        this.newBornFish[8]= (newBorns + otnewBorns); 

        //zeros from newborn must add to 6 from old timers AND
        //zeros from old timers add to 6 from old timers
        this.oldTimers[6]= (newBorns + otnewBorns);
    }

    getFishCount(): number {
        return (this.newBornFish.reduce((a, b) => a + b, 0) + this.oldTimers.reduce((a, b) => a + b, 0));
    }
}

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
    let debug = false;
    let numdays =256;

    let fish = readFish(debug);
    let school = new School(fish);

    for (let i = 0; i < numdays; i++) {
        school.tick();
    }

    console.log('it ran. Total number of fish = ', school.getFishCount());
}