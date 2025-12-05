import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileSpreadsheet, ArrowRight, Zap, Shield, Laptop } from "lucide-react";

const tools = [
  {
    title: "Excel 图片重命名",
    description: "从 Excel 提取图片，用第一列文本作为文件名批量导出",
    href: "/tools/excel-image-rename",
    icon: FileSpreadsheet,
  },
];

const features = [
  {
    icon: Zap,
    title: "快速高效",
    description: "所有工具针对性能优化，快速处理您的任务",
  },
  {
    icon: Shield,
    title: "隐私安全",
    description: "数据仅在浏览器本地处理，不会上传到服务器",
  },
  {
    icon: Laptop,
    title: "无需安装",
    description: "打开浏览器即可使用，无需下载安装任何软件",
  },
];

export default function Home() {
  return (
    <div className="space-y-10 md:space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 pt-4 md:pt-8 lg:pt-12">
        <div className="flex max-w-3xl flex-col items-start gap-4">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl lg:leading-[1.1]">
            早点下班
            <br className="hidden sm:inline" />
            从提升效率开始
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            免费、开源的在线工具集合，帮你告别重复劳动。所有工具均在浏览器本地运行，保护您的数据隐私。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="#tools">
              浏览工具
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://github.com/larry-xue/school-down"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Features Section */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            为什么选择我们
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            简单、安全、高效的在线工具体验
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-none bg-muted/50 shadow-none"
            >
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-semibold md:text-base">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Tools Section */}
      <section id="tools" className="scroll-mt-20 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            全部工具
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            选择您需要的工具开始使用
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20 md:h-12 md:w-12">
                      <tool.icon className="h-5 w-5 text-primary md:h-6 md:w-6" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold transition-colors group-hover:text-primary md:text-lg">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
