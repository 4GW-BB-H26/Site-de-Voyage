import "dotenv/config";
import app from "./app.js";
import { port } from "./config/config.js";
//import { connectToMongo } from "./src/db/mongo.js";
//attendre quon figrue out mongo avant denlever le commentaire 
//await connectToMongo(process.env.MONGODB_URI, process.env.MONGODB_DB_NAME);

app.listen(port, () => {
  console.log(`API demarree sur http://localhost:${port}`);
});
