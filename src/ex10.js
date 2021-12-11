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
    let remainder = tail;
    while (remainder.length > 0) {
        if ([...matchedPairs.values()].includes(remainder[0])) {
            if (remainder[0] === matchedPairs.get(head)) {
                return remainder.slice(1);
            }
            return scores.get(remainder[0]);
        }
        const result = parser(remainder);
        if (Number.isInteger(result)) {
            return result;
        }
        remainder = result;
    }
    return 0;
}

const results = inputTokens.map(parser);

const [corrupt, incomplete] = _.partition(results, (x) => Number.isInteger(x) && x > 0);

const ans = corrupt.reduce((x, y) => x + y)
console.log(ans);

const inc = inputTokens.filter((x, i) => !Number.isInteger(results[i]) || results[i] === 0)

//console.log(inc)
// console.log(incomplete)


function autoComplete(listing) {
    let end = []
    function parser2([head, ...tail]) {
        let remainder = tail;
        while (remainder.length > 0) {
            if ([...matchedPairs.values()].includes(remainder[0])) {
                if (remainder[0] === matchedPairs.get(head)) {
                    // console.log('return')
                    return remainder.slice(1);
                }
                e = new Error()
                e.score = scores.get(remainder[0]);
                throw e;
            }
            const result = parser2(remainder);
            remainder = result;
        }
        end.push(matchedPairs.get(head))
        return [];
    }
    while (listing.length > 0) {
        listing = parser2(listing);
    }
    return end;
}

// console.log(inc.map(x => x.join('')))
const completions = inc.map(autoComplete);

const completionScores = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
}

const completionTotals = completions
    .map(x => x
        .reduce((total, c) => total * 5 + completionScores[c], 0));


console.log(completionTotals.sort((x, y) => x - y)[Math.floor(completionTotals.length / 2)])

