const { fork } = require('child_process');

console.log('👑 [主进程] 启动，准备分发任务...');

// 1. 启动两个子进程（worker.js）
const worker1 = fork('./worker.js');
const worker2 = fork('./worker.js');

let totalSum = 0;
let finishedWorkers = 0;

// 2. 监听子进程发来的消息
function handleMessage(sum) {
  totalSum += sum;
  finishedWorkers++;
  console.log(`👑 [主进程] 收到子进程计算结果: ${sum}`);

  // 当两个子进程都算完时，汇总结果
  if (finishedWorkers === 2) {
    console.log(`\n🎉 [主进程] 最终总和: ${totalSum}`);
    // 任务完成，主动杀掉子进程，防止程序一直挂起
    worker1.kill();
    worker2.kill();
  }
}

worker1.on('message', handleMessage);
worker2.on('message', handleMessage);

// 3. 给子进程派发任务（通过 send 发送数据）
worker1.send({ start: 1, end: 500 });
worker2.send({ start: 501, end: 1000 });