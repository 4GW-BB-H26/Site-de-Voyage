//API pour la table USERS 
//Ce script a ete inspiree du fichier Revision mysql avec nodejs fourni pas m.Rim Mseddi 

import express from "express";
import oracledb from "oracledb";
import dbConfig from "./dbconfig.js";

const router = express.Router(); 

//GET on prend une donnee
router.get("/user", async (req, res) => {
    let connection; // pour qu'on puisse le fermer vers la fin
    try{
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT * FROM USERS
            WHERE EMAIL = :email AND PASSWORD = :password`, 
            {  
                email: req.query.email,
                password: req.query.password
            }
        );
        console.log(result); //verification du resultat;
        res.json(result.rows);

    }catch (err) {
        console.error("erreur dans le GET: ", err);
        res.send(err.message);

    }finally{
        if(connection){
            await connection.close();
        }
    }
});

//post / create
router.post("/users", express.json(), async(req, res) => {
    let connection;
    try{
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `INSERT INTO USERS (ID_USERS, FIRST_NAME, LAST_NAME, USERNAME, EMAIL, PASSWORD, CREATION_DATE)
            VALUES (1, :first_name, :last_name, :username, :email, :password, SYSDATE)`,
            // l'ID par defaut de 1 est a changer plus tard pour un id qui fait +1 a chaque nouvelle donnees 
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
            }
        );
        await connection.commit();
        console.log("creation du compte reussi!");
        res.json(result.rowsAffected);

    }catch (err){
        console.error("Erreur dans le POST: ",err);
        res.send(err.message);

    }finally{
        if(connection){
            await connection.close();
        }
    }
});

//put / update 
router.put("/users/:id", express.json(), async(req, res) => {
    let connection;
    try{
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `UPDATE USERS
            SET FIRST_NAME = :first_name, LAST_NAME = :last_name, USERNAME = :username, EMAIL = :email, PASSWORD = :password
            WHERE ID_USERS = :id`,
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                id: req.params.id,
            }
        );
        await connection.commit();
        console.log("MAJ de l'utilisateur");
        res.json(result.rowsAffected);

    }catch(err){
        console.error("erreur dans le PUT: ", err);
        res.send(err.message);

    }finally{
        if(connection){
            await connection.close();
        }
    }
});

//DELETE on efface un compte
router.delete("/users/:id", async (req, res)=>{
    let connection;
    try{
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `DELETE FROM USERS WHERE ID_USERS = :id`,
            {
                id: req.params.id,
            }
        );
        await connection.commit();
        console.log("utilisateur supprimer")
        res.json(result.rowsAffected);

    }catch(err){
        console.error("Erreur d'effacement dans le DELETE ", err);
        res.send(err.message);

    }finally{
        if(connection){
            await connection.close();
        }
    }
});

//no clue how to test it 
