"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentTimetablePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-timetable"],
    queryFn: () =>
      api<{ timetable: { day: string; slots: string[] }[] }>("/student/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Timetable</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Periods</th>
            </tr>
          </thead>
          <tbody>
            {data.timetable.map((d) => (
              <tr key={d.day} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{d.day}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {d.slots.map((s) => (
                      <span key={s} className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
