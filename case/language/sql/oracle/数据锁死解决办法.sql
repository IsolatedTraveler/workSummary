select sess.SID,sess.SERIAL#,lo.ORACLE_USERNAME,lo.OS_USER_NAME,ao.object_name,lo.LOCKED_MODE from v$locked_object lo,dba_objects ao,v$session sess
where ao.object_id = lo.OBJECT_ID
and lo.SESSION_ID = sess.SID;

alter system kill session 'sid,SERIAL#'