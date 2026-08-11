// child_process 进程管理
const { exec } = require('child_process');

console.log('正在使用 exec 获取 Git 记录...\n');

// 1. 执行 git log 命令
// -n 3: 只获取最近 3 条
// --oneline: 每条记录压缩成一行（hash + 标题）
exec('git log -n 3 --oneline', (error, stdout, stderr) => {
    console.log(stdout, stderr)
  
  // 2. 错误处理
  if (error) {
    // 如果当前目录不是 git 仓库，或者没有安装 git，就会触发这里
    console.error('❌ 获取失败:', error.message);
    return;
  }
  
  if (stderr) {
    console.error('警告:', stderr);
  }

  // 3. 解析输出
  // stdout 是字符串，用换行符分割成数组，并过滤掉空行
  const commits = stdout.trim().split('\n').filter(Boolean);

  // 4. 格式化打印
  console.log('📝 最近 3 次提交记录:');
  commits.forEach((commit, index) => {
    console.log(`  ${index + 1}. ${commit}`);
  });
});