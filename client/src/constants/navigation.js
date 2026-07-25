import {
  LayoutDashboard,
  Car,
  Fuel,
  Wrench,
  Settings,
  HelpCircle,
  Code2,
} from "lucide-react";

export const MAIN_NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Vehicles",
    href: "/vehicles",
    icon: Car,
  },
  {
    title: "Fuel Logs",
    href: "/fuel",
    icon: Fuel,
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const MOBILE_NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Vehicles",
    href: "/vehicles",
    icon: Car,
  },
  {
    title: "Fuel",
    href: "/fuel",
    icon: Fuel,
  },
  {
    title: "Service",
    href: "/maintenance",
    icon: Wrench,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const SECONDARY_NAV_ITEMS = [
  {
    title: "Design System",
    href: "/design-system",
    icon: Code2,
  },
  {
    title: "Help & Docs",
    href: "#",
    icon: HelpCircle,
  },
];
