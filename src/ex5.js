const fs = require('fs');
const input = fs.readFileSync('./input/input5.txt', 'utf-8');

const lines = input.split('\n')
    .filter(x => x.length > 0)
    .map(x => x
        .trim()
        .split(' -> ')
        .map(x => x
            .split(',')
            .map(Number)));

const isStraight = ([x, y]) => x[0] === y[0] || x[1] === y[1];

const hvLines = lines
    .filter(isStraight);

const diagLines = lines
    .filter(x => !isStraight(x));

function intsBetween(x, y) {
    const min = Math.min(x, y);
    const max = Math.max(x, y);
    const ints = [];
    for (let i = min; i <= max; i++) {
        ints.push(i)
    }
    if (y === min) {
        ints.reverse();
    }
    return ints;
}

function generateLine([p1x, p1y], [p2x, p2y]) {
    const xRange = intsBetween(p1x, p2x);
    const yRange = intsBetween(p1y, p2y);
    return xRange.flatMap(x => yRange.map(y => `${x}-${y}`));
}

function generateDiagLine([p1x, p1y], [p2x, p2y]) {
    const xRange = intsBetween(p1x, p2x);
    const yRange = intsBetween(p1y, p2y);
    return xRange.map((e, i) => `${e}-${yRange[i]}`); 
}

function fillMap(points, map) {
    return points
        .reduce((m, [p1, p2]) => {
            const combined = generateLine(p1, p2)
            combined.forEach(e => {
                m.set(e, m.has(e) ? m.get(e) + 1 : 1);
            });
            return m;
        }, map);
}

function fillMapDiag(points, map) {
    return points
        .reduce((m, [p1, p2]) => {
            const combined = generateDiagLine(p1, p2)
            combined.forEach(e => {
                m.set(e, m.has(e) ? m.get(e) + 1 : 1);
            });
            return m;
        }, map);
}

const points = fillMap(hvLines, new Map());
const noIntersections = [...points.values()]
    .filter(x => x > 1)
    .length;

console.log(noIntersections);

const points2 = fillMapDiag(diagLines, points);

const noIntersections2 = [...points2.values()]
    .filter(x => x > 1)
    .length;

console.log(noIntersections2);
