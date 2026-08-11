// 测试文件
for (let i = 0; i < 1000000; i++) {
    /* [LOG-CLEANER-START] console.log(`console.log ${i}`); [LOG-CLEANER-END] */
}
const fs = require('fs');
const path = require('path');
const inputFile = path.join(__dirname, 'in.js');
/* [LOG-CLEANER-START] console.log(1, inputFile); [LOG-CLEANER-END] */
const outputFile = path.join(__dirname, 'out.js');
/* [LOG-CLEANER-START] console.log(2, outputFile); [LOG-CLEANER-END] */
const readable = fs.createReadStream(inputFile);
const writable = fs.createWriteStream(outputFile);
/* [LOG-CLEANER-START] console.log(3, readable); [LOG-CLEANER-END] */
/* [LOG-CLEANER-START] console.log(4, writable); [LOG-CLEANER-END] */
readable.pipe(writable);
/* [LOG-CLEANER-START] console.log(`
    console.log 5console.log 5console.log 5console.log 5console.log 5
    console.log 5console.log 5console.log 5console.log 5console.log 5`); [LOG-CLEANER-END] */
/* [LOG-CLEANER-START] console.log('console.log 6'); [LOG-CLEANER-END] */
/* [LOG-CLEANER-START] console.log('console.log 7'); [LOG-CLEANER-END] */
/* [LOG-CLEANER-START] console.log('console.log 8'); [LOG-CLEANER-END] */
/* [LOG-CLEANER-START] console.log('console.log 9'); [LOG-CLEANER-END] */
/* [LOG-CLEANER-START] console.log('console.log 10'); [LOG-CLEANER-END] */

/* [LOG-CLEANER-START] console.log(5, '文件读取完成'); [LOG-CLEANER-END] */