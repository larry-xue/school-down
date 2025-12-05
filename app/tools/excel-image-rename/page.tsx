import { ExcelImageUploader } from "@/components/tools/excel-image-rename/uploader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excel 图片重命名 - 工具箱",
  description: "从 Excel 提取图片，用第一列文本作为文件名批量导出",
};

export default function ExcelImageRenamePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回首页
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Excel 图片重命名</h1>
        <p className="text-muted-foreground mt-1">
          上传包含图片的 Excel 文件，提取图片并用第一列文本作为文件名
        </p>
      </div>

      <ExcelImageUploader />

      <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
        <p className="font-medium">使用说明：</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>准备 Excel 文件：第一列填写图片名称，第二列插入对应图片</li>
          <li>上传 .xlsx 格式的 Excel 文件</li>
          <li>等待解析完成后，下载包含重命名图片的 ZIP 压缩包</li>
        </ol>
      </div>
    </div>
  );
}

