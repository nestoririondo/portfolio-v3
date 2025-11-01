import fs from "fs";
import path from "path";

const LOCK_FILE = path.join(process.cwd(), ".blog-generation-lock");

export function createLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE, "utf8"));
      const lockAge = Date.now() - lockData.timestamp;

      // If lock is older than 10 minutes, consider it stale and remove it
      if (lockAge > 10 * 60 * 1000) {
        console.log("⚠️ Removing stale lock file (older than 10 minutes)");
        fs.unlinkSync(LOCK_FILE);
      } else {
        console.log(
          `🔒 Another blog generation is already running (started ${Math.round(
            lockAge / 1000
          )}s ago)`
        );
        console.log("🚫 Exiting to prevent duplicate posts");
        return false;
      }
    }

    // Create lock file
    fs.writeFileSync(
      LOCK_FILE,
      JSON.stringify({
        timestamp: Date.now(),
        pid: process.pid,
        topic: process.env.FORCE_TOPIC || "random",
      })
    );

    console.log("🔒 Blog generation lock created");
    return true;
  } catch (error) {
    console.error("❌ Error creating lock:", error);
    return false;
  }
}

export function removeLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE);
      console.log("🔓 Blog generation lock removed");
    }
  } catch (error) {
    console.error("❌ Error removing lock:", error);
  }
}

// Cleanup on exit
process.on("exit", removeLock);
process.on("SIGINT", () => {
  removeLock();
  process.exit();
});
process.on("SIGTERM", () => {
  removeLock();
  process.exit();
});
