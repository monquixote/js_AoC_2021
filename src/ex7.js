const _ = require('lodash')

const fs = require('fs');
const input = fs.readFileSync('./input/input7.txt', 'utf-8');

const nums = input
    .split(',')
    .map(Number);

const uniqNums = _.uniq(nums);

// console.log(uniqNums)



const distances = uniqNums.map(x => nums.reduce((p,c) => p + Math.abs(x - c),0));


console.log(Math.min(...distances));

const min = Math.min(...nums);
const max = Math.max(...nums);

const range = _.range(min,max);

const distances2 = range.map(x => nums.reduce((p,c) => p + (Math.abs(x - c) * ((Math.abs(x - c) + 1) / 2)),0));

console.log(Math.min(...distances2));

