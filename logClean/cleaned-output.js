// 测试文件
for (let i = 0; i < 1000000; i++) {
}
const fs = require('fs');
const path = require('path');
const inputFile = path.join(__dirname, 'in.js');
const outputFile = path.join(__dirname, 'out.js');
const readable = fs.createReadStream(inputFile);
const writable = fs.createWriteStream(outputFile);
readable.pipe(writable);
