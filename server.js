import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import highscoreRoutes from "./backend/Routes/highscoreRoutes.js";
import gameRoutes from "./backend/Routes/gameRoutes.js";
import pageRoutes from "./backend/Routes/pageRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", highscoreRoutes);
app.use("/api", gameRoutes);
app.use("/", pageRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});




async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB with Mongoose");

    app.listen(process.env.PORT || 5080, () => {
      console.log("Server running on port 5080");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

startServer();