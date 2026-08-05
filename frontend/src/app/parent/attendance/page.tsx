"use client";

import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "@/lib/api";
import { AIChart } from "@/components/charts/ai-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentAttendancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["parent-attendance"],
    queryFn: () =>
      api<{
        selected_child: { attendance_pct: number };
        attendance_trend: { month: string; pct: number }[];
      }>("/parent/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Attendance</h1>
        <p className="text-sm text-muted-foreground">Current: {data.selected_child.attendance_pct}%</p>
      </div>
      <AIChart title="Attendance Trend" chartType="attendance_trend" chartData={{ series: data.attendance_trend }}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.attendance_trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[60, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="pct" stroke="#0d9488" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </AIChart>
    </div>
  );
}
