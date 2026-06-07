import Redis from "ioredis";

export const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  retryStrategy: () => {
    console.warn("⚠️ Redis not running locally! AI caching will be bypassed.");
    return null; // Stop retrying
  }
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.log("❌ Redis Error:", err.message);
});