const _ = require('lodash')

const fs = require('fs');
const input = fs.readFileSync('./input/input9.txt', 'utf-8');

const inputNums = input
    .split('\n')
    .map(x => x.split('').map(Number));

const inputMap = new Map();

for(let i = 0;i < inputNums.length; i++) {
    for(let j = 0; j < inputNums[i].length; j++) {
        inputMap.set(`${i}-${j}`, inputNums[i][j]);
    }
}

function getAdjecentKeys(key) {
    const [x, y] = key.split('-').map(Number);
    return [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y]
    ].map(([x,y]) => `${x}-${y}`)
}

const lowPoints = [...inputMap.entries()].filter(([key, val]) => getAdjecentKeys(key)
        .every(x => !inputMap.has(x) || inputMap.get(x) > val));

const ans = lowPoints.map(x => x[1]).reduce((x,y) => x+y+1,0)
console.log(lowPoints, ans)

