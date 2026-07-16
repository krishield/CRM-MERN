import express from "express";
import dotenv from "dotenv";
import Connection from "./db.js";
import authRoutes from "./routes/auth-routes.js";
import customerRoutes from "./routes/customer-routes.js";
import orderRoutes from "./routes/order-routes.js";
import cors from 'cors'
import bodyParser from "body-parser";

dotenv.config();

const app = express()

app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

app.use('/', authRoutes);
app.use('/', customerRoutes);
app.use('/', orderRoutes);

const PORT = process.env.PORT || 8000;

Connection();

app.listen(PORT, () => console.log(`server running on ${PORT}`));
