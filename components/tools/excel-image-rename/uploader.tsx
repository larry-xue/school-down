"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  parseExcelAndExtractImages,
  downloadImagesAsZip,
  type ExtractedImage,
} from "@/lib/excel-parser";

type Status = "idle" | "parsing" | "success" | "error";

export function ExcelImageUploader() {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string>("");
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".xlsx")) {
      setErrors(["请上传 .xlsx 格式的 Excel 文件"]);
      setStatus("error");
      return;
    }

    setFileName(file.name);
    setStatus("parsing");
    setProgress(0);
    setErrors([]);
    setImages([]);

    const result = await parseExcelAndExtractImages(file, setProgress);

    if (result.success) {
      setImages(result.images);
      setErrors(result.errors);
      setStatus("success");
    } else {
      setErrors(result.errors);
      setStatus("error");
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDownload = useCallback(() => {
    if (images.length > 0) {
      const baseName = fileName.replace(/\.xlsx$/i, "");
      downloadImagesAsZip(images, `${baseName}_images.zip`);
    }
  }, [images, fileName]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setFileName("");
    setImages([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="hidden"
      />

      {status === "idle" && (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium mb-1">点击或拖拽上传 Excel 文件</p>
            <p className="text-sm text-muted-foreground">
              支持 .xlsx 格式，第一列为文件名，第二列为图片
            </p>
          </CardContent>
        </Card>
      )}

      {status === "parsing" && (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center gap-4 mb-4">
              <FileSpreadsheet className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{fileName}</p>
                <p className="text-sm text-muted-foreground">正在解析...</p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {status === "success" && (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{fileName}</p>
                <p className="text-sm text-muted-foreground">
                  成功提取 {images.length} 张图片
                </p>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  部分行处理失败:
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                  {errors.slice(0, 5).map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li>...还有 {errors.length - 5} 个警告</li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                下载 ZIP
              </Button>
              <Button variant="outline" onClick={handleReset}>
                重新上传
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {status === "error" && (
        <Card className="border-destructive/50">
          <CardContent className="py-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-full bg-destructive/10 p-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium">处理失败</p>
                {fileName && (
                  <p className="text-sm text-muted-foreground">{fileName}</p>
                )}
              </div>
            </div>

            <div className="mb-4 p-3 bg-destructive/5 rounded-lg">
              <ul className="text-sm text-destructive list-disc list-inside">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>

            <Button variant="outline" onClick={handleReset} className="w-full">
              重新上传
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

