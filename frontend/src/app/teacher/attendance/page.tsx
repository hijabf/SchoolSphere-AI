"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Row = { student_id: string; name: string; status: string };

export default function TeacherAttendancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["teacher-attendance"],
    queryFn: () => api<{ attendance_today: Row[] }>("/teacher/dashboard"),
  });
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (data?.attendance_today) setRows(data.attendance_today);
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      api("/teacher/attendance", {
        method: "POST",
        body: JSON.stringify({
          date: new Date().toISOString().slice(0, 10),
          class_name: "Grade 8-A",
          records: rows.map((r) => ({ student_id: r.student_id, status: r.status })),
        }),
      }),
    onSuccess: () => toast.success("Attendance saved"),
    onError: (e: Error) => toast.error(e.message),
  });

  function toggle(id: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.student_id === id
          ? { ...r, status: r.status === "present" ? "absent" : "present" }
          : r,
      ),
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Take Attendance</h1>
          <p className="text-sm text-muted-foreground">Grade 8-A · Tap to toggle present/absent</p>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save attendance"}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <button
              key={r.student_id}
              type="button"
              onClick={() => toggle(r.student_id)}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left text-sm hover:bg-accent/40"
            >
              <span className="font-medium">{r.name}</span>
              <Badge variant={r.status === "present" ? "success" : "destructive"}>{r.status}</Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
