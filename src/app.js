import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import sessionsRouter from "./routes/sessions.router.js"; 
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import { connectDB } from "./config/db.config.js";
import "dotenv/config";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Conexión a MongoDB
connectDB();

// Rutas
app.use("/api/sessions", sessionsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

// Iniciar servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});