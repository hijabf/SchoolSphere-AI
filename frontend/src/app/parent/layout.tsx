"use client";

import {
  Bell,
  CreditCard,
  LayoutDashboard,
  LineChart,
  Percent,
  User,
  GraduationCap,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/dashboard-shell";

const nav: NavItem[] = [
  { title: "Overview", href: "/parent", icon: LayoutDashboard },
  { title: "Progress", href: "/parent/progress", icon: LineChart },
  { title: "Grades", href: "/parent/grades", icon: GraduationCap },
  { title: "Attendance", href: "/parent/attendance", icon: Percent },
  { title: "Fees", href: "/parent/fees", icon: CreditCard },
  { title: "Notices", href: "/parent/notices", icon: Bell },
  { title: "Profile", href: "/parent/profile", icon: User },
];

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="parent" navItems={nav}>
      {children}
    </DashboardShell>
  );
}
