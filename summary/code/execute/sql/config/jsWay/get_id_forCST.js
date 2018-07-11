// a来源于createTable.json
var a = JSON.parse(``);
var col = a.col;
var obj = {};
[].forEach.call(col,function(key){
	obj[key.name]=key.title;
})
JSON.stringify(obj);