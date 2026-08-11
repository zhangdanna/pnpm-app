#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');
const ProgressBar = require('progress');
const { program } = require('commander');

// --- 辅助函数：转义正则特殊字符 ---
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- 标记：用块注释包裹，天然支持跨行，原文保留为注释（留痕），便于恢复 ---
const MARKER_START = '/* [LOG-CLEANER-START] ';
const MARKER_END = ' [LOG-CLEANER-END] */';

// 恢复时匹配整块，捕获中间的原始代码
const RESTORE_REGEX = new RegExp(
  `${escapeRegExp(MARKER_START)}([\\s\\S]*?)${escapeRegExp(MARKER_END)}`,
  'g'
);

const CONSOLE_LOG = 'console.log';

// 判断 content[i] 处是否是独立的 console.log 标识符（前后都不是标识符字符）
function atConsoleLog(content, i) {
  const prev = content[i - 1];
  if (prev && /[\w$]/.test(prev)) return false;
  if (!content.startsWith(CONSOLE_LOG, i)) return false;
  const next = content[i + CONSOLE_LOG.length];
  if (next && /[\w$]/.test(next)) return false;
  return true;
}

// 从 console.log 起，按括号配对扫描到调用结束（含尾随 ;）
// 正确处理字符串 / 模板字面量 / 注释 / 嵌套括号 / 跨行
function scanCallEnd(content, start) {
  const n = content.length;
  let i = start + CONSOLE_LOG.length;
  while (i < n && /\s/.test(content[i])) i++;
  if (content[i] !== '(') return -1;

  let depth = 0;
  let str = null; // 当前所处的字符串引号：' " `
  while (i < n) {
    const ch = content[i];
    if (str) {
      if (ch === '\\') { i += 2; continue; }
      if (ch === str) str = null;
      i++; continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { str = ch; i++; continue; }
    if (ch === '/' && content[i + 1] === '/') {
      while (i < n && content[i] !== '\n') i++;
      continue;
    }
    if (ch === '/' && content[i + 1] === '*') {
      i += 2;
      while (i < n && !(content[i] === '*' && content[i + 1] === '/')) i++;
      i += 2; continue;
    }
    if (ch === '(') { depth++; i++; continue; }
    if (ch === ')') {
      depth--;
      i++;
      if (depth === 0) {
        while (i < n && /[ \t]/.test(content[i])) i++;
        if (content[i] === ';') i++;
        return i;
      }
      continue;
    }
    i++;
  }
  return -1;
}

// 清理：把代码中的 console.log(...) 整段包裹为块注释（留痕）
// 跳过字符串 / 注释中出现的 console.log 字面量，避免误伤
function cleanContent(content) {
  let out = '';
  const n = content.length;
  let i = 0;
  let str = null;
  while (i < n) {
    const ch = content[i];
    if (str) {
      if (ch === '\\') { out += content.slice(i, i + 2); i += 2; continue; }
      out += ch;
      if (ch === str) str = null;
      i++; continue;
    }
    if (ch === '/' && content[i + 1] === '/') {
      let j = i;
      while (j < n && content[j] !== '\n') j++;
      out += content.slice(i, j);
      i = j; continue;
    }
    if (ch === '/' && content[i + 1] === '*') {
      let j = i + 2;
      while (j < n && !(content[j] === '*' && content[j + 1] === '/')) j++;
      j = Math.min(j + 2, n);
      out += content.slice(i, j);
      i = j; continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { out += ch; str = ch; i++; continue; }
    if (atConsoleLog(content, i)) {
      const end = scanCallEnd(content, i);
      if (end !== -1) {
        out += MARKER_START + content.slice(i, end) + MARKER_END;
        i = end;
        continue;
      }
    }
    out += ch; i++;
  }
  return out;
}

// 恢复：去掉标记，还原中间被注释的原始 console.log 代码
function restoreContent(content) {
  return content.replace(RESTORE_REGEX, (_, inner) => inner);
}

// --- 命令行参数定义 ---
program
  .name('clean-log')
  .description('批量清理或恢复 JS 文件中的 console.log（清理保留原文为注释，恢复就地覆盖当前文件）')
  .version('2.0.0')
  .argument('<pattern>', '文件匹配模式 (例如: ./src/**/*.js)')
  .option('-r, --restore', '开启恢复模式：去掉标记、还原 console.log，并就地覆盖当前文件', false)
  .option('-o, --output <dir>', '清理模式的输出目录 (默认: cleaned-dist)', 'cleaned-dist')
  .parse(process.argv);

const options = program.opts();
const arg = program.args[0];
if (!arg) {
  console.error('请提供文件匹配模式，例如: clean-log "./src/**/*.js"');
  process.exit(1);
}
const pattern = arg.replace(/\\/g, '/');

// --- 主流程 ---
function main() {
  const files = globSync(pattern);
  if (files.length === 0) {
    console.log('未找到匹配的文件。');
    return;
  }

  console.log(`找到 ${files.length} 个文件，操作模式: ${options.restore ? '🔄 恢复日志（就地覆盖）' : '🧹 清理日志（输出到目录）'}`);

  const bar = new ProgressBar('总进度 [:bar] :current/:total (:percent) | :file', {
    total: files.length,
    width: 30,
    complete: '=',
    incomplete: ' ',
    renderThrottle: 100
  });

  const basePath = process.cwd();
  let changedCount = 0;

  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const newContent = options.restore ? restoreContent(content) : cleanContent(content);

      if (newContent === content) {
        bar.tick({ file: path.basename(filePath) });
        continue;
      }

      // 恢复就地覆盖当前文件；清理写入到输出目录（保留目录结构）
      const outPath = options.restore
        ? filePath
        : path.join(options.output, path.relative(basePath, filePath));

      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, newContent, 'utf-8');
      changedCount++;
      bar.tick({ file: path.basename(filePath) });
    } catch (err) {
      console.error(`\n处理文件失败: ${filePath}`, err.message);
    }
  }

  console.log(`\n✅ 完成！共修改 ${changedCount} 个文件。`);
  if (options.restore) {
    console.log('已就地恢复原文件。');
  } else {
    console.log(`输出目录: ${path.resolve(options.output)}`);
  }
}

main();
