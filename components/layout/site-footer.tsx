import Link from "next/link";
import { Coffee } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container max-w-screen-2xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <Coffee className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>早点下班</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              让你早点下班的在线工具集合。所有工具均在浏览器本地运行，保护您的数据隐私。
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">工具</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/tools/excel-image-rename"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Excel 图片重命名
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">链接</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://github.com/larry-xue/school-down"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://larryxue.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    作者博客
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            <a
              href="https://larryxue.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Larry Xue
            </a>
            . 保留所有权利.
          </p>
          <p>数据仅在本地处理，不会上传到服务器</p>
        </div>
      </div>
    </footer>
  );
}
