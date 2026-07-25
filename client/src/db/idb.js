import { openDB } from "idb";

const DB_NAME = "MyFinanceOfflineDB";
const DB_VERSION = 1;

let dbPromise = null;

export function getDB() {
  if (typeof window === "undefined") return null;

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("vehicles")) {
          db.createObjectStore("vehicles", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("fuel_expenses")) {
          const fuelStore = db.createObjectStore("fuel_expenses", { keyPath: "id" });
          fuelStore.createIndex("by-vehicle", "vehicleId");
        }
        if (!db.objectStoreNames.contains("maintenance")) {
          const maintStore = db.createObjectStore("maintenance", { keyPath: "id" });
          maintStore.createIndex("by-vehicle", "vehicleId");
        }
        if (!db.objectStoreNames.contains("sync_queue")) {
          db.createObjectStore("sync_queue", { keyPath: "id" });
        }
      },
    });
  }

  return dbPromise;
}

export async function dbGetAll(storeName) {
  const db = await getDB();
  if (!db) return [];
  return await db.getAll(storeName);
}

export async function dbPut(storeName, item) {
  const db = await getDB();
  if (!db) return;
  await db.put(storeName, item);
}

export async function dbDelete(storeName, id) {
  const db = await getDB();
  if (!db) return;
  await db.delete(storeName, id);
}

export async function dbAddToSyncQueue(item) {
  const db = await getDB();
  if (!db) return;
  await db.put("sync_queue", item);
}

export async function dbGetSyncQueue() {
  const db = await getDB();
  if (!db) return [];
  return await db.getAll("sync_queue");
}

export async function dbRemoveFromSyncQueue(id) {
  const db = await getDB();
  if (!db) return;
  await db.delete("sync_queue", id);
}
