//FizzBuzz.test.ts
/// <reference types="jest" />

import { fizzBuzz } from "./day14";
import { splitPolymer } from "./day14"
import { matchingRule } from "./day14"


let polymer = 'NNCB'
let pairs: string[] = ['NN', 'NC', 'CB']
let rules: [string, string][] =
    [
        [
            "CH",
            "B",
        ],
        [
            "HH",
            "N",
        ],
        [
            "CB",
            "H",
        ],
        [
            "NH",
            "C",
        ],
        [
            "HB",
            "C",
        ],
        [
            "HC",
            "B",
        ],
        [
            "HN",
            "C",
        ],
        [
            "NN",
            "C",
        ],
        [
            "BH",
            "H",
        ],
        [
            "NC",
            "B",
        ],
        [
            "NB",
            "B",
        ],
        [
            "BN",
            "B",
        ],
        [
            "BB",
            "N",
        ],
        [
            "BC",
            "B",
        ],
        [
            "CC",
            "N",
        ],
        [
            "CN",
            "C",
        ],
    ]

test("fizzBuzz", () => {
    expect(fizzBuzz(5)).toStrictEqual('Buzz ');
})

test("Polymer splits into pairs correctly", () => {
    expect(splitPolymer(polymer)).toStrictEqual(pairs);
})

test("matchingRuleWorks", () => {
    expect(matchingRule('HN', rules)).toStrictEqual(['HN', 'C'])
})