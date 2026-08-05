import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </div>
            <span className="font-display font-semibold">SchoolSphere AI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Empowering schools through intelligent digital transformation.
          </p>
        </div>
        <div className="flex gap-10 text-sm">
          <div className="space-y-2">
            <p className="font-medium">Product</p>
            <a href="#features" className="block text-muted-foreground hover:text-foreground">Features</a>
            <a href="#ai" className="block text-muted-foreground hover:text-foreground">AI</a>
            <a href="#pricing" className="block text-muted-foreground hover:text-foreground">Pricing</a>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Account</p>
            <Link href="/login" className="block text-muted-foreground hover:text-foreground">Login</Link>
            <Link href="/register" className="block text-muted-foreground hover:text-foreground">Register</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
        © 2026 SchoolSphere AI. All rights reserved.
      </div>
    </footer>
  );
}
