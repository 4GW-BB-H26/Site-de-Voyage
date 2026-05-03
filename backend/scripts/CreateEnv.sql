--Script Instalation du logger
--run in ProjetVoyage

SPOOL result.log 
select to_char(sysdate,'YYYY-MM-YY HH24:MI')
FROM dual; 

@../src/utils/logger/logger_install.sql 
@Create_Tables.sql
