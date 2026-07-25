export function resolveConflict(
  localItem,
  serverItem,
  strategy = "last-write-wins"
) {
  if (strategy === "client-wins") {
    return {
      resolved: true,
      winner: "client",
      data: localItem.payload,
      message: "Client changes applied over server state (Client Wins)",
    };
  }

  if (strategy === "server-wins") {
    return {
      resolved: true,
      winner: "server",
      data: serverItem,
      message: "Server state accepted over local changes (Server Wins)",
    };
  }

  // Default: Last-Write-Wins based on timestamps
  const localTimestamp = localItem.timestamp || 0;
  const serverTimestamp =
    typeof serverItem?.updatedAt === "string"
      ? new Date(serverItem.updatedAt).getTime()
      : typeof serverItem?.timestamp === "number"
      ? serverItem.timestamp
      : 0;

  if (localTimestamp >= serverTimestamp) {
    return {
      resolved: true,
      winner: "client",
      data: localItem.payload,
      message: "Local mutation is newer, overriding server (Last Write Wins)",
    };
  } else {
    return {
      resolved: true,
      winner: "server",
      data: serverItem,
      message: "Server record is newer, keeping server data (Last Write Wins)",
    };
  }
}

export const conflictResolver = {
  resolve: resolveConflict,
};
