import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import uploadRoutes from "./routes/uploadRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import http from "http";

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

// Mount at root so endpoints match exactly as defined in routers
app.use("/", uploadRoutes);
app.use("/", sessionRoutes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
