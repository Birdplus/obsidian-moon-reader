import {App, PluginSettingTab, Setting} from 'obsidian';
import MoonReader, {MoonReaderSettings} from 'src/main';
import integerToRGBA from './util';
import {ColorMapping} from 'src/types';
import {t, Lang} from './strings';

export class SettingsTab extends PluginSettingTab {
    plugin: MoonReader;

    constructor(app: App, plugin: MoonReader) {
        super(app, plugin);
        this.plugin = plugin;
    }

    /** Convenience: translate using the plugin's current language */
    private tr(key: string, ...args: (string | number)[]): string {
        return t(this.plugin.settings.language || 'en', key, ...args);
    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();

        // --- Language selector (always at top) ---
        new Setting(containerEl)
            .setName(this.tr('settings.language'))
            .setDesc(this.tr('settings.languageDesc'))
            .addDropdown(dropdown => dropdown
                .addOption('en', 'English')
                .addOption('zh', '中文')
                .setValue(this.plugin.settings.language)
                .onChange(async (value: string) => {
                    this.plugin.settings.language = value as Lang;
                    await this.plugin.saveSettings();
                    this.display(); // Re-render
                }));

        // --- General Settings ---
        new Setting(containerEl)
            .setName(this.tr('settings.exportsPath'))
            .setDesc(this.tr('settings.exportsPathDesc'))
            .addText(text => text
                .setPlaceholder('Book Exports')
                .setValue(this.plugin.settings.exportsPath)
                .onChange(async (value) => {
                    this.plugin.settings.exportsPath = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.tr('settings.frontmatter'))
            .setDesc(this.tr('settings.frontmatterDesc'))
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includeFrontmatter)
                .onChange(async (value) => {
                    this.plugin.settings.includeFrontmatter = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName(this.tr('settings.srs'))
            .setDesc(this.tr('settings.srsDesc'))
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.enableSRSSupport)
                    .onChange(async value => {
                        this.plugin.settings.enableSRSSupport = value;
                        await this.plugin.saveSettings();
                    })
            );

        // --- Color Mapping Section ---
        containerEl.createEl('hr');

        containerEl.createEl('h3', {text: this.tr('settings.colorMapping')});
        containerEl.createEl('p', {
            text: this.tr('settings.colorMappingDesc'),
            attr: {style: 'color: var(--text-muted);'}
        });

        const mappings = this.plugin.settings.colorMappings;
        if (mappings.length === 0) {
            containerEl.createEl('p', {text: this.tr('settings.noMappings')});
        } else {
            mappings.forEach((mapping, index) => {
                this.addColorMappingSetting(containerEl, mapping, index);
            });
        }

        new Setting(containerEl)
            .setName(this.tr('settings.addMapping'))
            .setDesc(this.tr('settings.addMappingDesc'))
            .addButton(btn => btn
                .setButtonText(this.tr('settings.addBtn'))
                .onClick(async () => {
                    this.plugin.settings.colorMappings.push({
                        signedColor: 0,
                        calloutType: 'note',
                        calloutTitle: '',
                        enabled: true,
                    });
                    await this.plugin.saveSettings();
                    this.display();
                }));

        new Setting(containerEl)
            .setName(this.tr('settings.reset'))
            .setDesc(this.tr('settings.resetDesc'))
            .addButton(btn => btn
                .setButtonText(this.tr('settings.resetBtn'))
                .setWarning()
                .onClick(async () => {
                    this.plugin.settings.colorMappings = [
                        { signedColor: -11184811, calloutType: "cite", calloutTitle: "", enabled: true },
                        { signedColor: -2029999361, calloutType: "quote", calloutTitle: "", enabled: true },
                        { signedColor: -2013331371, calloutType: "note", calloutTitle: "", enabled: true },
                        { signedColor: -2013294080, calloutType: "warning", calloutTitle: "", enabled: true },
                        { signedColor: -2013266176, calloutType: "important", calloutTitle: "", enabled: true },
                        { signedColor: -1543340033, calloutType: "info", calloutTitle: "", enabled: true },
                        { signedColor: -1525467669, calloutType: "tip", calloutTitle: "", enabled: true },
                    ];
                    await this.plugin.saveSettings();
                    this.display();
                }));
    }

    private addColorMappingSetting(containerEl: HTMLElement, mapping: ColorMapping, index: number): void {
        const hexColor = integerToRGBA(mapping.signedColor).slice(0, 6);

        const setting = new Setting(containerEl);

        // Color preview + hex
        setting.setName(createFragment((frag) => {
            const colorBox = frag.createEl('span', {
                attr: {
                    style: `display: inline-block; width: 16px; height: 16px; border-radius: 3px; ` +
                           `background-color: #${hexColor}; border: 1px solid var(--background-modifier-border); ` +
                           `vertical-align: middle; margin-right: 8px;`
                }
            });
            frag.appendText(`#${hexColor}`);
        }));

        setting.setDesc(`${this.tr('settings.colorCodeDesc')} ${mapping.signedColor}`);

        // Callout type
        setting.addText(text => text
            .setPlaceholder(this.tr('settings.calloutTypePlaceholder'))
            .setValue(mapping.calloutType)
            .onChange(async (value) => {
                this.plugin.settings.colorMappings[index].calloutType = value;
                await this.plugin.saveSettings();
            }));

        // Callout title
        setting.addText(text => text
            .setPlaceholder(this.tr('settings.calloutTitlePlaceholder'))
            .setValue(mapping.calloutTitle || '')
            .onChange(async (value) => {
                this.plugin.settings.colorMappings[index].calloutTitle = value;
                await this.plugin.saveSettings();
            }));

        // Enable toggle
        setting.addToggle(toggle => toggle
            .setValue(mapping.enabled)
            .onChange(async (value) => {
                this.plugin.settings.colorMappings[index].enabled = value;
                await this.plugin.saveSettings();
            }));

        // Remove button
        setting.addExtraButton(btn => btn
            .setIcon('trash')
            .setTooltip(this.tr('settings.removeTooltip'))
            .onClick(async () => {
                this.plugin.settings.colorMappings.splice(index, 1);
                await this.plugin.saveSettings();
                this.display();
            }));
    }

    async updateSettings(settings: Partial<MoonReaderSettings>) {
        Object.assign(this.plugin.settings, settings);
        await this.plugin.saveSettings();
    }
}
