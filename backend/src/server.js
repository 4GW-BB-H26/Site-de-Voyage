import "dotenv/config";
import app from "./app.js";
import { port } from "./config/config.js";

app.listen(port, () => {
  console.log(`API demarree sur http://localhost:${port}`);
});
