const _ = require('lodash')
const fs = require('fs');
const input = fs.readFileSync('./input/test15.txt', 'utf-8');

const inputNums = input
    .split('\n')
    .map(x => x.split('').map(Number));

const costMap = new Map();

/*
for (let i = 0; i < inputNums.length; i++) {
    for (let j = 0; j < inputNums[i].length; j++) {
        costMap.set(`${i}-${j}`, inputNums[i][j]);
    }
}
*/

/*
const distMap = new Map();

for (let i = 0; i < inputNums.length; i++) {
    for (let j = 0; j < inputNums[i].length; j++) {
        distMap.set(`${i}-${j}`, Number.POSITIVE_INFINITY);
    }
}
*/

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

    while (distMap.size > 0) {
        if(distMap % 100 === 0) {
            console.log(distMap.size)
        }

        const [next] = _.minBy([...distMap.entries()], ([key, val]) => val);
        updateKey(next, distMap, costMap);
        if(next === endKey) {
            return;
        }
    }
}

function updateKey(key, distMap, costMap) {

    const adjacentKeys = getAdjacentKeys(key)
        .filter(adjacentKey => distMap.has(adjacentKey));

    // console.log(key, adjacentKeys);
    adjacentKeys.forEach(adjacentKey => {
        const cost = distMap.get(key) + costMap.get(adjacentKey)
        if (distMap.get(adjacentKey) > cost) {
            distMap.set(adjacentKey, cost);
        }
    })

    outputMap.set(key, distMap.get(key));
    distMap.delete(key);

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
        .map(x => x.map(y => (y !== undefined ? String(y) : '.').padEnd(1)).join(' '))
        .join('\n')
}



function writeMap(inputMap, xFact, yFact) {
    for (let i = 0; i < inputNums.length; i++) {
        for (let j = 0; j < inputNums[i].length; j++) {
            inputMap.set(
                `${i + (xFact*inputNums.length)}-${j + (yFact*inputNums.length)}`, 
                (inputNums[i][j] + xFact + yFact) % 9 || 9);
        }
    }
}

function expandMap(inputMap, multiplier) {
    for(let i = 0; i < multiplier; i++) {
        for(let j = 0; j < multiplier; j++) {
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

const expansion = 1

expandMap(costMap, expansion)
//console.log(arr2String(map2Array(costMap, 5)))

const distMap = new Map();

[...costMap.keys()].forEach(x => distMap.set(x, Number.POSITIVE_INFINITY))
console.log('len',distMap.size, costMap.size)

const endKey = `${inputNums.length * expansion - 1}-${inputNums[0].length * expansion - 1}`;
distMap.set('0-0', 0);


updateAll(distMap, costMap)
console.log(arr2String(map2Array(outputMap, expansion)))