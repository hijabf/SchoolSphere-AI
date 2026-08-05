"use client";

import { Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ExplainChartResponse {
  explanation: string;
}

export interface AIChartProps {
  title: string;
  description?: string;
  chartType: string;
  chartData: Record<string, unknown>;
  children: ReactNode;
  className?: string;
}

export function AIChart({
  title,
  description,
  chartType,
  chartData,
  children,
  className,
}: AIChartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  async function handleExplain() {
    setIsOpen(true);
    setIsLoading(true);
    setExplanation(null);

    try {
      const response = await api<ExplainChartResponse>("/ai/explain-chart", {
        method: "POST",
        body: JSON.stringify({
          title,
          chart_type: chartType,
          data: chartData,
        }),
      });
      setExplanation(response.explanation);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate explanation";
      toast.error(message);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <Button variant="outline" size="sm" onClick={handleExplain} className="shrink-0">
            <Sparkles className="size-4 text-primary" />
            Explain with AI
          </Button>
        </CardHeader>
        <CardContent className="pt-2">{children}</CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              AI Chart Explanation
            </DialogTitle>
            <DialogDescription>
              Insights generated for &ldquo;{title}&rdquo;
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
