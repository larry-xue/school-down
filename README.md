# 早点下班

让你早点下班的在线工具集合，提升工作效率。

🌐 **在线访问**: [school-down.vercel.app](https://school-down.vercel.app)

## ✨ 特性

- **快速高效** - 所有工具针对性能优化，快速处理您的任务
- **隐私安全** - 数据仅在浏览器本地处理，不会上传到服务器
- **无需安装** - 打开浏览器即可使用，无需下载安装任何软件

## 🛠️ 工具列表

### Excel 图片重命名

从 Excel 提取图片，用第一列文本作为文件名批量导出。

- 支持 `.xlsx` 格式
- 自动跳过标题行
- 按顺序匹配图片与文本
- 导出为 ZIP 压缩包

## 🚀 技术栈

- [Next.js 16](https://nextjs.org/) - React 框架
- [React 19](https://react.dev/) - UI 库
- [Tailwind CSS 4](https://tailwindcss.com/) - 样式框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [ExcelJS](https://github.com/exceljs/exceljs) - Excel 解析
- [JSZip](https://stuk.github.io/jszip/) - ZIP 打包

## 📦 本地开发

```bash
# 克隆仓库
git clone https://github.com/larry-xue/school-down.git
cd school-down

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 🏗️ 构建

```bash
pnpm build
```

## 📝 License

MIT

## 👤 作者

**Larry Xue**

- Website: [larryxue.dev](https://larryxue.dev)
- GitHub: [@larry-xue](https://github.com/larry-xue)
