  /**
   * @author IsolatedTraveler
   * @version v1.0.0
   * @description 利用正则表达式进行批量文本替换
   */
  (()=>{
    'use strict';
    const readline = require('readline');
    const r1 = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    var fs = fs = require('fs-extra')
    ,CLASS =function(){
      this.regularUrl = `${__dirname}\\config\\regular.json`;
    }
    // 向文件中写入内容
    ,writeFile = function (file,str){
      return new Promise((resolve,reject)=>{
        fs.writeFile(file, str, function (err) {
          if(err){
            reject('Write a string to the complete.text file failed');
          }else{
            resolve();
          }
        });
      });
    }
    //  读取文件中内容
    ,readFile = function(file){
      return new Promise((resolve,reject)=>{
        fs.readFile(file, 'utf8', function (err, data) {
          if(err){
            reject(`Failure to read the original file:${file}`);
          }else{
            if(!data){
              reject(`The file is empty;${file}`);
            }else{
              resolve(data);
            }
          }
        });
      });
    }
    // 删除文件
    ,deleteFile = function(path){
      return fs.unlink(path).then(function(err){
        if(err){
          console.error(`delete the file unsuccessfully`);
        }
      })
    }
    // 获取当前路径下的文件
    ,isFile = function(path,callback){
      return new Promise(function(resolve,reject){
        fs.exists(path,function(exists){
          if(exists){
            fs.stat(path,function(err,stat){
              if(err){
                reject(err);
              }else{
                if(stat.isFile()){
                  callback(path).then(function(){
                    resolve()
                  })
                }else{
                  fs.readdir(path,function(err,files){
                    if(err){
                      reject(err)
                    }else{
                      let del = [];
                      files.forEach(function(file){
                        del.push(isFile(`${path}\\${file}`,callback));
                      })
                      Promise.all(del).then(function(){
                        fs.rmdir(path,function(){
                          resolve();
                        });
                      })
                    }
                  })
                }
              }
            })
          }else{
            fs.mkdir(path,function(){
              resolve()
            })
          }
        })
      }).catch(function(err){
        console.error(err);
      })
    }
    ,copyFile = function(path,link,resolve){
      var readStream = fs.createReadStream(link);
      var writeStream = fs.createWriteStream(path);
      readStream.pipe(writeStream);
      readStream.on('end', function () {
        resolve()
      })
    }
    ,copyFolder = function(path,link,resolve,reject){
      fs.readdir(link,function(err,files){
        if(err){
          reject(err);
        }else{
          var copy = [];
          files.forEach(function(key){
            copy.push(copyFiles(`${path}\\${key}`,`${link}\\${key}`));
          })
          Promise.all(copy).then(function(){
            resolve()
          })
        }
      })
    }
    ,copyFiles = function(path,link){
      return new Promise(function(resolve,reject){
        fs.stat(link,function(err,stat){
          if(err){
            reject(err);
          }else{
            if(stat.isFile()){
              copyFile(path,link,resolve,reject);
            }else{
              fs.exists(path,function(exists){
                if(exists){
                  copyFolder(path,link,resolve,reject);
                }else{
                  fs.mkdir(path,function(){
                    copyFolder(path,link,resolve,reject);
                  })
                }
              })
            }
          }
        });
      }).catch(function(err){
        console.error(err);
      })
    }
    ,analyse = function (tpl){
      if(tpl){
        return tpl.replace(/{{[ ]*([\.\*\-\/a-zA-Z0-9_$|&?:\(\)'="+]+)[ ]*}}/g,'`+($1)+`').replace(/([\s]+){{#([^}]+)}}([\s]+)([^{]+)>[{{#\s}]+}([\s]+)/g,'`;$1$2str+=`$3$4>`}str+=`$5').replace(/([\s]+){{!#([^#]+)#!}}/,'`$1$2str+=`');
      }
    }
    ,analyses = function(config,content){
      var html='';
      Object.keys(config.module).forEach(function (key) {
        let val = config.module[key];
        let template = content[val.type];
        let str = analyse(template);
        str = "let analyse ="+ analyse +";let content = "+ JSON.stringify(content) +";let analyses= "+ analyses +";let str = `" + str + "`;\nreturn str;"
        let fun = new Function('d,g',str);
        str = fun(val,config.global);
        if(/^[0-9]+$/.test(key)){
          str = str.replace(/id=[\S]+[\s]/,'');
        }
        html += str+'\n';
      });
      html = html.replace(/ [a-zA-Z0-9\-\_]+=['"]undefined['"]/g,'').replace(/ undefined/g,'');
      return html;
    }
    ,inst = function () {
      var template = `summary/code/config/template.json`, complete = 'summary/code/config/content/complete.text', config='summary/code/config/config.json';
      var folder='';
      return {
        // 简写
        init:function(){
          this.file();
        },
        s:function(){
          this.files();
        },
        getC:function(){
          this.getConfig()
        },
        setC:function(){
          this.setConfig()
        },
        //主体
        file:function(){
          Promise.all([readFile(template), readFile(config)]).then((data)=>{
            let content=JSON.parse(data[0]), config = JSON.parse(data[1]);
            // 获取模板
            [].forEach.call(config.position,function(key){
                if(typeof content == 'object'){
                  content=content[key]
                }else{
                  console.error('模板获取错误');
                }
            })
            // 解析模板
           let html = analyses(config,content);
            writeFile(complete,html).then(()=>{
              console.info('write in file successful');
            }).catch((data)=>{
              console.error(data);
            });
          }).catch((data)=>{
            console.error(data);
          });
        },
        files:function(){
          isFile(folder,new Promise((resolve,reject)=>{
  
          }))
        },
        description:{
          des:'获取描述信息',
          file:'单文本内容替换'
        },
        des:function () {
          let des = this.description;
          Object.keys(des).forEach(function(key){
            let oKey = key;
            if(oKey.length<30){
              oKey+='                              ';
              oKey=oKey.substring(0,30);
            }
            console.info(oKey,des[key]);
          })
        },
        getConfig:function(){
          isFile(`summary/code/config`,deleteFile).then(function(){
            copyFiles(`summary/code/config`,`summary/code/execute/create/config`).then(function(){
              console.info('copy the file successfully');
            })
          })
        },
        setConfig:function(){console.log(111)
          isFile(`summary/code/execute/create/config`,deleteFile).then(function(){
            copyFiles(`summary/code/execute/create/config`,`summary/code/config`).then(function(){
              console.info('copy the file successfully');
            })
          })
        }
      }
    };
    CLASS.prototype = inst();
    module.exports = new CLASS();
  })();