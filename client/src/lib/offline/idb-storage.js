import { openDB } from "idb";

const DB_NAME = "MyFinanceOfflineDB_v2";
const DB_VERSION = 1;

let dbPromise = null;

export function getOfflineDB() {
  if (typeof window === "undefined") return null;

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Sync queue store for offline mutations
        if (!db.objectStoreNames.contains("sync_queue")) {
          const queueStore = db.createObjectStore("sync_queue", { keyPath: "id" });
          queueStore.createIndex("by-entity", "entity");
          queueStore.createIndex("by-timestamp", "timestamp");
        }

        // Query cache store for TanStack Query persister
        if (!db.objectStoreNames.contains("query_cache")) {
          db.createObjectStore("query_cache", { keyPath: "key" });
        }

        // Default entity stores
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
      },
    });
  }

  return dbPromise;
}

// Generic Store Accessors
export async function getStoreAll(storeName) {
  const db = await getOfflineDB();
  if (!db) return [];
  try {
    if (!db.objectStoreNames.contains(storeName)) return [];
    return await db.getAll(storeName);
  } catch (error) {
    console.error(`[IDB] Failed to get all from ${storeName}:`, error);
    return [];
  }
}

export async function getStoreItem(storeName, id) {
  const db = await getOfflineDB();
  if (!db) return null;
  try {
    if (!db.objectStoreNames.contains(storeName)) return null;
    const item = await db.get(storeName, id);
    return item || null;
  } catch (error) {
    console.error(`[IDB] Failed to get item ${id} from ${storeName}:`, error);
    return null;
  }
}

export async function putStoreItem(storeName, item) {
  const db = await getOfflineDB();
  if (!db) return;
  try {
    if (!db.objectStoreNames.contains(storeName)) return;
    await db.put(storeName, item);
  } catch (error) {
    console.error(`[IDB] Failed to put item ${item.id} into ${storeName}:`, error);
  }
}

export async function deleteStoreItem(storeName, id) {
  const db = await getOfflineDB();
  if (!db) return;
  try {
    if (!db.objectStoreNames.contains(storeName)) return;
    await db.delete(storeName, id);
  } catch (error) {
    console.error(`[IDB] Failed to delete item ${id} from ${storeName}:`, error);
  }
}

export async function clearStore(storeName) {
  const db = await getOfflineDB();
  if (!db) return;
  try {
    if (!db.objectStoreNames.contains(storeName)) return;
    await db.clear(storeName);
  } catch (error) {
    console.error(`[IDB] Failed to clear store ${storeName}:`, error);
  }
}

// Sync Queue Accessors
export async function dbEnqueueMutation(item) {
  const db = await getOfflineDB();
  if (!db) return;
  await db.put("sync_queue", item);
}

export async function dbGetMutationQueue() {
  const db = await getOfflineDB();
  if (!db) return [];
  try {
    const queue = await db.getAll("sync_queue");
    return queue.sort((a, b) => a.timestamp - b.timestamp);
  } catch {
    return [];
  }
}

export async function dbDequeueMutation(id) {
  const db = await getOfflineDB();
  if (!db) return;
  await db.delete("sync_queue", id);
}

export async function dbUpdateMutationRetry(id, retryCount, lastError) {
  const db = await getOfflineDB();
  if (!db) return;
  const item = await db.get("sync_queue", id);
  if (item) {
    item.retryCount = retryCount;
    if (lastError) item.lastError = lastError;
    await db.put("sync_queue", item);
  }
}
