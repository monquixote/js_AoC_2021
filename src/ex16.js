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

function readHeader(gen) {
    const version = arr2Bin(gen.take(3))
    const type = arr2Bin(gen.take(3))
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
    return val;
}

const BIT_LEN_BITS = 15;
const PACKET_LEN_BITS = 11;

const TYPE_LITERAL = 4;

function readOperator(gen) {


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

function ex1Processor(gen) {

    let total = 0;

    let packetCount = 0;
    let bitLength = null;
    let packetLength = null;
    let limitSet = false;

    try {
        while (!gen.done()) {
            /*
            if (packetLength && packetCount >= packetLength) {
                console.log('Packet Count ', packetCount)
                break;
            }
            if (bitLength && gen.index >= bitLength) {
                console.log('Bit Length ', bitLength, gen.index)
                break;
            }
            */
            const [version, type] = readHeader(gen);
            if (!Number.isInteger(version)) {
                console.log('Done')
                break;
            }
            console.log('v', version, 't', type)
            total += version;

            if (type === TYPE_LITERAL) {
                readLiteralPacket(gen)

            } else {
                const lens = readOperator(gen)
                if (!limitSet) {
                    console.log('setting limit', lens)
                    packetLength = lens.packetLength;
                    if (bitLength) {
                        bitLength = lens.bitLength + gen.index;
                    }
                    limitSet = true;
                }
            }

            packetCount++;

        }
    } catch(e) {
        console.log('oops hit the end!')
    }

    return total;
}

const binArr = inputBin

const readerGen = new ReaderGen(binArr);
console.log(ex1Processor(readerGen))



// EX1 DEBUG
// const binArr = processHex("8A004A801A8002F478")

//Ex 1
// const binArr = "00111000000000000110111101000101001010010001001000000000".split('').map(Number)
// console.log(processHex("38006F45291200").join(''));


// const binArr = "110100101111111000101000".split('').map(Number)

// const readerGen = new ReaderGen(binArr);

// Example 2
// const binArr = "11101110000000001101010000001100100000100011000001100000".split('').map(Number)


// 8A004A801A8002F478
// 4 1 5 6  = 16
// const binArr = processHex("8A004A801A8002F478")

// const binArr = processHex("620080001611562C8802118E34")

// const binArr = processHex("A0016C880162017C3686B18A3D4780")

