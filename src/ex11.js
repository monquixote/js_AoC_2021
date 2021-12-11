const _ = require('lodash')
const fs = require('fs');
const input = fs.readFileSync('./input/input11.txt', 'utf-8');

const inputNums = input
    .split('\n')
    .map(x => x.split('').map(Number));

const inputMap = new Map();

for (let i = 0; i < inputNums.length; i++) {
    for (let j = 0; j < inputNums[i].length; j++) {
        inputMap.set(`${i}-${j}`, inputNums[i][j]);
    }
}

function getAdjacentKeys(key) {
    const [x, y] = key.split('-').map(Number);
    return [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y],
        [x + 1, y + 1],
        [x + 1, y - 1],
        [x - 1, y + 1],
        [x - 1, y - 1]
    ].map(([x, y]) => `${x}-${y}`)
}

const moves = 1000;

function incAllVals(map) {
    return new Map([...map.entries()]
        .map(([x, y]) => [x, y + 1]))
}

let flashes = 0;

function flash(board) {
    const flashKeys = [...board.entries()]
        .filter(([key, val]) => val > 9)
        .map(([key, val]) => key);

    // Maintains object equality
    if (flashKeys.length === 0) {
        return board;
    }

    // Duplicate to avoid mutation
    board = new Map([...board.entries()])

    flashKeys.forEach(x => {
        board.set(x, 0);
        flashes++;
        const adj = getAdjacentKeys(x);
        adj.forEach(y => {
            if (board.get(y) > 0) {
                board.set(y, board.get(y) + 1);
            }
        });

    })

    return board;
}

function ex1(board) {
    for (let i = 0; i < moves; i++) {
        // console.log(i)

        if(i === 100) {
            console.log('EX1: ',flashes)
        }

        if([...board.values()].every(x => x ===0)) {
            console.log('EX2: ', i);
            break;
        }

        board = incAllVals(board);


        while (true) {
            const flashed = flash(board);
            if (flashed === board) {
                break;
            }
            board = flashed;
        }

        // console.log(arr2Str(map2Arr(board)));
    }

    return board;
}

function map2Arr(map) {
    const arr = [];
    for (let i = 0; i < inputNums.length; i++) {
        arr.push([]);
        for (let j = 0; j < inputNums[i].length; j++) {
            arr[i].push(map.get(`${i}-${j}`))
        }
    }
    return arr
}

function arr2Str(arr) {
    return arr.map(x => x.join('')).join('\n')
}

const result = ex1(inputMap);
console.log(flashes);