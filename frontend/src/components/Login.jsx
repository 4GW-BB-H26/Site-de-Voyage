import imgLogin from "../assets/img_login.jpg";
import "../styles/styles.css";
import React, { useState } from "react";
import { API_BASE } from "../config/api.js";

function Login() {
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!info.email.trim() || !info.password) {
      setError("Veuillez entrer votre courriel et votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const qs = new URLSearchParams({
        email: info.email.trim(),
        password: info.password,
      });
      const res = await fetch(`${API_BASE}/user?${qs.toString()}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success || !data.user) {
        setError(data.message || "Connexion impossible. Verifiez vos identifiants.");
        return;
      }

      sessionStorage.setItem("travelExpressUser", JSON.stringify(data.user));
      window.location.hash = "#accueil";
    } catch {
      setError("Impossible de joindre le serveur. Verifiez que l'API est demarree.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-6">
        <img src={imgLogin} alt="Paysage de voyage" />
      </div>

      <div className="col-6">
        <div style={{ textAlign: "center" }}>
          <h1 className="Nom_Site">TRAVEL EXPRESS</h1>
          <p />
          <br />

          <form onSubmit={handleSubmit}>
            <input
              className="input_login"
              type="email"
              name="email"
              placeholder="Email"
              value={info.email}
              onChange={handleChange}
              autoComplete="username"
            />
            <p />
            <input
              className="input_login"
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={info.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <br />

            <button type="button" className="forgotten-password-login">
              Mot de passe oublié?
            </button>
            <p />

            {error ? (
              <p className="text-danger small mb-2" role="alert">
                {error}
              </p>
            ) : null}

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "CONNEXION..." : "SE CONNECTER"}
            </button>
            <p />

            <a className="inscription-button-login d-inline-block" href="#inscription">
              S&apos;INSCRIRE
            </a>
            <p />
            <a href="#accueil" className="small text-secondary">
              Retour à l&apos;accueil
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
