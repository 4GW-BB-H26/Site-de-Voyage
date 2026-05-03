-- verification de la creation de la connexion
-- (à lancer connecté en tant que SYS)

SET LINESIZE 200

PROMPT === Où suis-je ? (le nom peut être vide sur une vieille instance sans multitenant) ===
SELECT SYS_CONTEXT('USERENV', 'CON_NAME') AS conteneur_courant FROM dual;

PROMPT === Est-ce que PROJETVOYAGE est déjà là ? ===
SELECT username, account_status, created
FROM   all_users
WHERE  username = 'PROJETVOYAGE';

-- Dans un cas ou il n'a aucun resultat, lancer le script ensure_oracle_user.sql
