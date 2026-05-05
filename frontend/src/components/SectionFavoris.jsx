import { useState, useEffect } from "react";
import CarteFavori from "./CarteFavoris.jsx";
import { fetchFavorisByUser, removeFavoris } from "../api/favoris.js";

export default function SectionFavoris() {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");

      const raw = sessionStorage.getItem("travelExpressUser");
      let user = null;
      if (raw) {
        try {
          user = JSON.parse(raw);
        } catch {
          sessionStorage.removeItem("travelExpressUser");
        }
      }
      const userId = user?.id_users;

      if (!userId) {
        setFavoris([]);
        setError("connect");
        setLoading(false);
        return;
      }

      try {
        const res = await fetchFavorisByUser(userId);
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            data && data.error
              ? data.error
              : "Impossible de charger vos favoris.";
          throw new Error(msg);
        }

        if (!cancelled) {
          setFavoris(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Erreur réseau.");
          setFavoris([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetirer = async (mongoId) => {
    try {
      const res = await removeFavoris(String(mongoId));
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data && typeof data.error === "string" ? data.error : "Impossible de retirer le favori.");
        return;
      }
      setFavoris((prev) => prev.filter((f) => String(f._id) !== String(mongoId)));
    } catch {
      alert("Erreur réseau.");
    }
  };

  if (loading) {
    return (
      <section className="section-favoris">
        <h2 className="titre-section">Mes favoris</h2>
        <p className="sous-titre-reservations">Chargement...</p>
      </section>
    );
  }

  if (error === "connect") {
    return (
      <section className="section-favoris">
        <h2 className="titre-section">Mes favoris</h2>
        <label className="sous-titre-reservations">
          Pour voir vos favoris,
          <a className="lien-connexion"href="/#/login" >Connectez-vous!</a>.
        </label>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-favoris">
        <h2 className="titre-section">Mes favoris</h2>
        <p className="text-danger" role="alert">
          {error}
        </p>
      </section>
    );
  }

  if (!favoris.length) {
    return (
      <section className="section-favoris">
        <h2 className="titre-section">Mes favoris</h2>
        <p className="sous-titre-reservations">
          Vous n'avez aucun favori pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section className="section-favoris">
      <h2 className="titre-section">Mes favoris</h2>
      <p className="sous-titre-reservations">
        Consultez l'ensemble de vos destinations favorites.
      </p>

      <div className="liste-favoris">
        {favoris.map((f) => (
          <CarteFavori
            key={f._id}
            id={f._id}
            nomDestination={f.nomDestination}
            dateAjout={f.dateAjout}
            onRetirer={handleRetirer}
          />
        ))}
      </div>
    </section>
  );
}
