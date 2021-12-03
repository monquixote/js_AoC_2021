const fs = require('fs');
const input = fs.readFileSync('./input/input2.txt','utf-8');

const commands = input.split('\n')
    .filter(x => x.length > 0)
    .map(x => x.split(' '));


const ans = commands
    .reduce(([pos, depth],[command, valStr]) => {
        const value = Number(valStr);
        switch(command) {
            case 'forward': 
                return [pos + value, depth]
            case 'down' :
                return [pos, depth + value]
            case 'up' :
                return [pos, depth - value]
        }
    },[0,0]);

const ans2 = commands
    .reduce(([pos, depth, aim],[command, valStr]) => {
        const value = Number(valStr);
        switch(command) {
            case 'forward': 
                return [pos + value, depth + (aim * value), aim]
            case 'down' :
                return [pos, depth, aim + value]
            case 'up' :
                return [pos, depth, aim - value]
        }
    },[0,0,0]);

console.log(ans2, ans2[0] * ans2[1]);