import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import sessionRoutes from "./routes/sessionRoutes";
import { initSocket } from "./socket/io";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5176",
  "https://photo-snap-e2xx.vercel.app",
  "https://photo-snap-e2xx-git-main-adriantech-beeps-projects.vercel.app",
  "https://photo-snap-e2xx-668otdvdt-adriantech-beeps-projects.vercel.app",
];

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
app.use(express.json());

app.use("/", sessionRoutes);

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
