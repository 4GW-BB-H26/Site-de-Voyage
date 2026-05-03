import { API_BASE } from "./client.js";


export async function fetchDetailsOffre(Id) {
const res = await fetch(`${API_BASE}/packages/${id}`);
if (!res.ok) throw new Error("Ne peut pas changer details");
return await res.json();
}
