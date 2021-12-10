const _ = require('lodash')

const fs = require('fs');
const { size } = require('lodash');
const input = fs.readFileSync('./input/test8.txt', 'utf-8');

const codes = input
    .split('\n')
    .map(x => x
        .trim()
        .split(' | ')
        .map(y => y.split(' ')));


const outputs = codes.map(x => x[1]);

console.log(outputs.flat().map(x => x.length))

const lookingFor = [2, 3, 4, 7];

const numCount = outputs
    .flat()
    .map(x => x.length)
    .reduce((count, n) => lookingFor.includes(n) ? count + 1 : count, 0)

console.log(numCount);

const ex2 = codes.map(solveSegments)
// solveSegments(codes[0]);

function regularKeys(set) {
    return [...set.values()].sort().join('');
} 

function solveSegments([input, output]) {
    const inputSets = input.map(x => new Set(x.split('')));
    const outputSets = output.map(x => new Set(x.split('')));
    inputMap = new Map();

    inputMap.set(1,inputSets.find(x => x.size === 2));
    inputMap.set(4,inputSets.find(x => x.size === 4));
    inputMap.set(7,inputSets.find(x => x.size === 3));
    inputMap.set(8,inputSets.find(x => x.size === 7));

    const five = inputSets.filter(x => x.size === 5);

    const three = five.find(x => [...inputMap.get(1).values()].every(y => [...x.values()].includes(y)))
    inputMap.set(3, three);

    const seven = inputSets.filter(x => x.size === 7);

    const reversedMap = new Map([...inputMap.entries()].map(([x,y]) => [regularKeys(y),x]));
    const ans = outputSets.map(regularKeys).map(x => reversedMap.has(x) ? reversedMap.get(x) : '?');

    
    console.log(ans.join(''))
}

// 1, 4, 7, or 8 
// 2, 4, 3, 7
/*
0 6
1 2
2 5
3 5
4 4
5 5
6 6
7 3
8 7
9 6
*/

// 5 - 2 3 5
// 7 - 0 6 9 

// 0 has 6 elements ?
// 1 has 2 elements
// 2 has 5 elements ?
// 3 has both elements of 1 and has 5 elements
// 4 has 4 elements
// 5 has 5 elements ?
// 6 has 7 elements ?
// 7 has 3 elements
// 9 has 7 elements and all the elements of 3 

// If you have 7 segments and all of the elements of 4 you are 9