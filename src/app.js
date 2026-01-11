// Central place for middleware + routes:
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cors from "cors";

const app = express();

// middleware
app.use(express.json()); // parse JSON

// fixing CORS error on frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes
app.get("/health", (req, res) => {
  res.send("Good");
});

app.use("/api/auth", authRoutes);
app.use("/api", blogRoutes);
app.use("/api", adminRoutes);

export default app;
