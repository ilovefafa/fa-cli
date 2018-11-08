#! /usr/bin/env node

import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as packageJson from '../package.json';
import { myPlayHtml } from './template';

if (!process.argv.slice(2).length) {
  program.help();
}

function createFile(name: string, content: string = ''): void {
  const filePath = path.resolve(process.cwd(), name);
  fs.appendFile(filePath, content, (err) => {
    if (err) { console.log(err); }
  });
}

program
  .version(packageJson.version, '-v, --version')
  .option('-p, my-play', 'create play folder')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

if (program.myPlay) {
  fs.mkdir(path.resolve(process.cwd(), 'my-play'), (err) => {
    console.log(err);
  });
  createFile('my-play/play.html', myPlayHtml);
  createFile('my-play/play.js');
}
if (program.peppers) { console.log('  - peppers'); }
if (program.pineapple) { console.log('  - pineapple'); }
if (program.bbqSauce) { console.log('  - bbq'); }
