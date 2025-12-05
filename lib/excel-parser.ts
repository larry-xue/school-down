import ExcelJS from "exceljs";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface ExtractedImage {
  name: string;
  extension: string;
  data: ArrayBuffer;
}

export interface ParseResult {
  success: boolean;
  images: ExtractedImage[];
  errors: string[];
}

/**
 * Sanitize filename to remove invalid characters
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .replace(/\s+/g, "_")
    .trim();
}

/**
 * Extract images directly from xlsx ZIP structure
 */
async function extractImagesFromZip(
  arrayBuffer: ArrayBuffer
): Promise<{ imageMap: Map<number, { data: ArrayBuffer; extension: string }>; debugInfo: string[] }> {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const imageMap = new Map<number, { data: ArrayBuffer; extension: string }>();
  const debugInfo: string[] = [];

  // List all files in the ZIP for debugging
  const allFiles: string[] = [];
  zip.forEach((relativePath) => {
    allFiles.push(relativePath);
  });
  debugInfo.push(`ZIP 文件结构: ${allFiles.length} 个文件`);

  // Find all image files - search in multiple possible locations
  const imageExtensions = /\.(png|jpeg|jpg|gif|webp|bmp|tiff|emf|wmf)$/i;
  const mediaFiles: { name: string; index: number }[] = [];
  
  zip.forEach((relativePath, file) => {
    if (!file.dir && imageExtensions.test(relativePath)) {
      // Extract index from filename like "image1.png", "image2.jpeg"
      const match = relativePath.match(/(\d+)\.(png|jpeg|jpg|gif|webp|bmp|tiff|emf|wmf)$/i);
      const index = match ? parseInt(match[1], 10) : mediaFiles.length + 1;
      mediaFiles.push({
        name: relativePath,
        index,
      });
      debugInfo.push(`发现图片: ${relativePath}`);
    }
  });

  if (mediaFiles.length === 0) {
    // List some file paths for debugging
    const samplePaths = allFiles.slice(0, 20).join(", ");
    debugInfo.push(`未找到图片文件。部分文件路径: ${samplePaths}`);
  }

  // Sort by index to maintain order
  mediaFiles.sort((a, b) => a.index - b.index);

  // Load image data
  for (let i = 0; i < mediaFiles.length; i++) {
    const file = zip.file(mediaFiles[i].name);
    if (file) {
      const data = await file.async("arraybuffer");
      const ext = mediaFiles[i].name.split(".").pop()?.toLowerCase() || "png";
      // Map to 1-based row index (assuming image1 -> row 1, image2 -> row 2, etc.)
      imageMap.set(i + 1, { data, extension: ext === "jpeg" ? "jpg" : ext });
    }
  }

  return { imageMap, debugInfo };
}

/**
 * Parse Excel file and extract images with names from first column
 */
export async function parseExcelAndExtractImages(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ParseResult> {
  const errors: string[] = [];
  const images: ExtractedImage[] = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // First, try to extract images directly from ZIP structure
    const { imageMap: zipImageMap, debugInfo } = await extractImagesFromZip(arrayBuffer);
    
    if (zipImageMap.size === 0) {
      return { 
        success: false, 
        images: [], 
        errors: ["Excel 文件中没有找到图片文件", ...debugInfo] 
      };
    }

    // Parse Excel to get text from first column
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return { success: false, images: [], errors: ["Excel 文件中没有工作表"] };
    }

    // Also try exceljs getImages for position info
    const worksheetImages = worksheet.getImages();
    
    // Build row-to-image mapping
    // Priority 1: Use exceljs position info if available
    // Priority 2: Fall back to sequential matching
    const rowImageMap = new Map<number, { data: ArrayBuffer; extension: string }>();
    
    if (worksheetImages.length > 0) {
      // Use position info from exceljs
      for (const img of worksheetImages) {
        const range = img.range;
        if (range && typeof range.tl?.nativeRow === "number") {
          const row = range.tl.nativeRow + 1;
          const imageId = Number(img.imageId);
          const imageData = zipImageMap.get(imageId);
          if (imageData) {
            rowImageMap.set(row, imageData);
          }
        }
      }
    }
    
    // If exceljs didn't find positions, use sequential matching
    const useSequentialMatching = rowImageMap.size === 0;
    
    // Collect row information (skip header row)
    const rowsWithNames: { rowNumber: number; name: string }[] = [];
    const skippedRows: { rowNumber: number; reason: string }[] = [];
    
    // Get total row count for iteration
    const totalRowCount = worksheet.rowCount;
    
    for (let rowNumber = 2; rowNumber <= totalRowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      
      // Check if row is completely empty
      const firstCell = row.getCell(1);
      const secondCell = row.getCell(2);
      
      const firstCellEmpty = firstCell.value === null || firstCell.value === undefined || String(firstCell.value).trim() === "";
      const secondCellEmpty = secondCell.value === null || secondCell.value === undefined || String(secondCell.value).trim() === "";
      
      // Skip completely empty rows
      if (firstCellEmpty && secondCellEmpty) {
        skippedRows.push({ rowNumber, reason: "空行" });
        continue;
      }
      
      // Get name from first column
      let name = "";
      if (firstCell.value !== null && firstCell.value !== undefined) {
        if (typeof firstCell.value === "object" && "richText" in firstCell.value) {
          name = firstCell.value.richText.map((rt) => rt.text).join("");
        } else {
          name = String(firstCell.value);
        }
      }
      
      // Skip rows without name in first column
      if (!name.trim()) {
        skippedRows.push({ rowNumber, reason: "第一列为空" });
        continue;
      }

      rowsWithNames.push({ rowNumber, name: name.trim() });
    }
    
    // Report skipped rows
    if (skippedRows.length > 0) {
      const skippedInfo = skippedRows
        .slice(0, 5)
        .map(r => `第 ${r.rowNumber} 行 (${r.reason})`)
        .join("、");
      const moreCount = skippedRows.length > 5 ? `等 ${skippedRows.length} 行` : "";
      errors.push(`跳过: ${skippedInfo}${moreCount}`);
    }

    // Get all images as array for sequential matching
    const imageArray = Array.from(zipImageMap.values());
    const imageCount = imageArray.length;
    const textRowCount = rowsWithNames.length;
    
    // Check if counts match
    if (imageCount !== textRowCount) {
      errors.push(`提示: 图片数量(${imageCount})与数据行数(${textRowCount})不一致`);
    }
    
    // Match images with text rows sequentially
    const matchCount = Math.min(imageCount, textRowCount);
    
    for (let i = 0; i < matchCount; i++) {
      onProgress?.(Math.round(((i + 1) / matchCount) * 100));
      
      const { rowNumber, name } = rowsWithNames[i];
      const imageData = imageArray[i];
      
      const sanitizedName = sanitizeFilename(name);

      images.push({
        name: sanitizedName,
        extension: imageData.extension,
        data: imageData.data,
      });
    }
    
    // Report unmatched text rows (more text than images)
    if (textRowCount > imageCount) {
      const unmatchedRows = rowsWithNames.slice(imageCount);
      const unmatchedInfo = unmatchedRows
        .slice(0, 3)
        .map(r => `第 ${r.rowNumber} 行 "${r.name}"`)
        .join("、");
      const moreCount = unmatchedRows.length > 3 ? `等 ${unmatchedRows.length} 行` : "";
      errors.push(`以下行没有对应图片: ${unmatchedInfo}${moreCount}`);
    }

    return {
      success: images.length > 0,
      images,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      images: [],
      errors: [`解析 Excel 文件失败: ${error instanceof Error ? error.message : "未知错误"}`],
    };
  }
}

/**
 * Create ZIP file from extracted images and trigger download
 */
export async function downloadImagesAsZip(
  images: ExtractedImage[],
  zipName: string = "images.zip"
): Promise<void> {
  const zip = new JSZip();

  // Track duplicate names
  const nameCount = new Map<string, number>();

  for (const img of images) {
    let filename = `${img.name}.${img.extension}`;
    
    // Handle duplicates by adding number suffix
    const baseName = img.name;
    const count = nameCount.get(baseName) || 0;
    if (count > 0) {
      filename = `${baseName}_${count}.${img.extension}`;
    }
    nameCount.set(baseName, count + 1);

    zip.file(filename, img.data);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, zipName);
}
