const fs = require('fs');
const input = fs.readFileSync('./input/input3.txt', 'utf-8');

const nums = input.split('\n')
    .filter(x => x.length > 0)
    .map(x => x.trim().split('').map(Number));

const totals = nums
    .reduce((p, c) => c.map((x, i) => p[i] + x));

const gamma = totals.map(x => x >= nums.length / 2 ? 1 : 0);
const epsilon = totals.map(x => x >= nums.length / 2 ? 0 : 1);

function multBins(arr) {
    return arr.map(x => parseInt(x.join(''), 2))
        .reduce((x, y) => x * y)
}

const ans1 = multBins([gamma, epsilon])

console.log(ans1);


function findCandidate(candidates, invert) {

    for (let i = 0; i < gamma.length; i++) {

        const total = candidates
            .map(x => x[i])
            .reduce((p, c) => p + c);

        let greater = total >= candidates.length / 2 ;
        if(invert) {
           greater = !greater; 
        }
        const comp = greater ? 1 : 0;
        candidates = candidates.filter(x => x[i] === comp);

        if (candidates.length === 1) {
            return candidates[0];
        }
    }
    throw Error('Should not get here!')
}

const oxygen = findCandidate(nums, false);
const co2 = findCandidate(nums, true)
console.log(multBins([oxygen,co2]));