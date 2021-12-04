const fs = require('fs');
const input = fs.readFileSync('./input/input4.txt', 'utf-8');

const rows = input.split('\n')
    .filter(x => x.length > 0)
    .map(x => x.trim());

const moves = rows
    .shift()
    .split(',')
    .map(Number)

const numRows = rows
    .map(x => x.split(/ +/).map(Number))


function extractCards(procRows) {
    const cards = [];
    while(procRows.length > 0) {
        const workingRows = procRows.splice(0,5);

        cards.push(workingRows);
    }
    return cards;
}

const transpose = m => m[0].map((x,i) => m.map(x => x[i]))

function isWinningCard(card, ans) {
    return [...card, ...transpose(card)]
        .some(x => x.every(y => ans.includes(y)));
}

const cards = extractCards(numRows)

const curMoves = []
while(true) {
    curMoves.push(moves.shift())
    const winner = cards.find(x => isWinningCard(x, curMoves));
    if(winner) {
        const remainingSum = winner
            .flat()
            .filter(x => !curMoves.includes(x))
            .reduce((p,c) => p+c);

        const finalMove = curMoves.pop();
        console.log('WINNER!', winner, remainingSum * finalMove);
        break;
    }
    if(moves.length === 0) {
        console.log('FAIL')
        break;
    }
}