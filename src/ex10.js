const _ = require('lodash')
const fs = require('fs');
const input = fs.readFileSync('./input/input10.txt', 'utf-8');

const inputTokens = input
    .split('\n')
    .map(x => x.split(''));

const matchedPairs = new Map(
    [
        ['(', ')'],
        ['{', '}'],
        ['[', ']'],
        ['<', '>']
    ]
);

const scores = new Map(
    [
        [')', 3],
        [']', 57],
        ['}', 1197],
        ['>', 25137]
    ]
);

function parser([head, ...tail]) {
    if(!head) {
        console.log('No head')
        return 0;
    }
    let remainder = tail;
    while(remainder.length > 0) {
        if([...matchedPairs.values()].includes(remainder[0])) {
            if(remainder[0] === matchedPairs.get(head)) {
                return remainder.slice(1);
            }
            return scores.get(remainder[0]);
        }
        const result = parser(remainder);
        if(Number.isInteger(result)) {
            return result;
        }
        remainder = result;
    }
    return 0;
}

const results = inputTokens.map(parser);

const [corrupt, incomplete] = _.partition(results, Number.isInteger);

const ans = corrupt.reduce((x,y) => x+y)
console.log(ans);
