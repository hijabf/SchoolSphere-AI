"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const suggestions = [
  "Which students need help?",
  "Which teacher improved the most?",
  "Which class has lowest attendance?",
  "Summarize this month.",
  "Why did mathematics scores decrease?",
];

export default function AdminAIPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  const report = useQuery({
    queryKey: ["monthly-report"],
    queryFn: () => api<Record<string, unknown>>("/ai/monthly-report"),
  });
  const recs = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api<{ items: { priority: string; action: string; owner: string }[] }>("/ai/recommendations"),
  });
  const roadmap = useQuery({
    queryKey: ["roadmap"],
    queryFn: () => api<{ "3_month": string[]; "6_month": string[]; "12_month": string[] }>("/ai/roadmap"),
  });
  const health = useQuery({
    queryKey: ["health-score"],
    queryFn: () => api<{ score: number; level: string; explanation: string }>("/ai/health-score"),
  });

  async function ask(q?: string) {
    const text = (q ?? question).trim();
    if (!text) return;
    setAsking(true);
    try {
      const res = await api<{ answer: string }>("/ai/copilot", {
        method: "POST",
        body: JSON.stringify({ question: text }),
      });
      setAnswer(res.answer);
      setQuestion(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Copilot failed");
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Principal AI Copilot</h1>
        <p className="text-sm text-muted-foreground">Ask questions grounded in live school metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-primary" /> Ask anything
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Button key={s} size="sm" variant="outline" onClick={() => ask(s)}>
                {s}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Which students need help?"
              onKeyDown={(e) => e.key === "Enter" && ask()}
            />
            <Button onClick={() => ask()} disabled={asking}>
              {asking ? "Thinking…" : "Ask"}
            </Button>
          </div>
          {answer && (
            <pre className="whitespace-pre-wrap rounded-xl bg-muted/60 p-4 text-sm leading-relaxed">{answer}</pre>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">School Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            {health.isLoading ? (
              <Skeleton className="h-20" />
            ) : (
              <>
                <p className="font-display text-4xl font-semibold text-primary">{health.data?.score}</p>
                <p className="mt-1 text-sm capitalize text-muted-foreground">{health.data?.level?.replaceAll("_", " ")}</p>
                <p className="mt-3 text-sm">{health.data?.explanation}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recs.data?.items.map((r) => (
              <div key={r.action} className="text-sm">
                <p className="font-medium">
                  <span className="uppercase text-xs text-primary">{r.priority}</span> — {r.action}
                </p>
                <p className="text-xs text-muted-foreground">Owner: {r.owner}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Monthly School Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {report.isLoading ? (
              <Skeleton className="h-32" />
            ) : (
              <>
                <p>{String(report.data?.executive_summary ?? "")}</p>
                <p className="text-muted-foreground">{String(report.data?.narrative ?? "")}</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Improvement Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            {(["3_month", "6_month", "12_month"] as const).map((key) => (
              <div key={key}>
                <p className="mb-2 text-sm font-semibold capitalize">{key.replace("_", " ")}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {roadmap.data?.[key]?.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
