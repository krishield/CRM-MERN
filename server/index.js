import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import Connection from "./db.js";
import authRoutes from "./routes/auth-routes.js";
import customerRoutes from "./routes/customer-routes.js";
import orderRoutes from "./routes/order-routes.js";
import settingsRoutes from "./routes/settings-routes.js";
import cors from 'cors'
import bodyParser from "body-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
    const jwtSecret = crypto.randomBytes(32).toString("hex");
    fs.writeFileSync(
        envPath,
        `MONGO_URI=mongodb://localhost:27017/crm\nJWT_SECRET=${jwtSecret}\n`
    );
}

dotenv.config({ path: envPath });

const app = express()

app.use(bodyParser.json({ extended: true, limit: '5mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))
app.use(cors());

app.use('/', authRoutes);
app.use('/', settingsRoutes);
app.use('/', orderRoutes);
app.use('/', customerRoutes);

const PORT = process.env.PORT || 8000;

Connection();

app.listen(PORT, () => console.log(`server running on ${PORT}`));
