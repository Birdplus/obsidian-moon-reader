import {App, PluginSettingTab, Setting, Notice} from 'obsidian';
import MoonReader, {MoonReaderSettings} from 'src/main';
import integerToRGBA from './util';
import {ColorMapping} from 'src/types';

export class SettingsTab extends PluginSettingTab {
    plugin: MoonReader;

    constructor(app: App, plugin: MoonReader) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        // --- General Settings ---

        new Setting(containerEl)
            .setName('Book Exports Path')
            .setDesc('This is where your .mrexpt files are stored.')
            .addText(text => text
                .setPlaceholder('Book Exports')
                .setValue(this.plugin.settings.exportsPath)
                .onChange(async (value) => {
                    this.plugin.settings.exportsPath = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Experimental Support for SRS')
            .setDesc(createFragment((frag) => {
                frag.appendText("Enable support for ");
                frag.createEl(
                    "a",
                    {
                        text: "AB1908's new SRS plugin",
                        href: "https://github.com/AB1908/obsidian-spaced-repetition/",
                    },
                    (a) => {
                        a.setAttr("target", "_blank");
                    }
                );
                frag.appendText(
                    ". This will change the output format."
                );
            }))
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.enableSRSSupport)
                    .onChange(async value => await this.updateSettings({enableSRSSupport: value}))
            );

        // --- Spacer ---
        containerEl.createEl('hr');

        containerEl.createEl('h3', {text: 'Color → Callout Mapping'});
        containerEl.createEl('p', {
            text: 'Map each Moon+ Reader highlight color to an Obsidian callout type. ' +
                  'Only enabled mappings will be imported. When you parse an export, ' +
                  'you can also choose which to include.'
        });

        // Color mapping table
        const mappings = this.plugin.settings.colorMappings;
        if (mappings.length === 0) {
            containerEl.createEl('p', {text: 'No color mappings configured. Parse an export first to auto-discover colors.'});
        } else {
            mappings.forEach((mapping, index) => {
                this.addColorMappingSetting(containerEl, mapping, index);
            });
        }

        // Add new mapping button
        new Setting(containerEl)
            .setName('Add color mapping')
            .setDesc('Manually add a color-to-callout mapping')
            .addButton(btn => btn
                .setButtonText('+ Add')
                .onClick(async () => {
                    this.plugin.settings.colorMappings.push({
                        signedColor: 0,
                        calloutType: 'note',
                        enabled: true,
                    });
                    await this.plugin.saveSettings();
                    this.display();
                }));

        // Reset to defaults button
        new Setting(containerEl)
            .setName('Reset to defaults')
            .setDesc('Remove all custom mappings and restore defaults')
            .addButton(btn => btn
                .setButtonText('Reset')
                .setWarning()
                .onClick(async () => {
                    // Keep only the original default mappings
                    this.plugin.settings.colorMappings = [
                        { signedColor: -11184811, calloutType: "cite", enabled: true },
                        { signedColor: -2029999361, calloutType: "quote", enabled: true },
                        { signedColor: -2013331371, calloutType: "note", enabled: true },
                        { signedColor: -2013294080, calloutType: "warning", enabled: true },
                        { signedColor: -2013266176, calloutType: "important", enabled: true },
                        { signedColor: -1543340033, calloutType: "info", enabled: true },
                        { signedColor: -1525467669, calloutType: "tip", enabled: true },
                    ];
                    await this.plugin.saveSettings();
                    this.display();
                }));
    }

    private addColorMappingSetting(containerEl: HTMLElement, mapping: ColorMapping, index: number): void {
        const hexColor = integerToRGBA(mapping.signedColor).slice(0, 6);
        
        const setting = new Setting(containerEl);

        // Color preview box (via HTML fragment)
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

        setting.setDesc(`Moon+ Reader color code: ${mapping.signedColor}`);

        // Callout type input
        setting.addText(text => text
            .setPlaceholder('callout type')
            .setValue(mapping.calloutType)
            .onChange(async (value) => {
                this.plugin.settings.colorMappings[index].calloutType = value;
                await this.plugin.saveSettings();
            }));

        // Enabled toggle
        setting.addToggle(toggle => toggle
            .setValue(mapping.enabled)
            .onChange(async (value) => {
                this.plugin.settings.colorMappings[index].enabled = value;
                await this.plugin.saveSettings();
            }));

        // Remove button
        setting.addExtraButton(btn => btn
            .setIcon('trash')
            .setTooltip('Remove this mapping')
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
