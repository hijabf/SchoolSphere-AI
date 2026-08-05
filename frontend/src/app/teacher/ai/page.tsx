"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeacherAIPage() {
  const [subject, setSubject] = useState("Mathematics");
  const [grade, setGrade] = useState("8");
  const [topic, setTopic] = useState("Linear Equations");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(kind: "lesson" | "paper" | "quiz" | "comment" | "ptm") {
    setLoading(true);
    try {
      if (kind === "lesson") {
        const res = await api<{ plan: string }>("/ai/lesson-planner", {
          method: "POST",
          body: JSON.stringify({ subject, grade, topic }),
        });
        setOutput(res.plan);
      } else if (kind === "paper") {
        const res = await api<{ narrative: string; mcqs: unknown[]; short: unknown[]; long: unknown[] }>(
          "/ai/question-paper",
          { method: "POST", body: JSON.stringify({ subject, grade, topic, difficulty: "medium" }) },
        );
        setOutput(
          `${res.narrative}\n\nMCQs: ${res.mcqs.length}\nShort: ${res.short.length}\nLong: ${res.long.length}\n` +
            JSON.stringify({ mcqs: res.mcqs, short: res.short, long: res.long }, null, 2),
        );
      } else if (kind === "quiz") {
        const res = await api<{ explanation: string; weak_topics: string[]; suggested_revision: string }>(
          "/ai/quiz-analyzer",
        );
        setOutput(`${res.explanation}\n\nWeak topics: ${res.weak_topics.join(", ")}\n${res.suggested_revision}`);
      } else if (kind === "comment") {
        const res = await api<{ comment: string }>("/ai/report-card-comment?student_id=stu-0001", {
          method: "POST",
        });
        setOutput(res.comment);
      } else {
        const res = await api<{ talking_points: string; agenda: string[] }>("/ai/ptm-assistant?student_id=stu-0001");
        setOutput(`${res.talking_points}\n\nAgenda:\n${res.agenda.map((a) => `• ${a}`).join("\n")}`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Teacher AI Tools</h1>
      <Tabs defaultValue="lesson">
        <TabsList>
          <TabsTrigger value="lesson">Lesson Planner</TabsTrigger>
          <TabsTrigger value="paper">Question Paper</TabsTrigger>
          <TabsTrigger value="quiz">Quiz Analyzer</TabsTrigger>
          <TabsTrigger value="comment">AI Comments</TabsTrigger>
          <TabsTrigger value="ptm">PTM Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="lesson" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generate lesson plan</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Input value={grade} onChange={(e) => setGrade(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
              <Button className="sm:col-span-3" disabled={loading} onClick={() => run("lesson")}>
                Generate
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paper">
          <Button disabled={loading} onClick={() => run("paper")}>
            Generate question paper
          </Button>
        </TabsContent>
        <TabsContent value="quiz">
          <Button disabled={loading} onClick={() => run("quiz")}>
            Analyze latest quiz
          </Button>
        </TabsContent>
        <TabsContent value="comment">
          <Button disabled={loading} onClick={() => run("comment")}>
            Generate report-card comment
          </Button>
        </TabsContent>
        <TabsContent value="ptm">
          <Button disabled={loading} onClick={() => run("ptm")}>
            Prepare PTM talking points
          </Button>
        </TabsContent>
      </Tabs>

      {output && (
        <pre className="whitespace-pre-wrap rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed">
          {output}
        </pre>
      )}
    </div>
  );
}
