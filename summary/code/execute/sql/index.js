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
    },
    getPosition = function(str,i){
      var position =[];
      var j=str.indexOf(i);
      while(j > -1){
        position.push(j);
        j=str.indexOf(i,j+1);
      }
      return position;
    }
    ,sd = require('silly-datetime')
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
    ,setNote = function(j=76){
      var str ='';
      for(let i=0;i<j;i++){
        str += '-';
      }
      return str
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
      var dataFile = `summary/code/config/data.json`, complete = 'summary/code/config/content/complete.text';
      var folder='';
      return {
        // 简写
        ct:function(){
          this.createTable();
        },
        csp:function(){
          this.createStoredProcedure();
        },
        ci:function(){
          this.createInsert()
        },
        cs:function(){
          this.createSelect()
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
        cc:function(){
          this.createCondition()
        },
        //主体
        createTable:function(){
          readFile(dataFile).then((data)=>{
            data = JSON.parse(data);
            var str=`drop table ${data.name};\ncreate table ${data.name} (\n`;
            var cols=data.col;
            for(let col of cols){
                str += `\t${col.name} ${col.type} ,\n`;
            }
            str = str.replace(/,\n$/,'\n');
            str += ');\n';
            str += `comment on table ${data.name} is '${data.title}';\n`;
            for(let col of cols){
                str += `comment on column ${data.name}.${col.name} is '${col.title}';\n`;
            }
            writeFile(complete,str).then(()=>{
              console.info('write in file successful');
            }).catch((data)=>{
              console.error(data);
            });
          }).catch((data)=>{
            console.error(data);
          });
        },
        createStoredProcedure:function(){
          readFile(dataFile).then((data)=>{
            data = JSON.parse(data);
            let table = data.name;
            var str=``;
            for(let item of data.col){
                str += `v_${item.name} ${table}.${item.name}%type; --${item.title}\n\t`;
            }
            str += '\n\n\n\n\t';
            for(let item of data.col){
              if(item.type=='date'){
                str += `v_${item.name}:= json_date(v_json_data, '${item.name}'); --${item.title}\n\t`;
              }else{
                str += `v_${item.name}:= json_str(v_json_data, '${item.name}'); --${item.title}\n\t`;
              }
            }
            writeFile(complete,str).then(()=>{
              console.info('write in file successful');
            }).catch((data)=>{
              console.error(data);
            });
          }).catch((data)=>{
            console.error(data);
          });
        },
        alertSql:function(){
          readFile(dataFile).then((data)=>{
            data = JSON.parse(data);
            let table = data.name;
            var str=``;
            for(let item of data.col){
                str += `alter table ${table} modify(${item.name} ${item.type});\n`;
            }
            writeFile(complete,str).then(()=>{
              console.info('write in file successful');
            }).catch((data)=>{
              console.error(data);
            });
          }).catch((data)=>{
            console.error(data);
          });
        },
        createInsert:function(){
          readFile(dataFile).then((data)=>{
            data = JSON.parse(data);
            let str = `insert into ${data.name}`;
            let val =[],name=[],cols=data.col;
            for(let key in cols){
              name.push(key);
              val.push(`'${cols[key]}'`);
            }
            str += `(${name.join(',')}) values (${val.join(',')})`;
            writeFile(complete,str).then(()=>{
              console.info('write in file successful');
            }).catch((data)=>{
              console.error(data);
            });
          }).catch((data)=>{
            console.error(data);
          });
        },
        createSelect:function(){
          readFile(dataFile).then((data)=>{
            data = JSON.parse(data);
            let str = `select `;
            let name=[],cols=data.col;
            for(let key in cols){
              name.push(key);
            }
            str += `${name.join(',')} from ${data.name}`;
            writeFile(complete,str).then(()=>{
              console.info('write in file successful');
            }).catch((data)=>{
              console.error(data);
            });
          }).catch((data)=>{
            console.error(data);
          });
        },
        createCondition:function(){
          readFile(dataFile).then((data)=>{
            data = JSON.parse(data);
            var str=``;
            var cols=data.col;
            for(let col of cols){
                str += `<if if(StringUtils.isNotBlank(#{${col.name}}))>\n\tand a.${col.name} = #{${col.name}}\n</if>\n`;
            }    
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
            copyFiles(`summary/code/config`,`summary/code/execute/sql/config`).then(function(){
              console.info('copy the file successfully');
            })
          })
        },
        setConfig:function(){
          isFile(`summary/code/execute/sql/config`,deleteFile).then(function(){
            copyFiles(`summary/code/execute/sql/config`,`summary/code/config`).then(function(){
              console.info('copy the file successfully');
            })
          })
        }
      }
    };
    CLASS.prototype = inst();
    module.exports = new CLASS();
  })();