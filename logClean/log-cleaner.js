// 1. 引入 Node.js 核心模块
const fs = require('fs');
const { Transform } = require('stream');
const ProgressBar = require('progress');


// 2. 获取命令行参数
const inputFile = process.argv[2];

// 3. 参数校验 
// 1. 检查文件是否存在
if (!inputFile) {
    console.error('请提供一个文件路径作为参数');
    process.exit(1); // 退出程序
}
// 2. 检查文件是否存在
if (!fs.existsSync(inputFile)) {
    console.error(`文件 ${inputFile} 不存在`);
    process.exit(1); // 退出程序
}

// 4. 创建一个 Readable 流来读取文件内容
const readable = fs.createReadStream(inputFile, { encoding: 'utf8' });

// 5. 创建转换流-清除console.log日志
const cleanLogStream = new Transform({
    transform(chunk, encoding, callback) {
        const lines = chunk.toString().split('\n');
        const filteredLines = lines.filter(line => !line.includes('console.log'));
        callback(null, Buffer.from(filteredLines.join('\n')));
    }
});

// 6. 创建可写流（数据的目的地）
const outFilePath = 'cleaned-output.js';
const writable = fs.createWriteStream(outFilePath, { flags: 'w' });

// 7. 创建进度条
let total = 0;
let completedSize = 0;
let bar;

readable.on('open', (fd) => {
    const stat = fs.fstatSync(fd);
    total = stat.size;
    bar = new ProgressBar('进度[%] [:bar] :percent :current/:total 剩余时间: :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: total
    });
})

readable.on('data', (chunk) => {
    completedSize += chunk.length;
    bar.tick(chunk.length);
});

// 7. 使用管道将可读流连接到转换流，然后连接到可写流
readable.pipe(cleanLogStream).pipe(writable);

// 8.------- 监听事件 -------
readable.on('end', () => {
    console.log('文件读取完成');
});
cleanLogStream.on('finish', () => {
    console.log('转换流完成');
});
writable.on('finish', () => {
    console.log(`文件 ${outFilePath} 写入完成`);
});

// ------- 监听错误事件 -------

readable.on('error', (err) => {
    console.error(`文件 ${inputFile} 读取失败: ${err.message}`);
});

cleanLogStream.on('error', (err) => {
    console.error(`转换流失败: ${err.message}`);
});

writable.on('error', (err) => {
    console.error(`文件 ${outFilePath} 写入失败: ${err.message}`);
});

