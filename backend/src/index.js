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
const cors = require("cors");
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:3000",
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

app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);

const initializeConnection = async () => {
    try {
        await Promise.all([
            main(process.env.DB_CONNECT_STRING),
            redisClient.connect()
        ]);

        console.log("✅ MongoDB + Redis Connected");

        app.listen(process.env.PORT || 4000, () => {
            console.log(`🚀 Server running on port ${process.env.PORT || 4000}`);
        });

    } catch (err) {
        console.error("❌ Startup Error:", err);
    }
};

initializeConnection();