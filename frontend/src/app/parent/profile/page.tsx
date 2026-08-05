"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ParentProfilePage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Profile</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-base">{user?.full_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Email:</span> {user?.email}
          </p>
          <p>
            <span className="text-muted-foreground">Role:</span> Parent
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
