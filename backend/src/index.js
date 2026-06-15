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
const cors = require('cors');

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://code-blaze-ips0grm0y-aryansharma-progs-projects.vercel.app"
  ],
  credentials: true
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