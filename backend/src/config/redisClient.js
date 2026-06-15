const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_CONNECTION,
  socket: {
    tls: true
  }
});

client.on("error", (err) => console.log("❌ Redis Error:", err));
client.on("ready", () => console.log("✅ Redis Ready"));

module.exports = client;