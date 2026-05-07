--Script Instalation du logger
--run in ProjetVoyage

SPOOL result.log
select to_char(
   sysdate,
   'YYYY-MM-YY HH24:MI'
)
  from dual;

@../src/utils/logger/logger_install.sql 
@Create_Tables.sql
@CreateDataOracle.sql