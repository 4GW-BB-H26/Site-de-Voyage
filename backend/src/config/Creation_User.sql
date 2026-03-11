--Script de creation du user
--run in sys

drop user ProjetVoyage CASCADE;
CREATE USER ProjetVoyage IDENTIFIED BY cisco;

grant connect, create view, create job, create table, create sequence, create
trigger, create procedure, create any context to ProjetVoyage;

alter user ProjetVoyage DEFAULT TABLESPACE USERS TEMPORARY TABLESPACE TEMP;
alter user ProjetVoyage QUOTA UNLIMITED on USERS;
