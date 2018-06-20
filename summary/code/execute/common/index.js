
  const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  var fs = require('fs-extra')
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
        console.error(`删除文件${path}失败;`);
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
                        console.info(`成功移除目录${path}`);
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
            console.info(`成功创建目录${path}`);
            resolve()
          })
        }
      })
    })
  }