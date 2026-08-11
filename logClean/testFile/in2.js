// 测试文件
for (let i = 0; i < 1000000; i++) {
    console.log(`console.log ${i}`);
}

console.log('console.log 1000000');

// 写入文件
const fs = require('fs');
const path = require('path');
const inputFile = path.join(__dirname, 'in2.js');
const outputFile = path.join(__dirname, 'out2.js');
const writable = fs.createWriteStream(outputFile);
writable.write('console.log 1000000');
writable.end();
console.log(5, '文件写入完成');

// 读取文件
const readable = fs.createReadStream(outputFile);
readable.on('data', (chunk) => {
    console.log(chunk.toString());
});
readable.on('end', () => {
    console.log(6, '文件读取完成');
});
readable.on('error', (err) => {
    console.error(7, '文件读取失败: ' + err.message);
});

// 删除文件
fs.unlink(outputFile, (err) => {
    if (err) {
        console.error(8, '文件删除失败: ' + err.message);
    } else {
        console.log(9, '文件删除完成');
    }
});