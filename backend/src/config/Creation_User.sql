--Script de creation du user
--run in sys


CREATE USER ProjetVoyage IDENTIFIED BY cisco;

grant connect, create view, create job, create table, create sequence, create
trigger, create procedure, create any context to ProjetVoyage;

alter user ProjetVoyage QUOTA UNLIMITED on USERS;