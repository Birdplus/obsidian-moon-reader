/**
 * i18n strings for Obsidian Moon Reader plugin.
 * Usage: t(lang, 'key') returns the string in the selected language.
 */

export type Lang = 'en' | 'zh';

const strings: Record<string, Record<Lang, string>> = {
    // --- Settings page ---
    'settings.exportsPath': {
        en: 'Book Exports Path',
        zh: '导出文件夹路径',
    },
    'settings.exportsPathDesc': {
        en: 'This is where your .mrexpt files are stored.',
        zh: '存放 .mrexpt 导出文件的文件夹路径',
    },
    'settings.frontmatter': {
        en: 'Include file header (frontmatter)',
        zh: '包含文件表头（frontmatter）',
    },
    'settings.frontmatterDesc': {
        en: 'Add YAML frontmatter (path, title, timestamp, tags) at the top of the output. Turn off if you have your own note structure.',
        zh: '在输出顶部添加 YAML 表头（路径、书名、时间戳、标签）。如果你有自己的笔记结构可以关闭。',
    },
    'settings.srs': {
        en: 'SRS Support',
        zh: 'SRS 支持',
    },
    'settings.srsDesc': {
        en: 'Enable support for the Obsidian Spaced Repetition plugin. This changes the output format.',
        zh: '启用 Obsidian Spaced Repetition 插件兼容支持。会改变输出格式。',
    },
    'settings.language': {
        en: 'Language / 语言',
        zh: 'Language / 语言',
    },
    'settings.languageDesc': {
        en: 'Switch the plugin UI between English and Chinese.',
        zh: '切换插件界面的语言（中文 / English）',
    },
    'settings.colorMapping': {
        en: 'Color → Callout Mapping',
        zh: '颜色 → Callout 映射',
    },
    'settings.colorMappingDesc': {
        en: 'Map each Moon+ Reader highlight color to an Obsidian callout type. You can also set a custom title, e.g. [!quote] My Title.',
        zh: '将每种 Moon+ Reader 高亮颜色映射为 Obsidian callout 类型。可以设置自定义标题，如 [!quote] 我的标题。',
    },
    'settings.noMappings': {
        en: 'No color mappings configured. Parse an export first to auto-discover colors.',
        zh: '还未配置颜色映射。先导入一次导出文件，颜色会自动发现。',
    },
    'settings.addMapping': {
        en: 'Add color mapping',
        zh: '添加颜色映射',
    },
    'settings.addMappingDesc': {
        en: 'Manually add a color-to-callout mapping',
        zh: '手动添加颜色映射',
    },
    'settings.addBtn': {
        en: '+ Add',
        zh: '+ 添加',
    },
    'settings.reset': {
        en: 'Reset to defaults',
        zh: '重置为默认值',
    },
    'settings.resetDesc': {
        en: 'Remove all custom mappings and restore defaults',
        zh: '删除所有自定义映射并恢复默认值',
    },
    'settings.resetBtn': {
        en: 'Reset',
        zh: '重置',
    },
    'settings.calloutTypePlaceholder': {
        en: 'type (e.g. note)',
        zh: '类型（如 note）',
    },
    'settings.calloutTitlePlaceholder': {
        en: 'title (optional)',
        zh: '标题（可选）',
    },
    'settings.colorCodeDesc': {
        en: 'Moon+ Reader color code:',
        zh: 'Moon+ Reader 颜色代码：',
    },
    'settings.removeTooltip': {
        en: 'Remove this mapping',
        zh: '删除此映射',
    },
    'settings.srsText': {
        en: 'the Obsidian Spaced Repetition plugin',
        zh: 'Obsidian Spaced Repetition 插件',
    },
    'settings.srsDescSuffix': {
        en: '. This will change the output format.',
        zh: '。开启后会改变输出格式。',
    },

    // --- Color picker modal ---
    'picker.title': {
        en: 'Select colors to import',
        zh: '选择要导入的颜色',
    },
    'picker.desc': {
        en: 'Choose which colors to import. Click the toggle to include/exclude each color.',
        zh: '选择要导入的颜色。点击开关选择或排除。',
    },
    'picker.selectAll': {
        en: 'Select All',
        zh: '全选',
    },
    'picker.deselectAll': {
        en: 'Deselect All',
        zh: '全不选',
    },
    'picker.importSelected': {
        en: 'Import Selected',
        zh: '导入所选',
    },

    // --- Notices ---
    'notice.noActiveFile': {
        en: 'No active file!',
        zh: '没有打开的笔记！',
    },
    'notice.invalidPath': {
        en: 'Invalid Folder Path',
        zh: '文件夹路径无效',
    },
    'notice.noExports': {
        en: 'Folder does not have any Moon+ Reader exports!',
        zh: '文件夹中没有 Moon+ Reader 导出文件！',
    },
    'notice.promptCancelled': {
        en: 'Prompt cancelled',
        zh: '已取消',
    },
    'notice.nothingAdded': {
        en: 'Nothing added!',
        zh: '没有添加任何内容！',
    },
    'notice.noColors': {
        en: 'No colors selected!',
        zh: '没有选择颜色！',
    },
};

/**
 * Get a translated string.
 * Falls back to English if the key or language is not found.
 */
export function t(lang: Lang, key: string, ...args: (string | number)[]): string {
    const entry = strings[key];
    let text = entry ? (entry[lang] || entry['en'] || key) : key;
    // Simple positional replacement: {0}, {1}, etc.
    for (let i = 0; i < args.length; i++) {
        text = text.replace(new RegExp(`\\{${i}\\}`, 'g'), String(args[i]));
    }
    return text;
}
