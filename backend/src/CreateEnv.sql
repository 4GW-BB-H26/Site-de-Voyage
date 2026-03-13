--Script Instalation du logger
--run in ProjetVoyage


--Si erreurs:
--DROP TABLE LOGGER_PREFS CASCADE CONSTRAINTS;
--DROP TABLE

SPOOL result.log 
select to_char(sysdate,'YYYY-MM-YY HH24:MI')
FROM dual; 

@utils/logger/logger_install.sql
@config/Create_Tables.sql
--@config/PACKAGE_TAPI.pks
--@config/PACKAGE_TAPI.pkb
--mettre les scripts et tests ici
exec logger.PURGE_ALL;
/
--@runTests.sql