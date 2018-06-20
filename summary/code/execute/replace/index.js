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
            reject(`The original file is empty;${file}`);
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
  ,inst = function () {
    var original = `summary/code/config/content/original.text`, complete = 'summary/code/config/content/complete.text';
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
        var that = this;
        Promise.all([readFile(original), readFile(that.regularUrl)]).then((data)=>{
          let allReg=JSON.parse(data[1]), str = data[0];
          Object.keys(allReg).forEach(function (key) {
            let regDes=allReg[key];
            if(regDes.use){
              let reg = new RegExp(regDes.reg,regDes.global);
              str = str.replace(reg, regDes.val);
            }
          });
          writeFile(complete,str).then(()=>{
            console.info('write in file successful');
          }).catch((data)=>{
            console.error(data);
          });
        }).catch((data)=>{
          console.error(data);
        });
      },
      files:function(){
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
          copyFiles(`summary/code/config`,`summary/code/execute/replace/config/init`).then(function(){
            console.info('copy the file successfully');
          })
        })
      },
      setConfig:function(){

      }
    }
  };
  CLASS.prototype = inst();
  module.exports = new CLASS();
})();