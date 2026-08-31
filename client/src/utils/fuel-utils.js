import { useVehicleStore } from "@/stores/use-vehicle-store";

export function getInitialFuelFormData(expenseToEdit, vehicles = []) {
  const cachedDefault = useVehicleStore.getState().defaultVehicle;

  if (expenseToEdit) {
    const d = expenseToEdit.date ? new Date(expenseToEdit.date) : new Date();
    return {
      vehicleId: expenseToEdit.vehicleId || (vehicles[0]?.id || vehicles[0]?._id || cachedDefault?.id || cachedDefault?._id || ""),
      date: d.toISOString().split("T")[0],
      odometer: expenseToEdit.odometer || 0,
      quantity: expenseToEdit.quantity || 0,
      unitPrice: expenseToEdit.unitPrice || 0,
      totalCost: expenseToEdit.totalCost || 0,
      isFullTank: expenseToEdit.isFullTank !== undefined ? Boolean(expenseToEdit.isFullTank) : true,
      stationName: expenseToEdit.stationName || "",
      notes: expenseToEdit.notes || "",
    };
  }

  const defaultVehicle = vehicles.find((v) => v.isDefault) || vehicles[0] || cachedDefault;
  return {
    vehicleId: defaultVehicle ? defaultVehicle.id || defaultVehicle._id : "",
    date: new Date().toISOString().split("T")[0],
    odometer: defaultVehicle?.currentOdometer || 0,
    quantity: 30,
    unitPrice: 275,
    totalCost: 8250,
    isFullTank: true,
    stationName: "",
    notes: "",
  };
}

/**
 * Filters fuel expense entries based on search query and time range filter.
 */
export function filterFuelExpenses(expenses = [], searchQuery = "", timeRangeFilter = "all") {
  if (!Array.isArray(expenses)) return [];

  const query = searchQuery?.trim().toLowerCase();

  return expenses.filter((item) => {
    const matchesSearch =
      !query ||
      item.stationName?.toLowerCase().includes(query) ||
      item.notes?.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (timeRangeFilter === "this_month") {
      const now = new Date();
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    } else if (timeRangeFilter === "last_90_days") {
      const now = new Date();
      const past90 = new Date(now.setDate(now.getDate() - 90));
      return new Date(item.date) >= past90;
    }

    return true;
  });
}

/**
 * Sorts fuel expense entries based on selected field and direction order.
 */
export function sortFuelExpenses(expenses = [], sortField = "date", sortOrder = "desc") {
  if (!Array.isArray(expenses)) return [];

  return [...expenses].sort((a, b) => {
    let valA;
    let valB;

    if (sortField === "date") {
      valA = new Date(a.date || a.createdAt).getTime();
      valB = new Date(b.date || b.createdAt).getTime();
    } else if (sortField === "unitPrice") {
      valA = Number(a.unitPrice ?? 0);
      valB = Number(b.unitPrice ?? 0);
    } else if (sortField === "quantity") {
      valA = Number(a.quantity ?? 0);
      valB = Number(b.quantity ?? 0);
    } else if (sortField === "distanceTraveled") {
      valA = Number(a.distanceTraveled ?? 0);
      valB = Number(b.distanceTraveled ?? 0);
    } else if (sortField === "dailyDistanceDriven") {
      valA = Number(a.dailyDistanceDriven ?? 0);
      valB = Number(b.dailyDistanceDriven ?? 0);
    } else {
      valA = Number(a[sortField] ?? 0);
      valB = Number(b[sortField] ?? 0);
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}
