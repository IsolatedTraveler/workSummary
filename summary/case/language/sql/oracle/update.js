function deal (data,table){
	var sql = '';
	var update = ['sql'];
	var where = ['mkbh','ywdm'];
	data.forEach(item=>{
		var updated = [];
		var wheres = [];
		// 更新表
		sql+=`update ${table} set `;
		// 具体更新数据
		update.forEach(key=>{
			updated.push(`${key} = '${item[key].trim().replace(/'/g,"''")}'`)
		})
		sql+=updated.join(', ');
		// 条件限制语句
		where.forEach(key=>{
			wheres.push(`${key} = '${item[key]}'`)
		})
		sql+=" where "+wheres.join(' and ')+';\n';
	})
	return sql;
}