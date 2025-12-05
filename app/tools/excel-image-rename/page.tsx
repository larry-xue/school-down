import { ExcelImageUploader } from "@/components/tools/excel-image-rename/uploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileSpreadsheet, Info } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excel 图片重命名",
  description: "从 Excel 提取图片，用第一列文本作为文件名批量导出",
};

export default function ExcelImageRenamePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-3">
          <Link href="/">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            返回首页
          </Link>
        </Button>
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 md:h-14 md:w-14">
            <FileSpreadsheet className="h-6 w-6 text-primary md:h-7 md:w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">
              Excel 图片重命名
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              上传包含图片的 Excel 文件，提取图片并用第一列文本作为文件名
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <section>
        <ExcelImageUploader />
      </section>

      {/* Instructions */}
      <Card className="border-none bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold md:text-base">
            <Info className="h-4 w-4" />
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  1
                </span>
                <span className="text-sm font-medium">准备文件</span>
              </div>
              <p className="pl-8 text-xs text-muted-foreground md:text-sm">
                Excel 第一列填写图片名称，第二列插入对应图片
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  2
                </span>
                <span className="text-sm font-medium">上传文件</span>
              </div>
              <p className="pl-8 text-xs text-muted-foreground md:text-sm">
                支持 .xlsx 格式，可拖拽或点击上传
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  3
                </span>
                <span className="text-sm font-medium">下载结果</span>
              </div>
              <p className="pl-8 text-xs text-muted-foreground md:text-sm">
                解析完成后下载 ZIP 压缩包
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">注意事项：</p>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-muted-foreground md:text-sm">
              <li>第一行会被视为标题行自动跳过</li>
              <li>空行或第一列为空的行会被跳过</li>
              <li>图片按照在 Excel 中的顺序与文本行依次匹配</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
