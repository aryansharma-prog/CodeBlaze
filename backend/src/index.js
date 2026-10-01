require('dotenv').config();
const express = require('express');
const app = express();

const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require("./config/redisClient");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const videoRouter = require("./routes/videoCreator");
const aiRouter = require("./routes/aiChatting");
const assessmentRouter = require("./routes/assessmentRoutes");
const cors = require("cors");

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:3000",
    "https://code-blaze-two.vercel.app",
    "https://code-blaze-git-main-aryansharma-progs-projects.vercel.app",
    "https://code-blaze.vercel.app",
    "https://codeblaze.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1")
        ) {
            return callback(null, origin);
        }
        return callback(null, origin);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Root health check endpoint for Render & browser verification
app.get('/', (req, res) => {
    res.status(200).send("CodeBlaze Backend is running");
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "CodeBlaze Backend",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Register Core Routers
app.use("/user", authRouter);
app.use("/auth", authRouter);
app.use("/problem", problemRouter);
app.use("/problems", problemRouter);
app.use("/submission", submitRouter);
app.use("/submissions", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/assessment", assessmentRouter);
app.use("/recommendations", assessmentRouter); // Alias for direct access
app.use("/progress", assessmentRouter); // Alias for direct access

const initializeConnection = async () => {
    try {
        await main(process.env.DB_CONNECT_STRING);
        console.log("✅ MongoDB Connected");

        // Attempt Redis connection without blocking startup on failure
        try {
            if (!redisClient.isOpen) {
                await redisClient.connect();
                console.log("✅ Redis Connected");
            }
        } catch (redisErr) {
            console.warn("⚠️ Redis connection failed, running with in-memory fallbacks:", redisErr.message);
        }

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`🚀 CodeBlaze Backend running on port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Startup Error:", err);
    }
};

initializeConnection();
