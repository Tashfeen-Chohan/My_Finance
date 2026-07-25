import { getOfflineDB } from "./idb-storage";

export function createIDBPersister() {
  return {
    persistClient: async (persistedClient) => {
      const db = await getOfflineDB();
      if (!db) return;
      try {
        await db.put("query_cache", {
          key: "REACT_QUERY_OFFLINE_CACHE",
          value: persistedClient,
          updatedAt: Date.now(),
        });
      } catch (err) {
        console.error("[QueryPersister] Error persisting client cache:", err);
      }
    },
    restoreClient: async () => {
      const db = await getOfflineDB();
      if (!db) return undefined;
      try {
        const record = await db.get("query_cache", "REACT_QUERY_OFFLINE_CACHE");
        return record ? record.value : undefined;
      } catch (err) {
        console.error("[QueryPersister] Error restoring client cache:", err);
        return undefined;
      }
    },
    removeClient: async () => {
      const db = await getOfflineDB();
      if (!db) return;
      try {
        await db.delete("query_cache", "REACT_QUERY_OFFLINE_CACHE");
      } catch (err) {
        console.error("[QueryPersister] Error removing client cache:", err);
      }
    },
  };
}
