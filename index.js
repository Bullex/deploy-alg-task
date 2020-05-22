const fs = require('fs')

const rl = require('readline').createInterface({
    input: fs.createReadStream(`${__dirname}/input.txt`)
})

let length
let lineIndex = 0

// Main aggregator array
const aggregator = []

const deploy = (array, index = 0) => {
    if (array.length === index + 1) {
        return array[index];
    } else {
        let result = [];

        const deploys = deploy(array, index + 1);
        for (let j = 0; j < array[index].length; j++) {
            for (let i = 0; i < deploys.length; i++) {
                result.push(array[index][j] + ' ' + deploys[i]);
            }
        }
        return result;
    }
}


const read = line => {
    if (lineIndex) {
        if (lineIndex > length) {
            // If it's end - close and deploy
            rl.close()
        } else {
            // Skip the first number
            const startAt = line.indexOf(' ')
            if (startAt > 0) {
                let num = ''
                let numbers = []
                for (let i = startAt + 1; i < line.length; i += 1) {
                    const el = line.charAt(i)
                    if (el === ' ') {
                        numbers.push(num)
                        num = ''
                    } else {
                        num += el
                    }
                }
                numbers.push(num)
                aggregator.push(numbers)
            }
        }
    } else {
        // First line - number of incoming arrays
        length = parseInt(line, 0)
        if (!length) rl.close()
    }
    lineIndex += 1
}

const close = () => {
    const array = deploy(aggregator);
    for (let i = 0; i < array.length; i++) {
        process.stdout.write(`${array[i]}\n`);
    }
    // logMemoryDump()
}

rl
    .on('line', read)
    .on('close', close)

const logMemoryDump = () => {
    console.log(`heapUsed ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`)
}