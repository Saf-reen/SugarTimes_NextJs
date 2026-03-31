import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import magazineRoutes from "./routes/magazineRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use("/magazines", magazineRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/markets", marketRoutes);
app.use("/admin", adminRoutes);
app.use("/payments", paymentRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "Sugartimes API running" }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
});
