const _ = require('lodash')
const fs = require('fs');
const input = fs.readFileSync('./input/input14.txt', 'utf-8');

const [inputChem, ...ruleStr] = input
    .split('\n')
    .filter(x => x.length > 0)

const rules = ruleStr
    .map(x => x.split(' -> '))
    .reduce((m, [key, val]) => m.set(key, val), new Map())

console.log(rules)

const iterations = 10

function insertPairs(poly) {
    return poly.reduce((p, c) => {
        const currentPair = p[p.length - 1] + c;
        if (rules.has(currentPair)) {
            // console.log(currentPair, rules.get(currentPair))
            p.push(rules.get(currentPair));
        }
        p.push(c);
        return p;
    }, [])
}

const inputArr = inputChem.split('');

let curPoly = inputArr;
console.log(curPoly.join(''))
for (let i = 0; i < iterations; i++) {
    console.log(i)
    curPoly = insertPairs(curPoly)
    // console.log(curPoly.join(''))
}

const counts = curPoly
    .reduce((m, c) => m.has(c) ? m.set(c, m.get(c) + 1) : m.set(c, 1), new Map());

const [min, ...others] = [...counts.values()]
    .sort((a, b) => a - b)


console.log(curPoly.length, counts, others.pop() - min)

const totals = new Map([
    ['B',0],
    ['C',0],
    ['H',0],
    ['N',0]
])

let i = 0;
function depthExpand(a, b, depth) {
    const next = rules.get(a+b);

    if(i % 1000000 === 0) {
        console.log(totals)
    }
    i++

    if(depth === 0) {
        if (totals.has(next)) {
            totals.set(next, totals.get(next)+1)
        } else {
            totals.set(next, 1);
        }
        return;
    }

    depthExpand(a,next, depth -1);
    depthExpand(next, b, depth - 1);
}

itrEx2 = 40;

depthExpand('K', 'F', itrEx2);

console.log(totals)