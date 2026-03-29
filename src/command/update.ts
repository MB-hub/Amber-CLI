import { exec } from "child_process";
import chalk from "chalk";
import ora from "ora";
import { promisify } from "util";
import log from "../utils/log";
// 將 exec 轉為 Promise 版本，方便使用 async/await
const execPromise = promisify(exec);
const spinner = ora({
  text: chalk.blue("@dream-mb/amber-cli 正在更新..."),
  spinner: {
    interval: 300, // 变换时间 ms
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(item => chalk.blue(item)) // 设置加载动画
  }
});
export async function update() {
  spinner.start();
  try {
    // 執行安裝指令
    // 💡 提示：如果用戶沒做免 sudo 設置，這裡依然會報權限錯誤
    await execPromise("npm install @dream-mb/amber-cli@latest -g");

    spinner.succeed(chalk.green(" 更新成功！請重啟終端或執行 mengbo -v 查看新版本。"));
  } catch (error: any) {
    spinner.fail(chalk.red(" 更新失敗"));

    // 針對權限錯誤（EACCES）給予友好提示
    if (error.message.includes("EACCES") || error.message.includes("permission denied")) {
      log.warning(chalk.yellow("\n⚠️  權限不足，請嘗試執行："));
      log.info(chalk.white(`   sudo npm install @dream-mb/amber-cli@latest -g\n`));
    } else {
      log.error(chalk.red(`錯誤詳情: ${error.message}`));
    }
  }
  // exec("npm install @dream-mb/amber-cli@latest -g", (error) => {
  //   spinner.stop();
  //   if (!error) {
  //     console.log(chalk.green("更新成功"));
  //   } else {
  //     console.log(chalk.red(error));
  //   }
  // })
}