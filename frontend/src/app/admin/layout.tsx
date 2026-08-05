"use client";

import {
  AlertTriangle,
  BarChart3,
  Bell,
  LayoutDashboard,
  Scale,
  Settings,
  Sparkles,
  Users,
  UserCog,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/dashboard-shell";

const nav: NavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Students", href: "/admin/students", icon: Users },
  { title: "Teachers", href: "/admin/teachers", icon: UserCog },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "AI Copilot", href: "/admin/ai", icon: Sparkles, badge: "AI" },
  { title: "Early Warning", href: "/admin/early-warning", icon: AlertTriangle },
  { title: "Equity & SDG", href: "/admin/equity", icon: Scale },
  { title: "Announcements", href: "/admin/announcements", icon: Bell },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="admin" navItems={nav}>
      {children}
    </DashboardShell>
  );
}
