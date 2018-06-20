 /**
   * @author IsolatedTraveler
   * @version v1.0.0
   * @description 利用正则表达式进行批量文本替换
   */
(()=>{
  'use strict';
  var self={}
  const readline = require('readline');
  const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  // r1.question('Please enter the command name of what you want to executed?',(cin)=>{
    var cin='replace-getC';
    let exe = cin.split('-');
    let rootDir = '';
    rootDir = `${__dirname}\\execute\\${exe[0]}\\index.js`;
    let file = require(rootDir);
    file[exe[1]||'init']();
    r1.close();
  // })
})()