// 子进程不需要引入 child_process，它天然拥有 process 对象

// 1. 监听主进程派发的任务
process.on('message', (msg) => {
    console.log(`🛠️  [子进程 ${process.pid}] 收到任务: 计算 ${msg.start} 到 ${msg.end} 的和`);
  
    let sum = 0;
    for (let i = msg.start; i <= msg.end; i++) {
      sum += i;
    }
  
    // 2. 计算完毕，把结果发回给主进程
    process.send(sum);
  });