import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import magazineRoutes from "./routes/magazineRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import advertisementRoutes from "./routes/advertisementRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();
app.set("trust proxy", true);

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
const __dirname = path.resolve();
// Archive fallback: Check the archive folder under the same path prefix
app.use("/uploads/articles", express.static(path.join(__dirname, "uploads", "articles", "archive")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use("/magazines", magazineRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/markets", marketRoutes);
app.use("/admin", adminRoutes);
app.use("/payments", paymentRoutes);
app.use("/contact", contactRoutes);
app.use("/videos", videoRoutes);
app.use("/uploads-api", uploadRoutes);
app.use("/advertisements", advertisementRoutes);
app.use("/categories", categoryRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "Sugartimes API running" }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Handle EADDRINUSE gracefully. Without this, a stale server holding the port
// causes nodemon to crash-loop with an ugly stack trace and keep restarting
// every time a file changes, which is what produced the repeated crash dump.
const startServer = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () =>
    console.log(`Server running on port ${port}`)
  );
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `\n✖ Port ${port} is already in use by another process.\n` +
        `  On Windows, run the following in PowerShell to find and stop it:\n` +
        `    Get-NetTCPConnection -LocalPort ${port} | Select OwningProcess\n` +
        `    Stop-Process -Id <pid> -Force\n` +
        `  Or set a different port in .env (PORT=5001) and restart.\n`
      );
    } else {
      console.error("Server error:", err);
    }
    process.exit(1);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
