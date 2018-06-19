(()=>{
  'use strict';
  var fs = require('fs-extra'), original = 'summarry/original.text', complete = 'summarry/complete.text';
  var readFile = (file)=>{
    return new Promise((resolve,reject)=>{
      fs.readFile(file, 'utf8', function (err, data) {
        if(err){
          reject('Failure to read the original file');
        }else{
          if(!data){
            reject('The original file is empty');
          }else{
            resolve(data);
          }
        }
      });
    });
  };
  var writeFile = (file,str)=>{
    return new Promise((resolve,reject)=>{
      fs.writeFile(file, str, function (err) {
        if(err){
          reject('Write a string to the complete.text file failed');
        }else{
          resolve();
        }
      });
    });
  };
  Promise.all([readFile(original), readFile('summarry/replace/regular.json')]).then((data)=>{
    let allReg=JSON.parse(data[1]), str = data[0];
    Object.keys(allReg).forEach(function (key) {
      let regDes=allReg[key];
      if(regDes.use){
        let reg = new RegExp(regDes.reg,regDes.global);
        str = str.replace(reg, regDes.val);
      }
    });
    writeFile(complete,str).then(()=>{
      console.log('write in file successful');
    }).catch((data)=>{
      console.error(data);
    });
  }).catch((data)=>{
    console.error(data);
  });
})();