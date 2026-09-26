// server.js (entry)
import express from "express";
import regAuthRoutes from './routes/regAuth.routes.js';

const app = express();
app.use(express.json()); // ⚠️ required so req.body is populated
app.use("/api/regauth", regAuthRoutes);
app.listen(3000, () => console.log("Server on 3000"));