const _ = require('lodash')
const fs = require('fs');
const { split } = require('lodash');
const input = fs.readFileSync('./input/input13.txt', 'utf-8');

const lines = input
    .split('\n')
    .filter(x => x.length > 0)

const [foldsStrings, pointsStrings] = _.partition(lines, x => x.includes('fold'))

const folds = foldsStrings
    .map(x => x
        .split('fold along ')[1]
        .split('='));

const points = pointsStrings
    .map(x => x.split(',').map(Number))

console.log(points)
console.log(folds)

const axis = {
    x: 0,
    y: 1
}

/*
If x is greater 
foldx - (x - foldx)
*/
function fold(page, axis, value) {
    // console.log(axis, value)
    const foldedPoints = page.map(point => {
        const clone = [...point]
        // console.log(point[axis] > value, point[axis], point[axis] - value, value - (point[axis] - value))
        clone[axis] = point[axis] > value ? value - (point[axis] - value) : point[axis]
        return clone;
    })

    return _.uniqWith(foldedPoints, _.isEqual);
}

const folded = folds.reduce((page,[a, value]) => fold(page, axis[a], Number(value)), points)

// const folded = fold(points, axis[folds[0][0]], Number(folds[0][1]));

console.log(folded)

console.log(points.length, folded.length)

const dimX = Math.max(...folded.map(x => x[0]))+1;
const dimY = Math.max(...folded.map(x => x[1]))+1;

console.log(dimX,dimY);

const readout = new Array(dimY).fill('.').map(() => new Array(dimX).fill('.'));

folded.forEach(([x,y]) => {
    console.log('prop',x,y);
    readout[y][x] = '#'
})
console.log(readout.map(x => x.join('')).join('\n'))