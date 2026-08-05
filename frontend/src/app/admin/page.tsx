"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Banknote,
  GraduationCap,
  HeartPulse,
  Percent,
  Users,
  UserCog,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { StatCard } from "@/components/charts/stat-card";
import { AIChart } from "@/components/charts/ai-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type AdminDash = {
  cards: Record<string, number | string>;
  charts: {
    attendance_trend: { month: string; student: number; teacher: number }[];
    performance_by_subject: { subject: string; avg: number }[];
    gender_ratio: { name: string; value: number }[];
    fee_collection: { month: string; collected: number; pending: number }[];
  };
  at_risk_students: { full_name: string; class_name: string; risk_level: string; gpa: number }[];
  recent_activities: { action: string; user: string; time: string }[];
  school: { name: string; city: string };
};

const PIE_COLORS = ["#0d9488", "#64748b"];

function pkr(n: number) {
  return `PKR ${(n / 1000).toFixed(0)}k`;
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api<AdminDash>("/admin/dashboard"),
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const c = data.cards;

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {data.school.name} · {data.school.city} · Live school intelligence
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={c.total_students} icon={GraduationCap} delay={0} />
        <StatCard label="Total Teachers" value={c.total_teachers} icon={UserCog} delay={0.05} />
        <StatCard label="Total Parents" value={c.total_parents} icon={Users} delay={0.1} />
        <StatCard
          label="Today's Attendance"
          value={`${c.todays_attendance}%`}
          icon={Percent}
          delay={0.15}
        />
        <StatCard label="Student Attendance" value={`${c.student_attendance_pct}%`} icon={Percent} delay={0.2} />
        <StatCard label="Fee Collected" value={pkr(Number(c.fee_collection))} icon={Banknote} delay={0.25} />
        <StatCard label="Pending Fees" value={pkr(Number(c.pending_fees))} icon={Wallet} delay={0.3} />
        <StatCard
          label="Students At Risk"
          value={c.students_at_risk}
          icon={AlertTriangle}
          delay={0.35}
        />
        <StatCard
          label="School Health"
          value={`${c.school_health_score}`}
          icon={HeartPulse}
          delay={0.4}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AIChart
          title="Attendance Trend"
          chartType="attendance_trend"
          chartData={{ series: data.charts.attendance_trend }}
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.charts.attendance_trend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="student" stroke="#0d9488" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="teacher" stroke="#64748b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </AIChart>

        <AIChart
          title="Subject Performance"
          chartType="performance_by_subject"
          chartData={{ series: data.charts.performance_by_subject }}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.charts.performance_by_subject}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="subject" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AIChart>

        <AIChart
          title="Gender Ratio"
          chartType="gender_ratio"
          chartData={{ series: data.charts.gender_ratio }}
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={data.charts.gender_ratio} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                {data.charts.gender_ratio.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </AIChart>

        <AIChart
          title="Fee Collection"
          chartType="fee_collection"
          chartData={{ series: data.charts.fee_collection }}
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.charts.fee_collection}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="collected" stroke="#0d9488" fill="#0d948833" />
              <Area type="monotone" dataKey="pending" stroke="#d97706" fill="#d9770622" />
            </AreaChart>
          </ResponsiveContainer>
        </AIChart>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.at_risk_students.slice(0, 6).map((s) => (
              <div key={s.full_name} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{s.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.class_name} · GPA {s.gpa}
                  </p>
                </div>
                <Badge variant={s.risk_level === "high" ? "destructive" : "warning"}>{s.risk_level}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recent_activities.map((a) => (
              <div key={a.action + a.time} className="text-sm">
                <p className="font-medium">{a.action}</p>
                <p className="text-xs text-muted-foreground">
                  {a.user} · {a.time}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
