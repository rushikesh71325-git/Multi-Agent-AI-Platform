import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";
import { initQdrantCollection } from "./config/qdrant.js";

const port = process.env.PORT;
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use("/public", express.static("public"));
app.use("/", router);

app.get("/", (req, res) => {
    res.json({ message: "Agent Service Is Running" });
});

app.listen(port, () => {
    console.log(`Agent Service Started On Port: ${port}`);
    connectDB();
    initQdrantCollection();
});