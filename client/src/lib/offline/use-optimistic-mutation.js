import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dbEnqueueMutation, putStoreItem, deleteStoreItem } from "./idb-storage";
import { SyncEngine } from "./sync-engine";
import { useAppStore } from "@/stores/use-auth-store"; // or use-app-store if created
import { apiClient } from "@/services/api-client";

export function useOptimisticMutation({
  queryKey,
  entity,
  endpoint,
  action,
  conflictStrategy = "last-write-wins",
  onMutateCustom,
  onSuccess,
  onError,
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

      if (!isOnline) {
        // Enqueue mutation to IndexedDB sync queue when offline
        await dbEnqueueMutation({
          id: variables.id,
          action,
          entity,
          endpoint,
          payload: variables,
          timestamp: Date.now(),
          retryCount: 0,
          conflictStrategy,
        });

        // Save locally to IndexedDB store immediately
        if (action === "DELETE") {
          await deleteStoreItem(entity, variables.id);
        } else {
          await putStoreItem(entity, variables);
        }

        const remainingQueue = await dbGetMutationQueueCount();
        if (useAppStore.getState().setPendingSyncCount) {
          useAppStore.getState().setPendingSyncCount(remainingQueue);
        }

        return variables;
      }

      // Online: execute API request
      let res;
      if (action === "CREATE") {
        res = await apiClient.post(endpoint, variables);
      } else if (action === "UPDATE") {
        res = await apiClient.put(`${endpoint}/${variables.id}`, variables);
      } else {
        res = await apiClient.delete(`${endpoint}/${variables.id}`);
      }

      if (!res.success) {
        // Network or server error -> fallback to offline sync queue
        await dbEnqueueMutation({
          id: variables.id,
          action,
          entity,
          endpoint,
          payload: variables,
          timestamp: Date.now(),
          retryCount: 0,
          conflictStrategy,
          lastError: res.error,
        });

        if (action === "DELETE") {
          await deleteStoreItem(entity, variables.id);
        } else {
          await putStoreItem(entity, variables);
        }

        const remainingQueue = await dbGetMutationQueueCount();
        if (useAppStore.getState().setPendingSyncCount) {
          useAppStore.getState().setPendingSyncCount(remainingQueue);
        }

        return variables;
      }

      const resultData = res.data || variables;
      if (action === "DELETE") {
        await deleteStoreItem(entity, variables.id);
      } else {
        await putStoreItem(entity, resultData);
      }

      return resultData;
    },

    onMutate: async (newVariables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old = []) => {
        if (action === "CREATE") {
          return [newVariables, ...old];
        }
        if (action === "UPDATE") {
          return old.map((item) =>
            item.id === newVariables.id ? { ...item, ...newVariables } : item
          );
        }
        if (action === "DELETE") {
          return old.filter((item) => item.id !== newVariables.id);
        }
        return old;
      });

      if (onMutateCustom) onMutateCustom(newVariables);

      return { previousData };
    },

    onError: (err, newVariables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      if (onError) onError(err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      if (typeof navigator !== "undefined" && navigator.onLine) {
        SyncEngine.processQueue();
      }
    },

    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },
  });
}

async function dbGetMutationQueueCount() {
  const { dbGetMutationQueue } = await import("./idb-storage");
  const queue = await dbGetMutationQueue();
  return queue.length;
}
