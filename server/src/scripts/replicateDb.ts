import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import mongoose from "mongoose";

const MongoClient = mongoose.mongo.MongoClient;

async function replicateAtlasToLocal() {
  const sourceUri = process.env.MONGO_URI_PROD;
  let targetUri = process.env.MONGO_URI_DEV || "mongodb://127.0.0.1:27017/my_finance";

  if (!sourceUri) {
    console.error("❌ ERROR: MONGO_URI_PROD is not defined in server/.env");
    process.exit(1);
  }

  // Replace localhost with 127.0.0.1 for local connection reliability
  targetUri = targetUri.replace("localhost", "127.0.0.1");

  console.log("🚀 Starting MongoDB Replication: Atlas (Production) ➔ Local (Compass)");
  console.log(`🔹 Source (Atlas): ${sourceUri.replace(/:([^@]+)@/, ":****@")}`);
  console.log(`🔹 Target (Local): ${targetUri}\n`);

  const sourceClient = new MongoClient(sourceUri);
  const targetClient = new MongoClient(targetUri);

  try {
    console.log("⏳ Connecting to source (Atlas) database...");
    await sourceClient.connect();
    console.log("✅ Connected to source database.");

    console.log("⏳ Connecting to target (Local) database...");
    await targetClient.connect();
    console.log("✅ Connected to target database.");

    const sourceDb = sourceClient.db();
    const targetDb = targetClient.db();

    const collections = await sourceDb.listCollections().toArray();
    const collectionNames = collections
      .map((c) => c.name)
      .filter((name) => !name.startsWith("system."));

    if (collectionNames.length === 0) {
      console.log("⚠️ No collections found in source database.");
      return;
    }

    console.log(`\n📦 Found ${collectionNames.length} collections: ${collectionNames.join(", ")}\n`);

    for (const name of collectionNames) {
      const sourceCol = sourceDb.collection(name);
      const targetCol = targetDb.collection(name);

      const docs = await sourceCol.find({}).toArray();
      const docCount = docs.length;

      console.log(`🔄 Processing collection: "${name}" (${docCount} documents)`);

      // Clear existing local data in this collection
      await targetCol.deleteMany({});

      if (docCount > 0) {
        await targetCol.insertMany(docs);
        console.log(`   ✓ Copied ${docCount} documents to local collection "${name}"`);
      } else {
        console.log(`   ℹ Collection "${name}" is empty. Cleared local collection.`);
      }

      // Copy indexes (excluding default _id_ index)
      const rawIndexes = await sourceCol.indexes();
      const indexesToCreate = rawIndexes
        .filter((idx) => idx.name !== "_id_")
        .map((idx) => {
          const { key, name, v, ns, ...options } = idx;
          return { key, name, ...options };
        });

      if (indexesToCreate.length > 0) {
        try {
          await targetCol.createIndexes(indexesToCreate);
          console.log(`   ✓ Replicated ${indexesToCreate.length} index(es) for "${name}"`);
        } catch (idxErr) {
          console.warn(`   ⚠️ Warning replicating indexes for "${name}":`, (idxErr as Error).message);
        }
      }
      console.log("");
    }

    console.log("🎉 DB REPLICATION COMPLETED SUCCESSFULLY!");
    console.log("Your local MongoDB (MongoDB Compass) now contains a fresh copy of your MongoDB Atlas data.");
  } catch (error) {
    console.error("❌ DB Replication failed:", error);
    process.exitCode = 1;
  } finally {
    await sourceClient.close();
    await targetClient.close();
    console.log("🔌 Connections closed cleanly.");
  }
}

replicateAtlasToLocal();
