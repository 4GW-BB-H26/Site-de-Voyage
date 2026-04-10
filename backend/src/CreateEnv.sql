--Script Instalation du logger
--run in ProjetVoyage

SPOOL result.log 
select to_char(sysdate,'YYYY-MM-YY HH24:MI')
FROM dual; 

@utils/logger/logger_install.sql 
@config/Create_Tables.sql
@config/PACKAGE_TAPI.pks
@config/PACKAGE_TAPI.pkb
@config/RESERVATION_TAPI.pks
@config/RESERVATION_TAPI.pkb
@config/DESTINATION_TAPI.pks
@config/DESTINATION_TAPI.pkb
@config/TRIP_tapi.pks
@config/TRIP_tapi.pkb

--mettre les scripts et tests ici
@runTests.sql