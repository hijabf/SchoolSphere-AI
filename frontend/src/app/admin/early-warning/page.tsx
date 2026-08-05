"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EarlyWarningPage() {
  const warning = useQuery({
    queryKey: ["early-warning"],
    queryFn: () =>
      api<{
        count: number;
        summary: string;
        students: { full_name: string; class_name: string; risk_level: string; reasons: string[] }[];
      }>("/ai/early-warning"),
  });
  const dropout = useQuery({
    queryKey: ["dropout-risk"],
    queryFn: () =>
      api<{ distribution: Record<string, number>; insight: string }>("/ai/dropout-risk"),
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Early Warning System</h1>
        <p className="text-sm text-muted-foreground">Intervention queue from attendance, grades, and risk patterns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(["high", "medium", "low"] as const).map((level) => (
          <Card key={level}>
            <CardContent className="p-5">
              <p className="text-sm capitalize text-muted-foreground">{level} risk</p>
              <p className="font-display text-3xl font-semibold">
                {dropout.isLoading ? "—" : dropout.data?.distribution[level] ?? 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm whitespace-pre-wrap">
          {warning.isLoading ? <Skeleton className="h-20" /> : warning.data?.summary}
        </CardContent>
      </Card>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Reasons</th>
            </tr>
          </thead>
          <tbody>
            {warning.data?.students.map((s) => (
              <tr key={s.full_name + s.class_name} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{s.full_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.class_name}</td>
                <td className="px-4 py-3">
                  <Badge variant={s.risk_level === "high" ? "destructive" : "warning"}>{s.risk_level}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.reasons.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
