import * as z from "zod";
import { useVehicleStore } from "@/stores/use-vehicle-store";

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Please select a vehicle"),
  category: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required").max(150),
  odometer: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number({ invalid_type_error: "Odometer reading is required" }).min(0, "Odometer reading cannot be negative")
  ),
  cost: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number({ invalid_type_error: "Service cost is required" }).min(0, "Cost cannot be negative")
  ),
  serviceProvider: z.string().max(100).optional(),
  receiptUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  nextServiceOdometerMin: z.coerce.number().min(0).optional().or(z.literal("")),
  nextServiceOdometerMax: z.coerce.number().min(0).optional().or(z.literal("")),
  nextOilChangeOdometerMin: z.coerce.number().min(0).optional().or(z.literal("")),
  nextOilChangeOdometerMax: z.coerce.number().min(0).optional().or(z.literal("")),
  notes: z.string().max(1000).optional(),
});

export function getInitialMaintenanceValues(maintenanceToEdit, vehicles = []) {
  const cachedDefaultId = useVehicleStore.getState().defaultVehicleId || "";
  const defaultVehicleId = vehicles.find((v) => v.isDefault)?.id || vehicles[0]?.id || vehicles[0]?._id || cachedDefaultId;

  if (maintenanceToEdit) {
    const vId = maintenanceToEdit.vehicleId?._id || maintenanceToEdit.vehicleId || defaultVehicleId;
    const dateStr = maintenanceToEdit.date
      ? new Date(maintenanceToEdit.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    return {
      vehicleId: String(vId),
      category: maintenanceToEdit.category || "service",
      title: maintenanceToEdit.title || "",
      odometer: maintenanceToEdit.odometer ?? "",
      cost: maintenanceToEdit.cost ?? maintenanceToEdit.totalCost ?? "",
      serviceProvider: maintenanceToEdit.serviceProvider || "",
      receiptUrl: maintenanceToEdit.receiptUrl || "",
      date: dateStr,
      nextServiceOdometerMin: maintenanceToEdit.nextServiceOdometerMin ?? maintenanceToEdit.nextServiceOdometer ?? "",
      nextServiceOdometerMax: maintenanceToEdit.nextServiceOdometerMax ?? maintenanceToEdit.nextServiceOdometer ?? "",
      nextOilChangeOdometerMin: maintenanceToEdit.nextOilChangeOdometerMin ?? maintenanceToEdit.nextOilChangeOdometer ?? "",
      nextOilChangeOdometerMax: maintenanceToEdit.nextOilChangeOdometerMax ?? maintenanceToEdit.nextOilChangeOdometer ?? "",
      notes: maintenanceToEdit.notes || "",
    };
  }

  return {
    vehicleId: defaultVehicleId,
    category: "oil_change",
    title: "Engine Oil & Filter Change",
    odometer: "",
    cost: "",
    serviceProvider: "",
    receiptUrl: "",
    date: new Date().toISOString().split("T")[0],
    nextServiceOdometerMin: "",
    nextServiceOdometerMax: "",
    nextOilChangeOdometerMin: "",
    nextOilChangeOdometerMax: "",
    notes: "",
  };
}

export function cleanReceiptUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  // 1. Google Image Search URL
  if (trimmed.includes("google.com/imgres") || trimmed.includes("google.com/url")) {
    try {
      const parsed = new URL(trimmed);
      const imgUrl = parsed.searchParams.get("imgurl") || parsed.searchParams.get("url");
      if (imgUrl) return imgUrl;
    } catch {
      // fallback
    }
  }

  // 2. Google Drive Share Link -> Direct High-Res Image CDN Link
  if (trimmed.includes("drive.google.com")) {
    const fileIdMatch = trimmed.match(/\/file\/d\/([^\/]+)/) || trimmed.match(/[?&]id=([^&]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }

  return trimmed;
}
