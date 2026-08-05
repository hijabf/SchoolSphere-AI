"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  const [name, setName] = useState("Al-Noor Progressive School");
  const [city, setCity] = useState("Lahore");
  const [year, setYear] = useState("2025-2026");

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-display text-2xl font-semibold">School Settings</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Branding & profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>School name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Academic year</Label>
            <Input value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <Button
            onClick={() => toast.success("Settings saved (demo)")}
          >
            Save changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
