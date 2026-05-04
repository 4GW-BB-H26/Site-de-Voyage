//Script pour data d'api sur frontend, sous format oracle
import { API_BASE } from "./client.js";


export async function fetchDetailsOffre(id) {
  const res = await fetch(`${API_BASE}/packages/${id}`);
  if (!res.ok) throw new Error("Ne peut pas changer details");
  return await res.json();
}
