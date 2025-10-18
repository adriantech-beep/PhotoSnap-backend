"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const io_1 = require("./socket/io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "https://photo-snap-e2xx.vercel.app",
    "https://photo-snap-e2xx-git-main-adriantech-beeps-projects.vercel.app",
    "https://photo-snap-e2xx-668otdvdt-adriantech-beeps-projects.vercel.app",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("CORS not allowed"));
        }
    },
    methods: ["GET", "POST"],
}));
app.use(express_1.default.json());
app.use("/", sessionRoutes_1.default);
(0, io_1.initSocket)(server);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✅ Backend running on port ${PORT}`);
});
