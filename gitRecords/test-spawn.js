const { spawn } = require('child_process');

console.log('正在使用 spawn 获取 Git 记录...\n');

// 1. spawn 的写法：第一个参数是命令，第二个参数是数组形式的参数
// 注意：不要把命令和参数写在一个字符串里！
const gitProcess = spawn('git', ['log', '-n', '4', '--oneline']);

// 2. 监听 stdout 的 'data' 事件（流式获取）
// 只要 Git 吐出一小块数据（chunk），就会立刻触发
gitProcess.stdout.on('data', (chunk) => {
  // chunk 默认是 Buffer 对象，需要转成字符串
  console.log(`[实时收到数据块]: ${chunk.toString()}`);
});

// 3. 监听 stderr（错误流也是流式的）
gitProcess.stderr.on('data', (chunk) => {
  console.error(`[错误信息]: ${chunk.toString()}`);
});

// 4. 监听 'close' 事件（进程结束）
// code 是退出码，0 代表成功，非 0 代表失败
gitProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Git 记录获取完毕，进程正常退出。');
  } else {
    console.error(`\n❌ Git 进程异常退出，退出码: ${code}`);
  }
});