import {
  dbGetMutationQueue,
  dbDequeueMutation,
  dbUpdateMutationRetry,
  putStoreItem,
  deleteStoreItem,
} from "./idb-storage";
import { apiClient } from "@/services/api-client";
import { useAppStore } from "@/stores/use-app-store";

let isProcessingQueue = false;

export async function processSyncQueue() {
  if (isProcessingQueue) {
    return { processed: 0, failed: 0, conflicts: 0 };
  }

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { processed: 0, failed: 0, conflicts: 0 };
  }

  const queue = await dbGetMutationQueue();
  if (queue.length === 0) {
    useAppStore.getState().setPendingSyncCount(0);
    useAppStore.getState().setSyncing(false);
    return { processed: 0, failed: 0, conflicts: 0 };
  }

  isProcessingQueue = true;
  useAppStore.getState().setSyncing(true);

  let processed = 0;
  let failed = 0;
  let conflicts = 0;

  for (const item of queue) {
    try {
      let response;
      const endpoint = item.endpoint || `/${item.entity}`;

      if (item.action === "CREATE") {
        response = await apiClient.post(endpoint, item.payload);
      } else if (item.action === "UPDATE") {
        response = await apiClient.put(`${endpoint}/${item.id}`, item.payload);
      } else if (item.action === "DELETE") {
        response = await apiClient.delete(`${endpoint}/${item.id}`);
      }

      if (response?.success) {
        await dbDequeueMutation(item.id);
        if (response.data && item.action !== "DELETE") {
          await putStoreItem(item.entity, response.data);
        } else if (item.action === "DELETE") {
          await deleteStoreItem(item.entity, item.id);
        }
        processed++;
      } else {
        const maxRetries = item.maxRetries || 3;
        if (item.retryCount + 1 >= maxRetries) {
          await dbDequeueMutation(item.id);
          conflicts++;
        } else {
          await dbUpdateMutationRetry(item.id, item.retryCount + 1, response?.error || "Sync error");
          failed++;
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Network error";
      await dbUpdateMutationRetry(item.id, item.retryCount + 1, msg);
      failed++;
    }
  }

  const remainingQueue = await dbGetMutationQueue();
  useAppStore.getState().setPendingSyncCount(remainingQueue.length);
  useAppStore.getState().setSyncing(false);
  isProcessingQueue = false;

  return { processed, failed, conflicts };
}

export function initializeSyncListeners() {
  if (typeof window === "undefined") return () => {};

  const handleOnline = () => {
    console.log("[SyncEngine] Online detected. Drain sync queue...");
    processSyncQueue();
  };

  window.addEventListener("online", handleOnline);

  if (navigator.onLine) {
    processSyncQueue();
  }

  return () => {
    window.removeEventListener("online", handleOnline);
  };
}

export const syncEngine = {
  processQueue: processSyncQueue,
  initializeListeners: initializeSyncListeners,
};

export const SyncEngine = syncEngine;
