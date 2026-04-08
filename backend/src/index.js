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
const cors = require('cors')

// console.log("Hello")

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}))
app.use(express.json());
app.use(cookieParser());

// app.get('/', (req, res) => {
//   res.send('Backend is running 🚀');
// });
app.use("/user", authRouter);
app.use("/problem",problemRouter);
app.use("/submission",submitRouter);
app.use("/ai",aiRouter);
app.use("/video",videoRouter);

const initializeConnection = async () => {
  try {
    await Promise.all([
      main(),                 // MongoDB
      redisClient.connect()   // Redis
    ]);

    console.log("✅ DB + Redis Connected");

    app.listen(process.env.PORT, () => {
      console.log("🚀 Server running on port: " + process.env.PORT);
    });

  } catch (err) {
    console.log("❌ Error: " + err);
  }
};

initializeConnection();