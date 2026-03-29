
import path from 'path';
import fs from 'fs-extra'
import {gt} from 'lodash'
import axios, { AxiosResponse } from 'axios'
import { input, select } from '@inquirer/prompts';
import { clone } from '../utils/clone'
import chalk from "chalk";
import { version,name } from '../../package.json'
export interface TemplateInfo {
  name: string; // 模板名称
  downloadUrl: string; // 模板下载地址
  description: string; // 模板描述
  branch: string; // 模板分支
}

export const templates: Map<string, TemplateInfo> = new Map([
  [
    'Vite-Vue3-Typescript-tempalte',
    {
      name: 'Vite-Vue3-Typescript-tempalte',
      downloadUrl: 'https://gitee.com/zhang-mengbo/vue3-type-script-pinia.git',
      description: 'Vue3技术栈开发模板',
      branch: 'master',
    },
  ],
  [
    'Vite-Vue3-移动端模板',
    {
      name: 'Vite-Vue3-Typescript-tempalte',
      downloadUrl: 'https://gitee.com/zhang-mengbo/vue3-type-script-pinia.git',
      description: 'Vue3技术栈开发模板',
      branch: 'master',
    },
  ],
]);

export function isOverwrite(fileName: string) {
  console.warn(`${fileName} 文件已存在，是否覆盖？`);
  return select({
    message: '是否覆盖',
    choices: [
      { name: '是', value: true },
      { name: '否', value: false },
    ],
  });
}

export const getNpmInfo = async (npmName: string) => {
  const npmUrl = `https://registry.npmjs.org/${name}`;
  let res = {}
  try {
    res = await axios.get(npmUrl)
  } catch (error) {
    console.error(error)
  }
  return res
};
export const getNpmLatestVersion = async (name: string) => {
  const { data } = await getNpmInfo(name) as AxiosResponse
  // console.info('npm info',data)
  return data['dist-tags'].latest
}
// 检查版本是否更新
export const checkVersion = async (name: string, version: string) => {
  const latestVersion = await getNpmLatestVersion(name);
  const need = gt(latestVersion, version);
  if (need) {
    console.warn(
      `检查到mengbo最新版本： ${chalk.blackBright(latestVersion)}，当前版本是：${chalk.blackBright(version)}`
    );
    console.log(
      `可使用： ${chalk.yellow('npm install @dream-mb/amber-cli@latest')}，或者使用：${chalk.yellow('mengbo update')}更新`
    );
  }
  return need;
}
export async function create(projectName?: string) {
  // 初始化模板列表
  const templateList = Array.from(templates).map((item: [string, TemplateInfo]) => {
    const [name, info] = item;
    return {
      name,
      value: name,
      description: info.description,
    };
  });
  if (!projectName) {
    projectName = await input({ message: '请输入项目名称' });
  }
  // 如果文件夹存在，则提示是否覆盖
  const filePath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(filePath)) {
    const run = await isOverwrite(projectName);
    if (run) {
      await fs.remove(filePath);
    } else {
      return; // 不覆盖直接结束
    }
  }
  // 检查版本更新
  await checkVersion(name, version);
  const templateName = await select({
    message: '请选择模板',
    choices: templateList,
  });
  const info = templates.get(templateName);
  console.log('info', info);
  if (info) {
    await clone(info.downloadUrl, projectName, ['-b', info.branch]);
  }
  console.log('create', projectName)
}