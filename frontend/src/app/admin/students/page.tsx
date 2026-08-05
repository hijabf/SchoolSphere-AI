"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type Student = {
  id: string;
  full_name: string;
  class_name: string;
  gender: string;
  gpa: number;
  attendance_pct: number;
  risk_level: string;
};

export default function AdminStudentsPage() {
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-students", q, risk],
    queryFn: () =>
      api<{ items: Student[] }>(
        `/admin/students?${new URLSearchParams({ ...(q ? { q } : {}), ...(risk ? { risk } : {}) })}`,
      ),
  });

  const items = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Students</h1>
        <p className="text-sm text-muted-foreground">Search and filter the school roster</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search by name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="">All risk levels</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">GPA</th>
                <th className="px-4 py-3 font-medium">Attendance</th>
                <th className="px-4 py-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{s.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.class_name}</td>
                  <td className="px-4 py-3">{s.gpa}</td>
                  <td className="px-4 py-3">{s.attendance_pct}%</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        s.risk_level === "high" ? "destructive" : s.risk_level === "medium" ? "warning" : "success"
                      }
                    >
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
