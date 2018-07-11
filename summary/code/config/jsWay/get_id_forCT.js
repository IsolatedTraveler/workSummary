var obj=[];
[].forEach.call($('[name]:not([type=hidden])'),function(key){
	var name=$(key).attr('name');
	var id=name;
	if(/_qt$/.test(name)){
		id=name.replace('_qt','');
	}
	var title=$(`#${id}`).parents('.layui-inline').find('label').html()||'';
	title=title.replace(/<button[^<]+<\/button>/g,'').replace(/<[^>]+>/g,'').replace(/[\n\t]+/g,'').replace(/\*/g,'');
	if(/_qt$/.test(name)){
		title = title+'-其他';
	}
	if(title){
		obj.push({title,name,type:'VARCHAR(32)'});
	}
});
JSON.stringify(obj);