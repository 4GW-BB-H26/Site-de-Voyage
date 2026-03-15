import img_login from '/src/assets/img_login.jpg'
import "../styles/styles.css"
import React, { useState } from "react";

function Login(){
    const [info, setInfo] = useState({
        email: "",
        password: ""
    });
    

    return(
        <div className="row">
            
            <div className="col-6">
                <img src={img_login} alt="Image de lieu"></img>
            </div> 
             
            <div className="col-6">
                <div style={{textAlign: "center"}}>
                    <h1 className='Nom_Site'>TRAVEL EXPRESS</h1>
                    <p/>
                    <br/>

                    <input className='input_login' type='email' placeholder='Email'></input>
                    <p/>
                    <input className='input_login' type='password' placeholder='Mot de passe'></input>
                    <br/>
                    
                    <button className='forgotten-password-login'>Mot de passe oublié?</button>
                    <p/>

                    <button className='login-button'>SE CONNECTER</button>
                    <p/>

                    <button className='inscription-button-login'>S'INSCRIRE</button> 
                </div>
               

            </div>
                
        </div>
    );
    //ajouter la logic de traitement apres avoir fait le express
}

export default Login