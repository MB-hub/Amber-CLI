import simpleGit, { SimpleGitOptions } from 'simple-git';
import createLogger from "progress-estimator";
import chalk from "chalk";
const logger = createLogger({ // 初始化进度条
  spinner: {
    interval: 300, // 变换时间 ms
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(item=>chalk.blue(item)) // 设置加载动画
  }
})
const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 当前工作目录
  binary: 'git', // 指定 git 二进制文件路径
  maxConcurrentProcesses: 6, // 最大并发进程数
};
export const clone = async (url: string, projectName: string, options: string[]) => {
  const git = simpleGit(gitOptions);
  try {
    await logger(git.clone(url, projectName, options), '代码下载中...',{
      estimate: 8000,// 预计下载时间
    }) ;
    console.log()
    console.log(chalk.green('代码下载成功'))
    console.log(chalk.blackBright('============================================'))
    console.log(chalk.blackBright('============欢迎使用 Git-CLI-Tool============'))
    console.log()
    console.log()
    console.log(chalk.blackBright('==========请使用 pnpm install 安装依赖=========='))
    console.log(chalk.blackBright('==========请使用 pnpm run dev 启动项目=========='))
  } catch (error) {
    console.log(chalk.red('代码下载失败'));
    console.log(error);
  }
};