"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
// Middleware
app.use((0, cors_1.default)({
    origin: [CLIENT_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/auth", authRoutes_1.default);
// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        dbConnected: mongoose_1.default.connection.readyState === 1,
    });
});
// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/my_finance";
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("Connected to MongoDB Database");
})
    .catch((err) => {
    console.warn("MongoDB Connection Warning (Running with in-memory auth mode):", err.message);
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [http://localhost:${PORT}]`);
});
