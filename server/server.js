import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import quoteRoutes from "./routes/quotesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();
dotenv.config();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Routes
app.use("/api/quotes", quoteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

app.listen(process.env.APP_PORT);
console.log(`Listening on port ${process.env.APP_PORT}`);

export default app;
