# Obsidian Moon Reader

将静读天下（Moon+ Reader）的标注导出文件（`.mrexpt`）导入 Obsidian，支持**自定义颜色映射**、**多色导入**、**自定义 Callout 标题**和**双语界面**。

> 这是 [AB1908/obsidian-moon-reader](https://github.com/AB1908/obsidian-moon-reader) 的 Fork，原项目已不维护。本 Fork 新增：颜色映射配置、多色导入、表头开关、自定义 Callout 标题、双语界面支持。

[English Docs](./README.md)

## 功能亮点

### ✨ 颜色 → Callout 映射
在设置里把每种高亮颜色映射到 Obsidian Callout 类型：

| 颜色 | Callout | 自定义标题 |
|------|---------|-----------|
| 🟤 灰色 | `[!cite]` | 章节索引（可选） |
| 🔵 蓝色 | `[!quote]` | 重点摘录（可选） |
| 🟣 紫色 | `[!note]` | — |
| 🟠 橙色 | `[!warning]` | 需要验证（可选） |

### ✅ 多色同时导入
不再只能选一种颜色——所有颜色可以一次性导入，每种颜色对应不同的 Callout。

### 🏷️ 自定义 Callout 标题
支持在 Callout 右侧添加自定义标题：`> [!quote] 我的标题`

### 🔄 表头开关
在设置里可以关闭 YAML 表头，完全用自己的笔记结构。

### 📄 增量追加
每次执行"Parse an export"只会在当前文件末尾追加内容，不会覆盖已有内容。

### 🌐 双语界面
插件设置内置**中文/English**语言切换。

## 安装

### 通过 BRAT 安装（推荐）

1. 在社区插件中安装 [Obsidian42 - BRAT](https://github.com/TfTHacker/obsidian42-brat)
2. 在 BRAT 设置中添加：
   ```
   https://github.com/Birdplus/obsidian-moon-reader
   ```
3. 在社区插件列表中启用 **Obsidian Moon Reader**

### 手动安装

从 [Releases](https://github.com/Birdplus/obsidian-moon-reader/releases) 下载 `main.js`、`manifest.json`、`styles.css`，放入你的 Vault 的 `.obsidian/plugins/obsidian-moon-reader/` 目录。

## 使用

### 前提

1. 在静读天下（Moon+ Reader）中导出标注，产生 `.mrexpt` 文件
2. 将 `.mrexpt` 文件放入你的 Obsidian Vault 中的一个文件夹（默认 `Book Exports`）

### 步骤

1. 在 Obsidian 中打开或创建一个笔记
2. 打开命令面板，运行 **"Parse an export"**（或点击左侧书图标）
3. 选择要导入的 `.mrexpt` 文件
4. **选择要导入的颜色**（多选）→ 点击 **Import Selected**
5. 标注内容自动追加到当前笔记末尾

### 设置

打开 Obsidian 设置 → **Moon Reader**：

- **Language / 语言** — 切换界面语言（中文/English）
- **Book Exports Path** — `.mrexpt` 文件存放的文件夹
- **Include file header (frontmatter)** — 是否在输出中添加 YAML 表头
- **Color → Callout Mapping** — 配置颜色映射表

### 输出示例

```markdown
> [!quote] 重点摘录
> 这是书中原文高亮内容
> ***
> 这是我写的笔记

> [!warning] 需要验证
> 另一段高亮
```

## SRS 支持

开启 SRS 开关后，输出格式变为与 [Obsidian Spaced Repetition](https://github.com/AB1908/obsidian-spaced-repetition/) 插件兼容的格式：

```markdown
> [!notes] 12345
> 高亮内容
> ***
> 笔记内容
```

章节标记（`#` → H1, `##` → H2, `###` → H3）会转换为 Obsidian 标题。

## 开发

```bash
git clone https://github.com/Birdplus/obsidian-moon-reader.git
cd obsidian-moon-reader
npm install
npm run dev     # 开发模式
npm run build   # 编译
npm test        # 测试
```

## License

MIT
