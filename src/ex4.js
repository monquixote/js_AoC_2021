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
const moves1 = [...moves]
while(true) {
    curMoves.push(moves1.shift())
    const winner = cards.find(x => isWinningCard(x, curMoves));
    if(winner) {
        const remainingSum = winner
            .flat()
            .filter(x => !curMoves.includes(x))
            .reduce((p,c) => p+c);

        const finalMove = curMoves.pop();
        console.log('WINNER!',remainingSum * finalMove);
        break;
    }
    if(moves1.length === 0) {
        console.log('FAIL')
        break;
    }
}

// Ex2
let cardsInPlay = cards;
const curMoves2 = []
const moves2 = [...moves]
let winner = null;
while(true) {
    curMoves2.push(moves2.shift())
    cardsInPlay = cardsInPlay.filter(x => !isWinningCard(x,curMoves2));
    if(cardsInPlay.length === 1) {
        winner = cardsInPlay[0];
    }
    if(cardsInPlay.length === 0) {

        const remainingSum = winner
            .flat()
            .filter(x => !curMoves2.includes(x))
            .reduce((p,c) => p+c);

        const finalMove = curMoves2.pop();
        console.log('WINNER2!', remainingSum * finalMove);
        break;
    }
    if(moves2.length === 0) {
        console.log('FAIL')
        break;
    }
}