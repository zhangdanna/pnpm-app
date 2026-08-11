// 测试文件
for (let i = 0; i < 1000000; i++) {
    console.log(`console.log ${i}`);
}
const fs = require('fs');
const path = require('path');
const inputFile = path.join(__dirname, 'in.js');
console.log(1, inputFile);
const outputFile = path.join(__dirname, 'out.js');
console.log(2, outputFile);
const readable = fs.createReadStream(inputFile);
const writable = fs.createWriteStream(outputFile);
console.log(3, readable);
console.log(4, writable);
readable.pipe(writable);
console.log(`
    console.log 5console.log 5console.log 5console.log 5console.log 5
    console.log 5console.log 5console.log 5console.log 5console.log 5`);
console.log('console.log 6');
console.log('console.log 7');
console.log('console.log 8');
console.log('console.log 9');
console.log('console.log 10');

console.log(5, '文件读取完成');