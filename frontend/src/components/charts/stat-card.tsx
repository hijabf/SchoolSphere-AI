"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, trend, className, delay = 0 }: StatCardProps) {
  const isPositive = trend !== undefined && trend.value >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="font-display text-3xl font-semibold tracking-tight">{value}</p>
              {trend !== undefined && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    isPositive ? "text-success" : "text-destructive",
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {trend.value}%
                  </span>
                  {trend.label && (
                    <span className="text-muted-foreground font-normal">{trend.label}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
