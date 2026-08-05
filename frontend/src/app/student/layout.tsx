"use client";

import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  LayoutDashboard,
  LineChart,
  Settings,
  Sparkles,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/dashboard-shell";

const nav: NavItem[] = [
  { title: "Dashboard", href: "/student", icon: LayoutDashboard },
  { title: "Performance", href: "/student/performance", icon: LineChart },
  { title: "Timetable", href: "/student/timetable", icon: BookOpen },
  { title: "Achievements", href: "/student/achievements", icon: Award },
  { title: "Calendar", href: "/student/calendar", icon: Calendar },
  { title: "Study Plan", href: "/student/study-plan", icon: Sparkles, badge: "AI" },
  { title: "Career", href: "/student/career", icon: Briefcase },
  { title: "Settings", href: "/student/settings", icon: Settings },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="student" navItems={nav}>
      {children}
    </DashboardShell>
  );
}
