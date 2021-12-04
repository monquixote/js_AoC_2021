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
    while (procRows.length > 0) {
        const workingRows = procRows.splice(0, 5);

        cards.push(workingRows);
    }
    return cards;
}

const transpose = m => m[0].map((x, i) => m.map(x => x[i]))

function isWinningCard(card, ans) {
    return [...card, ...transpose(card)]
        .some(x => x.every(y => ans.includes(y)));
}

const cards = extractCards(numRows)

function calcScore(board, moves) {
    return board
        .flat()
        .filter(x => !moves.includes(x))
        .reduce((p, c) => p + c);
}

function ex1(cards, moves) {
    const curMoves = []
    for (const e of moves) {
        curMoves.push(e)
        const winner = cards.find(x => isWinningCard(x, curMoves));
        if (winner) {
            return calcScore(winner, curMoves) * e;
        }
    }
}

console.log('EX1: ', ex1(cards, moves));

// Ex2
function ex2(cards, moves) {
    const curMoves2 = []
    let winner = null;
    for(const e of moves) {
        curMoves2.push(e)
        cards = cards.filter(x => !isWinningCard(x, curMoves2));
        if (cards.length === 1) {
            winner = cards[0];
        }
        if (cards.length === 0) {
            return  calcScore(winner, curMoves2) * e;
        }
    }
}

console.log('EX2: ', ex2(cards, moves));