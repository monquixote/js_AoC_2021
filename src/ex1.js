const fs = require('fs');
const input = fs.readFileSync('./input/input1.txt','utf-8');

const ans = input.split('\n')
    .filter(x => x.length > 0)
    .map(Number)
    .reduce((t,c,i,a) => c > a[i-1] ? ++t : t,0);

console.log(ans);