import { trimEnd } from "lodash";

const fs = require('fs')

let graph: Node[] = [];

class Node {
    public linkedNodes: Node[];
    public name: string;

    constructor(name: string) {
        this.linkedNodes = [];
        this.name = name;
    }

    public hasLinkToNode(name: string): boolean {
        let hasLink: boolean = false;
        this.linkedNodes.forEach((node) => {
            if (node.name == name) {
                hasLink = true;
            }
        })
        return hasLink;
    }
}

function loadStrings(debug: boolean): string[] {
    let results: string[] = [];

    try {
        let path = debug ? './inputs/day12/test' : './inputs/day12/puzzle'
        const data = fs.readFileSync(path, 'utf8');

        results = data.split('\n')

    } catch (err) {
        console.error(err)
    }

    return results;
}

function graphHasNode(name: string) {
    let hasNode: boolean = false;
    graph.forEach((node: Node) => {
        if (node.name == name) {
            hasNode = true;
        }
    })

    return hasNode;
}

function getNode(name: string): Node {
    let foundNode: Node = new Node('SOMETHING BROKE');
    graph.forEach((node: Node) => {
        if (node.name == name) {
            foundNode = node;
        }
    })

    return foundNode;
}

function parseGraphDef(raw: string[]) {


    //create all nodes
    raw.forEach((edgeDef) => {
        if (edgeDef == 'end-zg') {
            console.log('pausing here');
        }
    
        let nodeNames = edgeDef.split('-');
        let node1Name = nodeNames[0];
        let node2Name = nodeNames[1];
        if (!graphHasNode(node1Name)) {
            let newNode = new Node(node1Name);
            graph.push(newNode);
        }
        if (!graphHasNode(node2Name)) {
            let newNode = new Node(node2Name);
            graph.push(newNode);
        }
    })

    //add edges between nodes, but never add links to 'start'
    raw.forEach((edgeDef) => {
        if (edgeDef == 'end-zg') {
            console.log('pausing here');
        }

        let nodeNames = edgeDef.split('-');
        let nodeA: Node = getNode(nodeNames[0]);
        let nodeB: Node = getNode(nodeNames[1]);
        if (!nodeA.hasLinkToNode(nodeB.name) && (nodeB.name !== 'start')) {
            nodeA.linkedNodes.push(nodeB);
        }

        if (!nodeB.hasLinkToNode(nodeA.name) && (nodeA.name !== 'start')) {
            nodeB.linkedNodes.push(nodeA);
        }
    })
}

let paths: string[] = [];
function growPaths(node: Node, pathToNode: string) {
    let children = node.linkedNodes;
    children.forEach((child: Node) => {
        let candidatePath = pathToNode + ',' + child.name;
        if (isEndPath(candidatePath)) {
            paths.push(candidatePath);
        }
        else if (isValidPath(pathToNode, child.name)) {
            growPaths(child, candidatePath);
        }
    })
}

function isEndPath(path: string): boolean {
    let steps = path.split(',');

    //check last node in path
    if (steps[steps.length - 1] == 'end') {
        return true;
    }
    return false;
}

function getStepDictionary(steps: string[]): any {
    let dict = {};
    steps.forEach(step => {
        //TODO: this is broken
        if (Object.getOwnPropertyNames(dict).indexOf(step) > -1) { //key exists, increment it
            //@ts-ignore
            dict[step] = dict[step]+1;
        }
        else {
            //@ts-ignore
            dict[step] = 1;
        }
    });

    return dict;
}

function isValidDict(dict: any): boolean {
    let isValid: boolean = false;
    let smallCaveThreeTimes: boolean = false;
    let smallCaves: number = 0; //the number of times a small cave appears more than once

    for (const prop in dict) {
        if ((prop == prop.toLowerCase()) && (dict[prop] > 2)) { //no small nodes allowed more than twice, return false immediately
            smallCaveThreeTimes = true;
        }

        else if ((prop == prop.toLowerCase()) && (dict[prop] > 1)) {
            smallCaves++;
        }
    }

    if (!smallCaveThreeTimes && smallCaves <= 1) { //pretty nasty, probably need to rewrite this function
        isValid = true;
    }

    return isValid;
}


function isValidPath(currentPath: string, newNode: string): boolean {
    let isValid: boolean = false;

    //make sure we only look at small nodes as large nodes can be visited any number of times
    if (newNode == newNode.toLowerCase()) {
        let steps = currentPath.split(',');
        steps.push(newNode);
        //create a dictionary of steps and their counts
        let dict = getStepDictionary(steps);
        if (isValidDict(dict))  {
            isValid = true;
        }
    }
    else { //always allow uppercase nodes
        isValid = true;
    }

    return isValid;
}

function pathHasSmallNode(path: string, smallName: string) {
    if (path.indexOf(smallName) > -1) {
        return true;
    }
    return false;
}

export function run() {
    // let map = 'start-A\n' +
    // 'start-b\n'+
    // 'A-c\n' +
    // 'A-b\n' +
    // 'b-d\n' +
    // 'A-end\n' +
    // 'b-end\n';
    let raw = [
        'start-A',
        'start-b',
        'A-c',
        'A-b',
        'b-d',
        'A-end',
        'b-end',
    ]


    raw = [
        'dc-end',
        'HN-start',
        'start-kj',
        'dc-start',
        'dc-HN',
        'LN-dc',
        'HN-end',
        'kj-sa',
        'kj-HN',
        'kj-dc'
    ]

    //TODO: remove <start-end>, or look at why that happened...

    //breaks here, probably with the end-zg definition... hmm, seems to load definition correctly, issue could lie elsewhere
    //idea: try to eyeball paths and see what's missing?
    //damn, they don't give paths for that... maybe check the 19 path example to make sure that is valid?
    raw = loadStrings(false);

    parseGraphDef(raw);

    growPaths(getNode('start'), 'start');

    console.log('graph loaded');
    console.log('graph loaded again');

}