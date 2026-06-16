import { App, Modal, Setting } from 'obsidian';
import integerToRGBA from './util';
import { ColorMapping } from './types';
import { t, Lang } from './strings';

/**
 * Multi-select modal for choosing which colors/callouts to import.
 * Shows each Moon+ Reader color with its mapped Obsidian callout type.
 */
export class ColorPicker extends Modal {
    private mappings: ColorMapping[];
    private selectedColors: Set<number>;
    private resolve: (value: ColorMapping[]) => void;
    private reject: (reason?: string) => void;
    private submitted: boolean;
    private lang: Lang;

    constructor(app: App, mappings: ColorMapping[], lang: Lang = 'en') {
        super(app);
        this.mappings = mappings;
        this.lang = lang;
        this.selectedColors = new Set(
            mappings.filter(m => m.enabled).map(m => m.signedColor)
        );
        this.submitted = false;
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: t(this.lang, 'picker.title') });

        contentEl.createEl('p', {
            text: t(this.lang, 'picker.desc'),
            attr: { style: 'color: var(--text-muted); font-size: 0.9em; margin-bottom: 16px;' }
        });

        // Build a checkbox for each mapping
        for (const mapping of this.mappings) {
            this.addMappingRow(contentEl, mapping);
        }

        // Bottom buttons
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText(t(this.lang, 'picker.selectAll'))
                .onClick(() => {
                    this.mappings.forEach(m => this.selectedColors.add(m.signedColor));
                    this.refreshUI();
                }))
            .addButton(btn => btn
                .setButtonText(t(this.lang, 'picker.deselectAll'))
                .onClick(() => {
                    this.selectedColors.clear();
                    this.refreshUI();
                }))
            .addButton(btn => btn
                .setButtonText(t(this.lang, 'picker.importSelected'))
                .setCta()
                .onClick(() => {
                    this.submitted = true;
                    const selected = this.mappings.filter(
                        m => this.selectedColors.has(m.signedColor)
                    );
                    this.resolve(selected);
                    this.close();
                }));
    }

    private addMappingRow(containerEl: HTMLElement, mapping: ColorMapping): void {
        const hexColor = integerToRGBA(mapping.signedColor).slice(0, 6);
        const isSelected = this.selectedColors.has(mapping.signedColor);

        const setting = new Setting(containerEl);

        // Color preview
        setting.setName(createFragment((frag) => {
            const colorBox = frag.createEl('span', {
                attr: {
                    style: `display: inline-block; width: 14px; height: 14px; border-radius: 3px; ` +
                           `background-color: #${hexColor}; border: 1px solid var(--background-modifier-border); ` +
                           `vertical-align: middle; margin-right: 8px;`
                }
            });
            frag.appendText(`#${hexColor}`);
        }));

        // Callout type and title description
        const calloutDisplay = mapping.calloutTitle
            ? `→ [!${mapping.calloutType}] ${mapping.calloutTitle}`
            : `→ [!${mapping.calloutType}]`;
        setting.setDesc(calloutDisplay);

        // Toggle
        setting.addToggle(toggle => toggle
            .setValue(isSelected)
            .onChange((value) => {
                if (value) {
                    this.selectedColors.add(mapping.signedColor);
                } else {
                    this.selectedColors.delete(mapping.signedColor);
                }
            }));
    }

    private refreshUI(): void {
        this.onOpen();
    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty();

        if (!this.submitted) {
            const selected = this.mappings.filter(
                m => this.selectedColors.has(m.signedColor)
            );
            if (selected.length > 0) {
                this.resolve(selected);
            } else {
                this.reject?.("No colors selected");
            }
        }
    }

    async openAndGetValue(): Promise<ColorMapping[]> {
        return new Promise((resolve, reject) => {
            try {
                this.resolve = resolve;
                this.reject = reject;
                this.open();
            } catch (e) {
                console.log(e);
                reject(String(e));
            }
        });
    }
}
