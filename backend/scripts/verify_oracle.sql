-- Petit check : tu es sur la bonne base, et est-ce que ProjetVoyage existe ?
-- (à lancer connecté en SYS AS SYSDBA, même service que dans ORACLE_CONNECT_STRING)

SET LINESIZE 200

PROMPT === Où suis-je ? (le nom peut être vide sur une vieille instance sans multitenant) ===
SELECT SYS_CONTEXT('USERENV', 'CON_NAME') AS conteneur_courant FROM dual;

PROMPT === Est-ce que PROJETVOYAGE est déjà là ? ===
SELECT username, account_status, created
FROM   all_users
WHERE  username = 'PROJETVOYAGE';

-- Si aucune ligne : lance ensure_oracle_user.sql pour créer le compte.
