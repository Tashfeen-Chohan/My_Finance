import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface SyncQueueItem {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: "vehicle" | "fuel_expense" | "maintenance";
  payload: Record<string, unknown>;
  timestamp: number;
}

interface MyFinanceDBSchema extends DBSchema {
  vehicles: {
    key: string;
    value: {
      id: string;
      name: string;
      model?: string;
      year?: number;
      licensePlate?: string;
      updatedAt: string;
    };
  };
  fuel_expenses: {
    key: string;
    value: {
      id: string;
      vehicleId: string;
      date: string;
      liters: number;
      pricePerLiter: number;
      totalCost: number;
      odometer: number;
      updatedAt: string;
    };
    indexes: { "by-vehicle": string };
  };
  maintenance: {
    key: string;
    value: {
      id: string;
      vehicleId: string;
      date: string;
      serviceType: string;
      cost: number;
      odometer: number;
      updatedAt: string;
    };
    indexes: { "by-vehicle": string };
  };
  sync_queue: {
    key: string;
    value: SyncQueueItem;
  };
}

const DB_NAME = "MyFinanceOfflineDB";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MyFinanceDBSchema>> | null = null;

export function getDB() {
  if (typeof window === "undefined") return null;

  if (!dbPromise) {
    dbPromise = openDB<MyFinanceDBSchema>(DB_NAME, DB_VERSION, {
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

export async function dbGetAll<T>(
  storeName: "vehicles" | "fuel_expenses" | "maintenance"
): Promise<T[]> {
  const db = await getDB();
  if (!db) return [];
  return (await db.getAll(storeName)) as unknown as T[];
}

export async function dbPut<T extends { id: string }>(
  storeName: "vehicles" | "fuel_expenses" | "maintenance",
  item: T
): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put(storeName, item as unknown as MyFinanceDBSchema[typeof storeName]["value"]);
}

export async function dbDelete(
  storeName: "vehicles" | "fuel_expenses" | "maintenance",
  id: string
): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete(storeName, id);
}

export async function dbAddToSyncQueue(item: SyncQueueItem): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put("sync_queue", item);
}

export async function dbGetSyncQueue(): Promise<SyncQueueItem[]> {
  const db = await getDB();
  if (!db) return [];
  return await db.getAll("sync_queue");
}

export async function dbRemoveFromSyncQueue(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete("sync_queue", id);
}
