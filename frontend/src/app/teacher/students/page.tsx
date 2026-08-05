"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherStudentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["teacher-students"],
    queryFn: () =>
      api<{ students: { id: string; full_name: string; gpa: number; attendance_pct: number; risk_level: string }[] }>(
        "/teacher/dashboard",
      ),
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Class Roster</h1>
      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">GPA</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {data?.students.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{s.full_name}</td>
                  <td className="px-4 py-3">{s.gpa}</td>
                  <td className="px-4 py-3">{s.attendance_pct}%</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.risk_level === "high" ? "destructive" : s.risk_level === "medium" ? "warning" : "success"}>
                      {s.risk_level}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
