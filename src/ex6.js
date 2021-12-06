const fs = require('fs');
const input = fs.readFileSync('./input/input6.txt', 'utf-8');

const lines = input
    .split(',')
    .map(Number);

const lanternArr = lines.reduce((arr,num) => {
    arr[num] += 1;
    return arr;
},Array.from({length:9}, () => 0));

const iterations = 256;

for(let i = 0; i < iterations; i++) {
    const next = lanternArr.shift();
    lanternArr.push(next);
    lanternArr[6] += next;

}

const total = lanternArr.reduce((x,y) => x+y);

console.log(lanternArr, total);