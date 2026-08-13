import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Old data lives in a different database on the same mongod instance.
// Override with OLD_MONGO_URI env var if it's not called "admin".
const OLD_MONGO_URI = process.env.OLD_MONGO_URI || "mongodb://localhost:27017/admin";
const NEW_MONGO_URI = process.env.MONGO_URI;
const ID_PREFIX = "SSC";

const VALID_STATUSES = ["pending", "checked", "completed", "repaired", "not-repaired"];

const run = async () => {
    if (!NEW_MONGO_URI) {
        console.error("MONGO_URI not found in server/.env — aborting.");
        process.exit(1);
    }

    const oldConn = await mongoose.createConnection(OLD_MONGO_URI).asPromise();
    const newConn = await mongoose.createConnection(NEW_MONGO_URI).asPromise();

    const oldCustomers = await oldConn.collection("customers").find({}).sort({ _id: 1 }).toArray();
    console.log(`Found ${oldCustomers.length} old customer records in ${OLD_MONGO_URI}`);

    if (oldCustomers.length === 0) {
        console.log("Nothing to migrate.");
        await oldConn.close();
        await newConn.close();
        return;
    }

    const newCustomersCollection = newConn.collection("customers");
    const existingCount = await newCustomersCollection.countDocuments();
    if (existingCount > 0) {
        console.error(
            `crm.customers already has ${existingCount} document(s). Aborting to avoid duplicates.\n` +
            `If you want to re-run this migration, clear crm.customers first (in Compass or mongosh).`
        );
        await oldConn.close();
        await newConn.close();
        process.exit(1);
    }

    const migrated = oldCustomers.map((doc, index) => {
        const seq = index + 1;
        const time2 = doc.time2 ? String(doc.time2).trim() : "";
        const status = VALID_STATUSES.includes(doc.status) ? doc.status : "pending";
        const cost = Number(doc.cost);

        return {
            customerId: `${ID_PREFIX}${String(seq).padStart(3, "0")}`,
            device: doc.device || "",
            brand: doc.brand || "",
            name: doc.name || "",
            mobile: doc.mobile || "",
            problem: doc.problem || "",
            cost: Number.isFinite(cost) ? cost : 0,
            note: doc.note || "",
            date: doc.date || "",
            time: doc.time || "",
            status,
            time2,
            delivered: time2.length > 0,
        };
    });

    await newCustomersCollection.insertMany(migrated);
    console.log(`Inserted ${migrated.length} customers into crm.customers.`);

    const deliveredCount = migrated.filter((c) => c.delivered).length;
    console.log(`  delivered=true (has time2):  ${deliveredCount}`);
    console.log(`  delivered=false (no time2):  ${migrated.length - deliveredCount}`);

    await newConn.collection("counters").updateOne(
        { name: "customer" },
        { $set: { seq: migrated.length } },
        { upsert: true }
    );
    console.log(`Counter set to ${migrated.length} — next new customer will be ${ID_PREFIX}${String(migrated.length + 1).padStart(3, "0")}.`);

    await newConn.collection("settings").updateOne(
        {},
        { $set: { idPrefix: ID_PREFIX } },
        { upsert: true }
    );
    console.log(`Settings idPrefix set to "${ID_PREFIX}" — new customers created in the app will also use this prefix.`);

    await oldConn.close();
    await newConn.close();
    console.log("Done.");
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
