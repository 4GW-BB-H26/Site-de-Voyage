-- =============================================================================
-- Crée le compte ProjetVoyage (mot de passe cisco) ou remet ce mot de passe si le compte existe déjà.
-- Connecte-toi en SYS avec le rôle SYSDBA, sur le MÊME nom de service que dans ORACLE_CONNECT_STRING
-- =============================================================================

SET SERVEROUTPUT ON;

-- Bloc PL/SQL : création ou simple reset du mot de passe
DECLARE
  v_count NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM all_users WHERE username = 'PROJETVOYAGE';

  IF v_count = 0 THEN
    EXECUTE IMMEDIATE q'[
      CREATE USER ProjetVoyage IDENTIFIED BY cisco
        DEFAULT TABLESPACE USERS
        TEMPORARY TABLESPACE TEMP
        QUOTA UNLIMITED ON USERS
    ]';
    DBMS_OUTPUT.PUT_LINE('OK — compte ProjetVoyage créé.');
  ELSE
    EXECUTE IMMEDIATE 'ALTER USER ProjetVoyage IDENTIFIED BY cisco ACCOUNT UNLOCK';
    DBMS_OUTPUT.PUT_LINE('OK — mot de passe remis à « cisco » et compte déverrouillé.');
  END IF;
END;
/

-- Droits nécessaires au schéma du projet (packages, procédures, etc.)
GRANT CONNECT, RESOURCE, CREATE VIEW, CREATE SEQUENCE, CREATE PROCEDURE,
      CREATE TRIGGER, CREATE JOB TO ProjetVoyage;

ALTER USER ProjetVoyage ACCOUNT UNLOCK;

-- Peut échouer selon l’édition Oracle ; on ignore l’erreur dans ce cas
BEGIN
  EXECUTE IMMEDIATE 'GRANT CREATE ANY CONTEXT TO ProjetVoyage';
EXCEPTION
  WHEN OTHERS THEN NULL;
END;
/

COMMIT;
