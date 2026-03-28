import { useEffect, useState } from "react";
import PageAccueil from "./pages/PageAccueil";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ReservationPage from "./pages/ReservationPage";

/** Fragments reconnus (saisie manuelle dans la barre d’adresse du navigateur). */
const PAGES = new Set(["accueil", "login", "inscription", "reservations"]);

function readHashPage() {
  const raw = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  if (!raw || raw === "") return "accueil";
  return PAGES.has(raw) ? raw : "accueil";
}

function App() {
  const [page, setPage] = useState(readHashPage);

  useEffect(() => {
    const onHash = () => setPage(readHashPage());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  switch (page) {
    case "login":
      return <LoginPage />;
    case "inscription":
      return <RegisterPage />;
    case "reservations":
      return <ReservationPage />;
    default:
      return <PageAccueil />;
  }
}

export default App;

