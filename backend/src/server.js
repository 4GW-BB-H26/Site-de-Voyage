import "dotenv/config";
import app from "./app.js";
import { port } from "./config/config.js";
import { connectToMongo } from "./db/mongo.js";
//await connectToMongo(process.env.MONGODB_URI, process.env.MONGODB_DB_NAME);

app.listen(port, () => {
  console.log(`API demarree sur http://localhost:${port}`);
});
