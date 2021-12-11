const _ = require('lodash')

const fs = require('fs');
const input = fs.readFileSync('./input/input9.txt', 'utf-8');

const inputNums = input
    .split('\n')
    .map(x => x.split('').map(Number));

const inputMap = new Map();

for (let i = 0; i < inputNums.length; i++) {
    for (let j = 0; j < inputNums[i].length; j++) {
        inputMap.set(`${i}-${j}`, inputNums[i][j]);
    }
}

function getAdjacentKeys(key) {
    const [x, y] = key.split('-').map(Number);
    return [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y]
    ].map(([x, y]) => `${x}-${y}`)
}

const lowPoints = [...inputMap.entries()].filter(([key, val]) => getAdjacentKeys(key)
    .every(x => !inputMap.has(x) || inputMap.get(x) > val));

const ans = lowPoints
    .map(x => x[1])
    .reduce((x, y) => x + y + 1, 0)

const lowRefs = lowPoints.map(x => x[0]);
// console.log(lowRefs)

function getHigherKeys(key) {
    return getAdjacentKeys(key)
        .filter(x => inputMap.has(x) && inputMap.get(x) > inputMap.get(key) && inputMap.get(x) !== 9)
}

const basinSizes = lowRefs.map(x => {

    console.log('key', x)
    const outputSet = new Set([x]);
    let keys = getHigherKeys(x);
    while(keys.length > 0) {
        console.log(keys);
        keys.forEach(y => outputSet.add(y));
        keys = keys.map(y => getHigherKeys(y)).flat();
    }
    return outputSet.size;
})

const [a,b,c] = basinSizes.sort((x,y) => x - y).reverse();

console.log(a*b*c);