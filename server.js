import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.join(__dirname, "frontend", "dist");



import highscoreRoutes from "./backend/Routes/highscoreRoutes.js";
import gameRoutes from "./backend/Routes/gameRoutes.js";
import pageRoutes from "./backend/Routes/pageRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", highscoreRoutes);
app.use("/api", gameRoutes);
app.use("/", pageRoutes);

app.use(express.static(frontendDistPath));

app.get("/", (req, res) => {
  res.send("Server is running");
});


app.get("/", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB with Mongoose");
    } else {
      console.log("No MongoDB connection string provided");
    }

    app.listen(process.env.PORT || 5080, () => {
      console.log("Server running on port 5080");
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

startServer();