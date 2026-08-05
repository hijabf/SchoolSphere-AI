"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentProgressPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["parent-progress"],
    queryFn: () =>
      api<{ progress_timeline: { date: string; event: string; detail: string }[] }>("/parent/dashboard"),
  });
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadSummary() {
    setLoading(true);
    try {
      const res = await api<{ summary: string }>("/ai/parent-summary?student_id=stu-0001");
      setSummary(res.summary);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold">Progress Timeline</h1>
        <Button onClick={loadSummary} disabled={loading}>
          {loading ? "Generating…" : "AI Parent Summary"}
        </Button>
      </div>
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Summary</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm">{summary}</CardContent>
        </Card>
      )}
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : (
        <ol className="relative space-y-6 border-l border-border pl-6">
          {data?.progress_timeline.map((p) => (
            <li key={p.date + p.event}>
              <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full bg-primary" />
              <p className="text-xs text-muted-foreground">{p.date}</p>
              <p className="font-medium">{p.event}</p>
              <p className="text-sm text-muted-foreground">{p.detail}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
