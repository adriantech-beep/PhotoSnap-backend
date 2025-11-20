"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "https://kwadratuhan-photobooth.vercel.app",
];
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
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
app.use("/upload-images", uploadRoutes_1.default);
app.use("/", sessionRoutes_1.default);
app.use(express_1.default.json());
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`✅ Backend running on port ${PORT}`);
});
