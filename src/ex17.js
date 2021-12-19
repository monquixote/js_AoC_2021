const _ = require('lodash')
const fs = require('fs');
const input = fs.readFileSync('./input/input17.txt', 'utf-8');

const [xFrom, xTo, yFrom, yTo] = input
    .split('target area: x=')[1]
    .split(', y=')
    .map(x => x.split('..').map(Number)).flat();

function* probeGenFac(xVelocity, yVelocity) {
    let xPos = 0;
    let yPos = 0;
    while (true) {
        xPos += xVelocity
        yPos += yVelocity
        yield [xPos, yPos]
        xVelocity -= xVelocity === 0 ? 0 : xVelocity / Math.abs(xVelocity)
        yVelocity -= 1;
    }
}

function inRangeFac(xMin, xMax, yMin, yMax) {
    return function (x, y) {
        return x >= xMin && x <= xMax && y >= yMin && y <= yMax
    }
}

const isInRange = inRangeFac(xFrom, xTo, yFrom, yTo)

function simulate(xStep, yStep) {
    const probe = probeGenFac(xStep, yStep)
    let curY = Number.POSITIVE_INFINITY;
    let curX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    while (curY >= yFrom && curX <= xTo) {
        [curX, curY] = probe.next().value
        if (curY > maxY) {
            maxY = curY
        }
        if (isInRange(curX, curY)) {
            return maxY;
        }
    }
    return false;
}

function findMaxY() {
    let maxY = Number.NEGATIVE_INFINITY;
    let solutionCount = 0;
    for (let i = 0; i < 1000; i++) {
        for (let j = -200; j < 1000; j++) {
            const result = simulate(i, j)
            if (result !== false) {
                solutionCount++;
                if (result > maxY) {
                    maxY = result
                }
            }
        }
    }
    return [maxY, solutionCount]
}

console.log(findMaxY())
