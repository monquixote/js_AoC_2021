const fs = require('fs');
const input = fs.readFileSync('./input/input1.txt','utf-8');

const ans = input.split('\n')
    .filter(x => x.length > 0)
    .map(Number)
    .reduce((t,c,i,a) => c > a[i-1] ? ++t : t,0);

const ans2 = input.split('\n')
    .filter(x => x.length > 0)
    .map(Number)
    .reduce((t,c,i,a) => (a[i] + a[i+1] + a[i+2])  > ( a[i-1] + a[i] + a[i+1]) ? ++t : t,0);
    
console.log(ans, ans2);