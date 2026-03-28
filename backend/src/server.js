import "dotenv/config";
import app from "./middleware/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API demarree sur http://localhost:${PORT}`);
});
