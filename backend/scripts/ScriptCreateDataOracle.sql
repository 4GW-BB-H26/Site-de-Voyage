-- Insertion des donnees
-- A executer en tant que ProjetVoyage

--La table DESTINATION
INSERT INTO DESTINATION
VALUES (1, 'Montreal', 'Canada', 'https://voyages.destinationcanada.com/_next/image?url=https%3A%2F%2Fadmin.destinationcanada.com%2Fsites%2Fdefault%2Ffiles%2F2023-06%2FQC-Montreal-Skyline_hero.jpg'||CHR(38)||'w=1024'||CHR(38)||'q=75'); --||chr(38) sert a remplace & qui causait une substitution

INSERT INTO DESTINATION
VALUES (2, 'Barcelone', 'Espagne', 'https://poble-espanyol.com/wp-content/uploads/2024/05/Que-ver-en-Barcelona-en-un-dia-1.jpg');

INSERT INTO DESTINATION
VALUES (3, 'Toyko', 'Japon', 'https://t4.ftcdn.net/jpg/02/51/12/11/360_F_251121174_5xQyUCqSrkswyLHbM9Ne8DQ8Qb0o1HGw.jpg');

INSERT INTO DESTINATION
VALUES (4, 'New York', 'États-Unis', 'https://image.urlaubspiraten.de/640/image/upload/v1732188243/Impressions%20and%20Other%20Assets/New_York_jzzuwq.jpg');

INSERT INTO DESTINATION
VALUES (5, 'Paris', 'France', 'https://www.berlinsbi.com/uploads/sites/2/2023/07/paris-france-student-international-experience.jpg');

INSERT INTO DESTINATION
VALUES (6, 'Rome', 'Italie', 'https://i.natgeofe.com/k/a6c9f195-de20-445d-9d36-745ef56042c5/OG_Colosseum_Ancient-Rome_KIDS_1122_square.jpg');


-- La table PACKAGE
INSERT INTO PACKAGE
VALUES(1,'Hotel BDEB','Visite guidee du Musee Letendre','avion','OLivier French',5, 3.8, 12,'un beau voyage',799,1,1);

INSERT INTO PACKAGE
VALUES(2,'Hotel Couche-tot','Randonee dans le Parc National du Bois Franc','avion','Max Colpron',2,4.2,40,'faut se coucher tot',599,2,2);

INSERT INTO PACKAGE
VALUES(3,'Hotel du Roi-Frais','Nage avec les poisson rois','avion','Louis',12,4.8,23,'Tres frais',899,3,3);

INSERT INTO PACKAGE
VALUES(4,'Liberty Hotel','Visite de la Statue de la Libertee','avion','John Wetson',7,3.2,67,'La liberte reigne',1299,4,4);

INSERT INTO PACKAGE
VALUES(5,'Hotel Baguette','Degustation de repas francais authentique','avion','Gabriel Agress',4,1,23,'Bon apetit',2099,5,5);

INSERT INTO PACKAGE
VALUES(6,'Hotel de la Plaza','"Free tour" de Rome','avion','Lucas Martini',8,4.5,33,'Vous aimer manger?',399,6,6);


-- La table TRIP
INSERT INTO TRIP
VALUES (1,TO_TIMESTAMP('2026-05-02 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6')
,TO_TIMESTAMP('2026-05-07 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6')
,1);

INSERT INTO TRIP
VALUES (2,TO_TIMESTAMP('2026-06-03 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6')
,TO_TIMESTAMP('2026-06-05 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6'),2);

INSERT INTO TRIP
VALUES (3,TO_TIMESTAMP('2026-07-04 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6')
,TO_TIMESTAMP('2026-07-16 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6'),3);

INSERT INTO TRIP
VALUES (4,TO_TIMESTAMP('2026-08-05 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6')
,TO_TIMESTAMP('2026-08-12 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6'),4);

INSERT INTO TRIP
VALUES (5,TO_TIMESTAMP('2026-09-06 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6')
,TO_TIMESTAMP('2026-09-10 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6'),5);

INSERT INTO TRIP
VALUES (6,TO_TIMESTAMP('2026-10-07 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6')
,TO_TIMESTAMP('2026-10-15 14:23:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF6'),6);


--La table USERS (un seul USER)
INSERT INTO USERS
VALUES(1,'Utilisateur','Originel','Tester','test@email.com','$2b$10$ik6XKD2DMynj1gjcQKIOUe8Nl/DwHlMRDA5O3yOiX/f1xq7E6ycNi', Date '2026-05-02');


-- La table RESERVATION:
INSERT INTO RESERVATION
VALUES(1,1,DATE '2026-04-07',DATE '2026-05-02',DATE '2026-05-07',52,799,'Terminee',1,1,1);

INSERT INTO RESERVATION
VALUES(2,2,DATE '2026-05-07',DATE '2026-06-03',DATE '2026-06-05',23,599,'A debuter',1,2,2);

INSERT INTO RESERVATION
VALUES(3,3,DATE '2026-06-07',DATE '2026-07-04',DATE '2026-07-16',12,899,'A debuter',1,3,3);

INSERT INTO RESERVATION
VALUES(4,4,DATE '2026-07-07',DATE '2026-08-05',DATE '2026-08-12',78,1299,'A debuter',1,4,4);

INSERT INTO RESERVATION
VALUES(5,5,DATE '2026-08-07',DATE '2026-09-06',DATE '2026-09-10',13,2099,'A debuter',1,5,5);

INSERT INTO RESERVATION
VALUES(6,6,DATE '2026-09-07',DATE '2026-10-07',DATE '2026-10-15',6,399,'A debuter',1,6,6);


COMMIT;
