import express from "express";
import { createClient } from "redis";

const app = express();

const port = process.env.PORT || 3000;
const redisUrl = process.env.REDIS_URL || "redis://redis:6379";
const appMessage = process.env.APP_MESSAGE || "APP_MESSAGE is not set";

const redis = createClient({ url: redisUrl });

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

await redis.connect();

app.get("/", async (req, res) => {
  const count = await redis.incr("page_hits");

  res.type("html").send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Coolify Compose Test</title>
      </head>
      <body>
        <h1>Hello from Docker Compose on Coolify</h1>
        <p><strong>APP_MESSAGE:</strong> ${appMessage}</p>
        <p><strong>Redis URL:</strong> ${redisUrl}</p>
        <p><strong>Page hits stored in Redis:</strong> ${count}</p>
      </body>
    </html>
  `);
});

app.get("/health", async (req, res) => {
  await redis.ping();
  res.json({ ok: true });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Web app listening on port ${port}`);
});
