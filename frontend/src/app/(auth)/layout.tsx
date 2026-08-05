import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.12),transparent_50%),var(--background)]">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <span className="font-display text-xl font-semibold">SchoolSphere AI</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
