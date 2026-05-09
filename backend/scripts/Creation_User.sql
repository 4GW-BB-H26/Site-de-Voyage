--Script de creation du user
--il FAUT se deconnecter 
--run en tant que sys

drop user projetvoyage cascade; --Il y'aura une erreur si le user n'existe pas, mais ca n'empeche pas le script de rouler

create user projetvoyage identified by cisco;

grant connect,
   create view,
   create job,
   create table,
   create sequence,
   create trigger,
   create procedure,
   create any context
to projetvoyage;

alter user projetvoyage
   default tablespace users
   temporary tablespace temp;
alter user projetvoyage
   quota unlimited on users;