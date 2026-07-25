import {
  LayoutDashboard,
  Car,
  Fuel,
  Wrench,
  Settings,
  PieChart,
  ShoppingCart,
  Receipt,
  Sparkles,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  isPhase2?: boolean;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
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
    title: "Fuel Expenses",
    href: "/fuel",
    icon: Fuel,
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
  },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    title: "Design System",
    href: "/design-system",
    icon: Sparkles,
  },
  {
    title: "Grocery",
    href: "/grocery",
    icon: ShoppingCart,
    isPhase2: true,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: PieChart,
    isPhase2: true,
  },
  {
    title: "Bills",
    href: "/bills",
    icon: Receipt,
    isPhase2: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  {
    title: "Home",
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
