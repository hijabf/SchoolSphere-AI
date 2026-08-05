"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentFeesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["parent-fees"],
    queryFn: () =>
      api<{
        fee_status: {
          status: string;
          amount: number;
          month: string;
          history: { month: string; amount: number; status: string }[];
        };
      }>("/parent/dashboard"),
  });

  if (isLoading || !data) return <div className="p-6"><Skeleton className="h-40" /></div>;
  const f = data.fee_status;

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Fee Status</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-base">{f.month}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="font-display text-2xl font-semibold">PKR {f.amount.toLocaleString()}</span>
          <Badge variant={f.status === "paid" ? "success" : "warning"}>{f.status}</Badge>
        </CardContent>
      </Card>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {f.history.map((h) => (
              <tr key={h.month} className="border-t border-border">
                <td className="px-4 py-3">{h.month}</td>
                <td className="px-4 py-3">PKR {h.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge variant={h.status === "paid" ? "success" : "warning"}>{h.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
