import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";

import uploadRoutes from "./routes/uploadRoutes";
import sessionRoutes from "./routes/sessionRoutes";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://kwadratuhan-photobooth.vercel.app",
];

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST"],
  })
);
app.use("/", uploadRoutes);
app.use("/", sessionRoutes);

app.use(express.json());

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
