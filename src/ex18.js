const _ = require('lodash')
const fs = require('fs');
const input = fs.readFileSync('./input/input18.txt', 'utf-8');
const util = require('util')

function log(thing) {
    console.log(util.inspect(thing, { showHidden: false, depth: null, colors: true }))
}

const expressions = input
    .split('\n')
    .filter(x => x.length > 0)
    .map(x => x.replaceAll(',', '').split(''))
    .map(([x, ...rest]) => parseExpression(rest));


function parseExpression(str) {
    const elms = []

    while (true) {
        const next = str.shift()
        switch (next) {
            case '[':
                elms.push(parseExpression(str))
                break
            case ']':
                return elms
            default:
                elms.push(Number(next))
        }
    }
}

function exploder2(arr) {
    let leftAdd = null
    let rightAdd = null
    let exploding = false;
    let nums = []

    function explode(value, depth) {
        if (Number.isInteger(value)) {
            nums.push(value)
            return value;
        }

        const [left, right] = value

        if (depth === 4 && !exploding) {
            leftAdd = left
            rightAdd = right
            exploding = true;
            nums.push('X')
            return 0;
        }

        const returnVals = [
            explode(left, depth + 1),
            explode(right, depth + 1)
        ];

        return returnVals;
    }


    const result = explode(arr, 0)
    return [ result, nums, leftAdd, rightAdd ];
}

function splitter(arr) {
    let alreadySplit = false;

    function split(val) {
        if (Number.isInteger(val)) {
            if (val > 9 && !alreadySplit) {
                alreadySplit = true;
                return [
                    Math.floor(val / 2),
                    Math.ceil(val / 2)
                ]
            }
            return val;
        }

        const [left, right] = val;

        return [
            split(left),
            split(right)
        ]
    }

    return split(arr);
}

function reduce(arr) {

    let current = arr
    let split = true
    while (split) {

        let exploded = true
        while (exploded) {
            const next = applyExplode(current)
            exploded = !_.isEqual(current, next)
            current = next
            if(exploded) {
                // console.log('Exploded')
                // log(current)
            }
        }

        const next = splitter(current)
        split = !_.isEqual(current, next)
        current = next
        if(split) {
            // console.log('Split')
            // log(current)
        }
    }

    return current;
}

function replaceVals(updated, nums) {
    if(Number.isInteger(updated)) {
        return nums.shift()
    }

    const [left, right] = updated;

    return [
        replaceVals(left, nums),
        replaceVals(right, nums)
    ]
}

function applyExplode(arr) {
    const [updated, nums, left, right] = exploder2(arr)

    const index = nums.indexOf('X')
    if(index === -1) {
        return arr;
    }

    if(index !== 0) {
        nums[index - 1] += left 
    }

    if(index !== nums.length -1){
        nums[index + 1] += right
    }

    nums[index] = 0;

    return replaceVals(updated, nums)
}

function calcMagnitude(arr) {
    if(Number.isInteger(arr)) {
        return arr
    }

    const [left, right] = arr;

    return calcMagnitude(left) * 3 + calcMagnitude(right) * 2
}

// const test1 = [[[[[9, 8], 1], 2], 3], 4]
// const test1 = [7,[6,[5,[4,[3,2]]]]]
// const test1 = [[6,[5,[4,[3,2]]]],1]
// const test1 = [[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]
// const test1 = [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]

const test2 = [[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]

// log(reduce(test2));

// const result = expressions.reduce((p,c) => reduce([p, c]))

// const magnitude = calcMagnitude(result)

// console.log('ex1', magnitude)

function ex2(expressions) {
    const mags = []
    for(let i = 0; i < expressions.length ; i++) {
        for(let j = 0; j < expressions.length ; j ++) {
            if(i === j) {
                continue;
            }
            mags.push(calcMagnitude(reduce([expressions[i], expressions[j]])))
        }
    }
    return mags
}

const mags = ex2(expressions)

console.log(Math.max(...mags))