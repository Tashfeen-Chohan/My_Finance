import { dbGetSyncQueue, dbRemoveFromSyncQueue } from "@/db/idb";
import { apiClient } from "./api-client";
import { useAppStore } from "@/stores/use-app-store";

export async function processSyncQueue() {
  const queue = await dbGetSyncQueue();
  if (queue.length === 0) {
    useAppStore.getState().setPendingSyncCount(0);
    return { processed: 0, errors: 0 };
  }

  useAppStore.getState().setSyncing(true);
  let processed = 0;
  let errors = 0;

  for (const item of queue) {
    try {
      let response;
      if (item.action === "CREATE") {
        response = await apiClient.post(`/${item.entity}s`, item.payload);
      } else if (item.action === "UPDATE") {
        response = await apiClient.put(`/${item.entity}s/${item.id}`, item.payload);
      } else if (item.action === "DELETE") {
        response = await apiClient.delete(`/${item.entity}s/${item.id}`);
      }

      if (response?.success) {
        await dbRemoveFromSyncQueue(item.id);
        processed++;
      } else {
        errors++;
      }
    } catch {
      errors++;
    }
  }

  const remainingQueue = await dbGetSyncQueue();
  useAppStore.getState().setPendingSyncCount(remainingQueue.length);
  useAppStore.getState().setSyncing(false);

  return { processed, errors };
}

export const syncService = {
  processSyncQueue,
};
