--Script de creation du user
--run en tant que sys

drop user ProjetVoyage CASCADE; --Il y'aura une erreur si le user n'existe pas, mais ca n'empeche le script de rouler

CREATE USER ProjetVoyage IDENTIFIED BY cisco;

grant connect, create view, create job, create table, create sequence, create
trigger, create procedure, create any context to ProjetVoyage;

alter user ProjetVoyage DEFAULT TABLESPACE USERS TEMPORARY TABLESPACE TEMP;
alter user ProjetVoyage QUOTA UNLIMITED on USERS;
