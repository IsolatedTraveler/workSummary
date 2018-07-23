var obj=[];
[].forEach.call($('[name]:not([type=hidden])'),function(key){
	var name=$(key).attr('name');
	var id=name;
	var title ='';
	if(/_qt$/.test(name)){
		id=name.replace('_qt','');
	}else{
		title=$(`#${id}`).parent().parent().find('label').html()||'';
	}
	title=title.replace(/<button[^<]+<\/button>/g,'').replace(/<[^>]+>/g,'').replace(/[\n\t]+/g,'').replace(/\*/g,'');
	if(title){
		obj.push({title,name,type:'VARCHAR(32)'});
	}
});
JSON.stringify(obj);