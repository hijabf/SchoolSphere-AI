"use client";

import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  LineChart,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/dashboard-shell";

const nav: NavItem[] = [
  { title: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { title: "Attendance", href: "/teacher/attendance", icon: CalendarCheck },
  { title: "Students", href: "/teacher/students", icon: Users },
  { title: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
  { title: "AI Tools", href: "/teacher/ai", icon: Sparkles, badge: "AI" },
  { title: "Analytics", href: "/teacher/analytics", icon: LineChart },
  { title: "Profile", href: "/teacher/profile", icon: User },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="teacher" navItems={nav}>
      {children}
    </DashboardShell>
  );
}
