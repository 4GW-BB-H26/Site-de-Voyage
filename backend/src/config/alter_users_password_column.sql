-- À exécuter une fois sur une base existante si PASSWORD était VARCHAR2(50) (trop court pour bcrypt).
ALTER TABLE users MODIFY ( password VARCHAR2(100) );
