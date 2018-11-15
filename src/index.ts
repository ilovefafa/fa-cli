#! /usr/bin/env node

import * as program from 'commander';
// import * as fs from 'fs';
import * as fse from 'fs-extra';
import { kebabCase } from 'lodash';
import * as path from 'path';
import * as shell from 'shelljs';
import * as packageJson from '../package.json';

shell.config.silent = true;

/* function resolvePath(name) {
  return path.resolve(__dirname, name);
} */

function getTemplate(name: string): string {
  return path.resolve(__dirname, '../../template', name);
}

async function copyFile(name: string, to: string = name) {
  const file = {
    path: process.cwd() + `\\${to}\\index.vue`,
    to,
  };
  await fse.copy(getTemplate(name), process.cwd() + `/${to}`);
  return new Promise((resolve, reject) => {
    resolve(file);
  });
}

async function changeSFC(file) {
  try {
    const content = await fse.readFile(file.path, 'utf8');
    const newContent = content.replace(/name/g, `${kebabCase(file.to)}`);
    await fse.writeFile(file.path, newContent);
    console.log('success');
  } catch (err) {
    console.log(err);
  }
}

program
  .version(packageJson.version, '-v, --version')
  .option('-p, --my-play', 'create play folder')
  .option('-s, --vue-sfc [folderName]', 'vue-sfc')
  .option('-k, --koa-cli [folderName]', 'koa template')
  .parse(process.argv);

/* 不输入参数直接结束并打印帮助 */
if (!process.argv.slice(2).length) {
  program.help();
}

/* 判断指令执行任务 */
if (program.myPlay) {
  copyFile('my-play').then(() => console.log('success!'))
    .catch((err) => {
      console.log(err);
    });
}
if (program.vueSfc) {
  copyFile('vue-sfc', program.vueSfc).then((file) => {
    changeSFC(file);
  });
}

if (program.koaCli) {
  const name = program.koaCli;
  let result;
  let koaPackageJson;
  const files = fse.readdirSync('./');
  if (files.length !== 0) {
    result = shell.mkdir(name);
    if (result.code === 1) {
      console.log(result.stderr);
      process.exit(1);
    }
    shell.cd(name);
  }
  shell.cp('-r', `${getTemplate('koa-cli')}/*`, './'); // 复制所有文件不包括隐藏文件
  shell.cp('-r', `${getTemplate('koa-cli')}/.*`, './'); // 复制所有隐藏文件
  shell.mv('.temp', '.gitignore');
  koaPackageJson = JSON.parse(fse.readFileSync('./package.json'));
  koaPackageJson.name = name;
  fse.writeFileSync('./package.json', JSON.stringify(koaPackageJson, undefined, 2));
  shell.exec('git init');
  console.log('sucess,please run "npm i"');
}
