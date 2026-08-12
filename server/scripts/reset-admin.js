import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Settings from "../schema/settings-schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const settings = await Settings.findOne({});
    if (!settings) {
        console.log("No settings found — nothing to reset.");
    } else {
        settings.adminUsername = "";
        settings.adminPasswordHash = "";
        await settings.save();
        console.log("Admin username/password cleared. Restart the app and the setup screen will appear again.");
    }
    await mongoose.disconnect();
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
