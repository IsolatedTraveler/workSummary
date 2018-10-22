select col,type
  from (SELECT column_name col, data_type type, table_name tab
          FROM USER_TAB_COLUMNS)
 where tab = 'T_SP_YLJGSZ'
   and col not in ('ID',
                   'XKLX',
                   'SPSJ',
                   'SPRXM',
                   'SPRID',
                   'SQJGID',
                   'SQSJ',
                   'SQRID',
                   'XGSJ',
                   'SPYJ','ZT');