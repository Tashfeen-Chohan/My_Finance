export const PRESET_IMAGES = [
  { label: "Black Sedan", url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80" },
  { label: "White SUV", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80" },
  { label: "Blue EV", url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80" },
  { label: "Red Hatchback", url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80" },
];

export function getInitialVehicleFormData(vehicleToEdit) {
  if (vehicleToEdit) {
    return {
      name: vehicleToEdit.name || "",
      make: vehicleToEdit.make || "",
      model: vehicleToEdit.model || "",
      year: vehicleToEdit.year || new Date().getFullYear(),
      licensePlate: vehicleToEdit.licensePlate || "",
      fuelType: vehicleToEdit.fuelType || "petrol",
      mileageUnit: vehicleToEdit.mileageUnit || "km",
      initialOdometer: vehicleToEdit.initialOdometer || 0,
      currentOdometer: vehicleToEdit.currentOdometer || 0,
      photoUrl: vehicleToEdit.photoUrl || PRESET_IMAGES[0].url,
      isDefault: Boolean(vehicleToEdit.isDefault),
      notes: vehicleToEdit.notes || "",
    };
  }

  return {
    name: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    fuelType: "petrol",
    mileageUnit: "km",
    initialOdometer: 0,
    currentOdometer: 0,
    photoUrl: PRESET_IMAGES[0].url,
    isDefault: false,
    notes: "",
  };
}
