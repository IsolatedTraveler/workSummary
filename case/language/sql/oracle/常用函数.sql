-- 非空判断
	select nvl(null,'a') as name from dual;
-- 
-- 条件判断
	select decode($col,val1,printVal1,val2,printVal2...valn,printValn,printValn+1) from dual;
	-- eg
		select decode('a','b','b1','c','c1','d1') from dual; -- 'd1'
		select decode('b','b','b1','c','c1','d1') from dual; -- 'b1'
	--
-- 
-- 根据指定字符分割字符串
	select REGEXP_SUBSTR($col,reg,start,index) from table;
	-- eg
		select REGEXP_SUBSTR('1-asd','[^-]+',1,2) from dual; -- 'asd'
		select REGEXP_SUBSTR('1-asd-cd','[^-]+',1,3) from dual; -- 'cd'
		select REGEXP_SUBSTR('1-asd-cd','[^-]+',3,2) from dual; -- 'cd'
	-- 
-- 
-- 日期处理函数
	-- date to char
	select to_char(sysdate,'yyyy-mm-dd hh:mm:ss') from dual;