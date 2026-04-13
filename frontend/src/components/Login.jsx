import imgLogin from "../assets/img_login.jpg";
import "../styles/styles.css";
import { useState } from "react";
import { loginUser } from "../api/auth.js";

function Login() {
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!info.email.trim() || !info.password) {
      setError("Veuillez entrer votre courriel et votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({
        email: info.email,
        password: info.password,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success || !data.user) {
        setError(
          data.error ||
            data.message ||
            "Connexion impossible. Verifiez vos identifiants."
        );
        return;
      }

      sessionStorage.setItem("travelExpressUser", JSON.stringify(data.user));
      if (data.token) {
        sessionStorage.setItem("travelExpressToken", data.token);
      }
      setSuccess(`Bienvenue, ${data.user.first_name || data.user.username || "voyageur"} !`);
      setTimeout(() => {
        window.location.hash = "#/accueil";
      }, 1000);
      setInfo((prev) => ({ ...prev, password: "" }));
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
            {success ? (
              <p className="text-success small mb-2" role="status">
                {success}
              </p>
            ) : null}

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "CONNEXION..." : "SE CONNECTER"}
            </button>
            <p />

            <span className="inscription-button-login d-inline-block text-muted small">
              <a href="/#/inscription">S&apos;inscrire</a>
            </span>
            <p />
            <span className="small text-secondary">
              <a href="/#/PageAcceuil"/>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
