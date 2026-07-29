export const CATEGORY_BADGES = {
  oil_change: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  service: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  service_and_oil_change: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  repair: "bg-red-500/10 text-red-400 border-red-500/20",
  part_replacement: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  tire_puncture: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  washing: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  other: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export const CATEGORY_LABELS = {
  oil_change: "Oil Change",
  service: "Service",
  service_and_oil_change: "Service & Oil Change",
  repair: "Repair",
  part_replacement: "Part Replacement",
  tire_puncture: "Tire Puncture",
  washing: "Wash & Detailing",
  other: "Other",
};

export const DEFAULT_CATEGORY_TITLES = {
  oil_change: "Engine Oil & Filter Change",
  service: "Maintenance Service",
  service_and_oil_change: "Service & Oil Change",
  tire_puncture: "Tire Puncture",
  washing: "Car Wash & Detailing",
  repair: "Vehicle Repair",
  part_replacement: "Part Replacement",
};

export const MAINTENANCE_CATEGORIES = [
  { value: "oil_change", label: "Oil Change", defaultTitle: "Engine Oil & Filter Change" },
  { value: "service", label: "Service", defaultTitle: "Maintenance Service" },
  { value: "service_and_oil_change", label: "Service & Oil Change", defaultTitle: "Service & Oil Change" },
  { value: "repair", label: "Repair", defaultTitle: "Vehicle Repair" },
  { value: "part_replacement", label: "Part Replacement", defaultTitle: "Part Replacement" },
  { value: "tire_puncture", label: "Tire Puncture", defaultTitle: "Tire Puncture" },
  { value: "washing", label: "Wash & Detailing", defaultTitle: "Car Wash & Detailing" },
  { value: "other", label: "Other", defaultTitle: "" },
];
