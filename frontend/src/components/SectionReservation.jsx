import { useEffect, useState } from "react";
import CarteReservation from "./CarteReservation";
import { fetchReservationsForUser } from "../api/reservations.js";

const formatDate = (dateStr) => {
  if (dateStr == null || dateStr === "") return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function SectionReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");

      const raw = sessionStorage.getItem("travelExpressUser");
      const user = raw ? JSON.parse(raw) : null;
      const userId = user?.id_users;

      if (!userId) {
        setReservations([]);
        setError("connect");
        setLoading(false);
        return;
      }

      try {
        const res = await fetchReservationsForUser(userId);
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            data && data.error
              ? data.error
              : "Impossible de charger vos reservations.";
          throw new Error(msg);
        }

        if (!cancelled) {
          setReservations(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Erreur reseau.");
          setReservations([]);
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

  if (loading) {
    return (
      <section className="section-reservation">
        <h2 className="titre-section">Mes réservations</h2>
        <p className="sous-titre-reservations">Chargement...</p>
      </section>
    );
  }

  if (error === "connect") {
    return (
      <section className="section-reservation">
        <h2 className="titre-section">Mes réservations</h2>
        <p className="sous-titre-reservations">
          <a href="#login">Connectez-vous</a> pour voir vos reservations.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-reservation">
        <h2 className="titre-section">Mes réservations</h2>
        <p className="text-danger" role="alert">
          {error}
        </p>
      </section>
    );
  }

  if (!reservations.length) {
    return (
      <section className="section-reservation">
        <h2 className="titre-section">Mes réservations</h2>
        <p className="sous-titre-reservations">
          Aucune reservation pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section className="section-reservation">
      <h2 className="titre-section">Mes réservations</h2>
      <p className="sous-titre-reservations">
        Consultez l&apos;ensemble de vos réservations passées et à venir.
      </p>

      <div className="list-reservation">
        {reservations.map((rt) => (
          <CarteReservation
            key={rt.id}
            imageUrl={rt.imgUrl}
            imageAlt={`${rt.destination}, ${rt.country}`}
            ville={`${rt.destination}, ${rt.country}`}
            dates={`Du ${formatDate(rt.startDate)} au ${formatDate(rt.endDate)}`}
            voyageurs={`${rt.travelers} Voyageur${rt.travelers > 1 ? "s" : ""}`}
            statut={rt.status}
            prix={
              rt.price != null && rt.price !== ""
                ? `${Number(rt.price).toLocaleString("fr-CA")} CA$`
                : "—"
            }
          />
        ))}
      </div>
    </section>
  );
}
