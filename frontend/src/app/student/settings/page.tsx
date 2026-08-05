"use client";

import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentSettingsPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">Profile Settings</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input defaultValue={user?.full_name ?? ""} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user?.email ?? ""} disabled />
          </div>
          <Button onClick={() => toast.success("Profile updated (demo)")}>Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}
