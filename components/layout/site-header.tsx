"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Github, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const tools = [
  {
    title: "Excel 图片重命名",
    href: "/tools/excel-image-rename",
    description: "从 Excel 提取图片，用第一列文本作为文件名批量导出",
    icon: FileSpreadsheet,
  },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-6">
        {/* Left: Logo + Navigation */}
        <div className="flex flex-1 items-center gap-4 md:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Coffee className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline-block">早点下班</span>
          </Link>

          {/* Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9">
                  工具
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-2 p-3">
                    {tools.map((tool) => (
                      <li key={tool.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={tool.href}
                            className={cn(
                              "flex select-none gap-3 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === tool.href && "bg-accent"
                            )}
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                              <tool.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm font-medium leading-none">
                                {tool.title}
                              </div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                  <a
                    href="https://github.com/larry-xue/school-down"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
