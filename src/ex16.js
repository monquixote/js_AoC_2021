const _ = require('lodash')
const fs = require('fs');
const input = fs.readFileSync('./input/input16.txt', 'utf-8');

const inputBin = processHex(input);

function processHex(input) {
    return input
        .split('')
        .map(x => parseInt(x, 16)
            .toString(2)
            .padStart(4, '0')
            .split('')
            .map(Number))
        .flat();
}

/*
function gen.take( no) {
    const results = [];
    for (let i = 0; i < no; i++) {
        results.push(gen.next().value);
    }
    return results;
}
*/

class ReaderGen {
    constructor(bitStream) {
        this.bitStream = bitStream;
    }
    index = 0;

    take(num) {
        if (this.done()) {
            throw Error('Cannot read when done')
        }
        const result = []
        for (let i = 0; i < num; i++) {
            result.push(this.bitStream[this.index]);
            this.index++;
        }
        return result;
    }

    done() {
        return this.index >= this.bitStream.length
    }
    align() {
        if (this.index % 4) {
            const remainder = 4 - (this.index % 4)
            console.log('remainder', remainder)
            this.index += remainder;
        }
    }
}


function arr2Bin(x) {
    return parseInt(x.join(''), 2)
}

let versionTotal = 0;

function readHeader(gen) {
    const version = arr2Bin(gen.take(3))
    const type = arr2Bin(gen.take(3))
    versionTotal += version;
    return [version, type]
}

function readLiteralPacket(gen) {

    let valArr = [];
    let end = 1;

    while (end === 1) {
        const [first, ...rest] = gen.take(5)
        end = first
        valArr = [...valArr, ...rest];
    }

    const val = arr2Bin(valArr);

    // gen.align();

    console.log('Reading val', val)
    return Number(val);
}

const BIT_LEN_BITS = 15;
const PACKET_LEN_BITS = 11;

const TYPE_LITERAL = 4;

function readOpLen(gen) {


    const [lengthType] = gen.take(1);

    console.log('Reading op', lengthType)

    if (lengthType === 0) {
        const bits = gen.take(BIT_LEN_BITS);
        const bitLength = arr2Bin(bits)
        console.log('bit len', bitLength)
        return { bitLength, packetLength: null }
    } else if (lengthType === 1) {
        const packetLength = arr2Bin(gen.take(PACKET_LEN_BITS))
        console.log('packet len', packetLength)
        return { bitLength: null, packetLength }
    } else {
        throw Error(lengthType)
    }

}

function ex2Proc(gen) {
    const [version, type] = readHeader(gen);
    console.log('v', version, 't', type)


    if (type === TYPE_LITERAL) {
        return readLiteralPacket(gen)
    }

    const { bitLength, packetLength } = readOpLen(gen);

    const startBits = gen.index;
    let packets = 0;
    const operands = []

    while (!timeToStop(bitLength, packetLength, gen.index - startBits, packets)) {
        operands.push(ex2Proc(gen))
        packets++
    }

    return operators[String(type)](operands)
}

function timeToStop(bitLength, packetLength, bits, packets) {
    if (bitLength) {
        return bits >= bitLength
    }
    if (packetLength) {
        return packets >= packetLength
    }
    throw Error('Should be one or the other!')
}

const operators = {
    '0': (args) => args.reduce((a, b) => a + b),
    '1': (args) => args.reduce((a, b) => a * b),
    '2': (args) => Math.min(...args),
    '3': (args) => Math.max(...args),
    '5': ([x,y]) => x > y ? 1 : 0,
    '6': ([x,y]) => x < y ? 1 : 0,
    '7': ([x,y]) => x === y ? 1 : 0
}

const binArr = inputBin

const readerGen = new ReaderGen(binArr);
console.log(ex2Proc(readerGen), versionTotal)

