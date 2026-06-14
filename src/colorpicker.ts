import { App, Modal, Setting } from 'obsidian';
import integerToRGBA from './util';
import { ColorMapping } from './types';

/**
 * Multi-select modal for choosing which colors/callouts to import.
 * Shows each Moon+ Reader color with its mapped Obsidian callout type.
 * Press Shift+Enter or click "Import Selected" to confirm.
 */
export class ColorPicker extends Modal {
    private mappings: ColorMapping[];
    private selectedColors: Set<number>;
    private resolve: (value: ColorMapping[]) => void;
    private reject: (reason?: string) => void;
    private submitted: boolean;

    constructor(app: App, mappings: ColorMapping[]) {
        super(app);
        this.mappings = mappings;
        // Pre-select enabled mappings
        this.selectedColors = new Set(
            mappings.filter(m => m.enabled).map(m => m.signedColor)
        );
        this.submitted = false;
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Select colors to import' });

        contentEl.createEl('p', {
            text: 'Choose which colors to import. Click the toggle to include/exclude each color.',
            attr: { style: 'color: var(--text-muted); font-size: 0.9em; margin-bottom: 16px;' }
        });

        // Build a checkbox for each mapping
        for (const mapping of this.mappings) {
            this.addMappingRow(contentEl, mapping);
        }

        // Bottom buttons
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Select All')
                .onClick(() => {
                    this.mappings.forEach(m => this.selectedColors.add(m.signedColor));
                    this.refreshUI();
                }))
            .addButton(btn => btn
                .setButtonText('Deselect All')
                .onClick(() => {
                    this.selectedColors.clear();
                    this.refreshUI();
                }))
            .addButton(btn => btn
                .setButtonText('Import Selected')
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

        // Callout type and description
        setting.setDesc(`→ [!${mapping.calloutType}]`);

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
        // Re-render the modal body
        this.onOpen();
    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty();

        if (!this.submitted) {
            // User pressed Escape — return selected items if any
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
