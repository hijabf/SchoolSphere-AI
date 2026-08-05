"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParentNoticesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["parent-notices"],
    queryFn: () =>
      api<{ announcements: { id: string; title: string; body: string; published_at: string }[] }>(
        "/parent/dashboard",
      ),
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">School Notices</h1>
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="space-y-4">
          {data?.announcements.map((a) => (
            <Card key={a.id}>
              <CardHeader>
                <CardTitle className="text-base">{a.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{a.published_at}</p>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{a.body}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
