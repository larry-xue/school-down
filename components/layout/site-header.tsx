import Link from "next/link";
import { Wrench } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wrench className="h-5 w-5" />
          <span>工具箱</span>
        </Link>
      </div>
    </header>
  );
}

