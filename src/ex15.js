const _ = require('lodash')
const fs = require('fs');
const input = fs.readFileSync('./input/input15.txt', 'utf-8');

const inputNums = input
    .split('\n')
    .map(x => x.split('').map(Number));

const costMap = new Map();

function getAdjacentKeys(key) {
    const [x, y] = key.split('-').map(Number);
    return [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y]
    ].map(([x, y]) => `${x}-${y}`)
}

const outputMap = new Map();

function updateAll(distMap, costMap) {

    const prospects = new Map();
    prospects.set('0-0', 0);
    distMap.delete('0-0');

    while (prospects.size > 0) {
        if (distMap % 100 === 0) {
            console.log(distMap.size)
        }

        const [next] = _.minBy([...prospects.entries()], ([key, val]) => val);
        updateKey(next, distMap, costMap, prospects);
        if (next === endKey) {
            return;
        }
    }
}

function updateKey(key, distMap, costMap, prospects) {

    let adjacentKeys = getAdjacentKeys(key)

    const distAdj = adjacentKeys.filter(adjacentKey => distMap.has(adjacentKey));

    distAdj.forEach(k => {
        prospects.set(k, Number.POSITIVE_INFINITY);
        distMap.delete(k);
    })

    adjacentKeys.filter(adjacentKey => prospects.has(adjacentKey));

    // console.log(key, adjacentKeys);
    adjacentKeys.forEach(adjacentKey => {
        const cost = prospects.get(key) + costMap.get(adjacentKey)
        if (prospects.get(adjacentKey) > cost) {
            prospects.set(adjacentKey, cost);
        }
    })

    outputMap.set(key, prospects.get(key));
    prospects.delete(key);

    // console.log(arr2String(map2Array(outputMap)), '\n', distMap.size, adjacentKeys.length);
}




function map2Array(m, multiplier = 1) {
    const output = [];
    for (let i = 0; i < inputNums.length * multiplier; i++) {
        output.push([]);
        for (let j = 0; j < inputNums.length * multiplier; j++) {
            output[i].push(m.get(`${i}-${j}`));
        }
    }
    return output
}

function arr2String(arr) {
    return arr
        .map(x => x.map(y => (y !== undefined ? String(y) : '.').padEnd(3)).join(' '))
        .join('\n')
}



function writeMap(inputMap, xFact, yFact) {
    for (let i = 0; i < inputNums.length; i++) {
        for (let j = 0; j < inputNums[i].length; j++) {
            inputMap.set(
                `${i + (xFact * inputNums.length)}-${j + (yFact * inputNums.length)}`,
                (inputNums[i][j] + xFact + yFact) % 9 || 9);
        }
    }
}

function expandMap(inputMap, multiplier) {
    for (let i = 0; i < multiplier; i++) {
        for (let j = 0; j < multiplier; j++) {
            writeMap(inputMap, i, j)
        }
    }
    return inputMap;
}



/*
for (let i = 0; i < inputNums.length; i++) {
    for (let j = 0; j < inputNums[i].length; j++) {
        distMap.set(`${i}-${j}`, Number.POSITIVE_INFINITY);
    }
}
*/

const expansion = 5

expandMap(costMap, expansion)
//console.log(arr2String(map2Array(costMap, 5)))

const distMap = new Map();

[...costMap.keys()].forEach(x => distMap.set(x, Number.POSITIVE_INFINITY))
console.log('len', distMap.size, costMap.size)

const endKey = `${inputNums.length * expansion - 1}-${inputNums[0].length * expansion - 1}`;
distMap.set('0-0', 0);


updateAll(distMap, costMap)
console.log(arr2String(map2Array(outputMap, expansion)))