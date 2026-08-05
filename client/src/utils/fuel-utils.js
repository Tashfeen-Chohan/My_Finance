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

