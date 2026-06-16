# Obsidian Moon Reader

Import Moon+ Reader annotations (`.mrexpt` files) into Obsidian with **customizable color-to-callout mapping**, **multi-color import**, and **custom callout titles**.

> This is a fork of [AB1908/obsidian-moon-reader](https://github.com/AB1908/obsidian-moon-reader) (no longer maintained). Key additions: color mapping config, multi-color import, frontmatter toggle, custom callout titles, and i18n support.

[中文文档](./README.zh.md)

## Features

### 🎨 Color → Callout Mapping
Map each Moon+ Reader highlight color to any Obsidian callout type:

| Color | Callout | Custom Title |
|-------|---------|-------------|
| Grey | `[!cite]` | Chapter (optional) |
| Blue | `[!quote]` | Highlight (optional) |
| Purple | `[!note]` | — |
| Orange | `[!warning]` | Verify (optional) |

### ✅ Multi-Color Import
Import all highlight colors at once — each mapped to a distinct callout type.

### 🏷️ Custom Callout Titles
Add an optional title: `> [!quote] My Title` instead of bare `> [!quote]`.

### 🔄 Frontmatter Toggle
Disable YAML frontmatter in settings if you prefer your own note structure.

### 📄 Incremental Append
Each "Parse an export" run appends to the current file — never overwrites existing notes.

### 🌐 Bilingual UI
Switch between **English** and **中文** in plugin settings.

## Installation

### Via BRAT (recommended)

1. Install [Obsidian42 - BRAT](https://github.com/TfTHacker/obsidian42-brat) from Community Plugins
2. In BRAT settings, add this beta plugin URL:
   ```
   https://github.com/Birdplus/obsidian-moon-reader
   ```
3. Enable **Obsidian Moon Reader** from Community Plugins list

### Manual

Download `main.js`, `manifest.json`, `styles.css` from the [latest release](https://github.com/Birdplus/obsidian-moon-reader/releases) and place them in your vault at `.obsidian/plugins/obsidian-moon-reader/`.

## Usage

### Prerequisites

1. Export annotations from Moon+ Reader (静读天下) to generate `.mrexpt` files
2. Place `.mrexpt` files inside your Obsidian vault (default folder: `Book Exports`)

### Steps

1. Open or create a note in Obsidian
2. Run **"Parse an export"** from the command palette (or click the book icon in the ribbon)
3. Select the `.mrexpt` file to process
4. **Choose which colors to import** (multi-select) → click **Import Selected**
5. Annotations are appended to the current note

### Settings

Open Obsidian Settings → **Moon Reader**:

- **Language / 语言** — Switch UI between English and Chinese
- **Book Exports Path** — Folder where `.mrexpt` files are stored
- **Include file header (frontmatter)** — Toggle YAML frontmatter on/off
- **Color → Callout Mapping** — Configure the color mapping table

### Output Example

```markdown
> [!quote] Highlight
> The original text from the book
> ***
> My personal note

> [!warning] Verify
> Another highlighted passage
```

## SRS Support

Enable the SRS toggle in settings for compatibility with the [Obsidian Spaced Repetition](https://github.com/AB1908/obsidian-spaced-repetition/) plugin:

```markdown
> [!notes] 12345
> Highlight text
> ***
> Note text
```

Chapter markers (`#` → H1, `##` → H2, `###` → H3) in Moon+ Reader notes are converted to Obsidian headings.

## Development

```bash
git clone https://github.com/Birdplus/obsidian-moon-reader.git
cd obsidian-moon-reader
npm install
npm run dev     # watch mode
npm run build   # production build
npm test        # run tests
```

## License

MIT
