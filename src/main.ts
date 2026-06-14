import { Notice, Plugin, TFolder, TFile, TAbstractFile } from 'obsidian';
import { ExportSelecter } from 'src/suggester';
import { parse } from "src/parser";
import { generateOutput } from 'src/exporter';
import { SettingsTab } from './settings';
import { ColorPicker } from 'src/colorpicker';
import { ColorMapping } from 'src/types';
import integerToRGBA from './util';

export interface MoonReaderSettings {
    exportsPath: string;
    enableSRSSupport: boolean;
    colorMappings: ColorMapping[];
}

const DEFAULT_COLOR_MAPPINGS: ColorMapping[] = [
    // Default Moon+ Reader highlight colors mapped to Obsidian callouts
    // These will be populated from the first real import; starting with some sensible defaults
    { signedColor: -11184811, calloutType: "cite", enabled: true },    // Grey bookmarks/chapters
    { signedColor: -2029999361, calloutType: "quote", enabled: true }, // Blue-ish
    { signedColor: -2013331371, calloutType: "note", enabled: true },  // Purple-ish
    { signedColor: -2013294080, calloutType: "warning", enabled: true }, // Orange-ish
    { signedColor: -2013266176, calloutType: "important", enabled: true }, // Another
    { signedColor: -1543340033, calloutType: "info", enabled: true },  // Green-ish
    { signedColor: -1525467669, calloutType: "tip", enabled: true },   // Pink-ish
];

const MOONREADER_DEFAULT_SETTINGS: MoonReaderSettings = {
    exportsPath: 'Book Exports',
    enableSRSSupport: false,
    colorMappings: DEFAULT_COLOR_MAPPINGS,
}

export default class MoonReader extends Plugin {
    settings: MoonReaderSettings;

    async onload() {
        await this.loadSettings();

        this.addRibbonIcon('book', 'Moon Reader', async () => await this.start());

        this.addCommand({
            id: 'parse-exports',
            name: 'Parse an export',
            editorCallback: async () =>
                await this.start()
        });
        this.addSettingTab(new SettingsTab(this.app, this));
    }

    async start() {
        const currentTFile = this.app.workspace.getActiveFile();
        if (!currentTFile) {
            new Notice("No active file!");
            return;
        }
        const rootPath: string = this.settings.exportsPath;
        const exportTFolder: TAbstractFile = this
            .app
            .vault
            .getAbstractFileByPath(rootPath);
        let exportedFiles: TFile[];
        if (exportTFolder instanceof TFolder) {
            exportedFiles = exportTFolder
                .children
                ?.filter(
                    (t) => (t instanceof TFile) && t.basename && t.extension == `mrexpt`
                )
                .map(t => t as TFile);
        } else {
            //sanity check
            new Notice("Invalid Folder Path");
            return;
        }
        if (!exportedFiles.length) {
            new Notice("Folder does not have any Moon+ Reader exports!");
            return;
        }
        const suggesterModal = new ExportSelecter(this.app, exportedFiles);
        const mrexptChoice = await suggesterModal.openAndGetValue().catch(e => { new Notice("Prompt cancelled"); }) as TFile;
        if (!mrexptChoice) {
            return;
        }
        const parsedOutput = parse(await this.app.vault.read(mrexptChoice));
        if (!parsedOutput || parsedOutput.length === 0) {
            new Notice("Nothing added!");
            return;
        }

        // Discover all colors in this export
        const colorsInFile = new Set<number>();
        parsedOutput.forEach(t => colorsInFile.add(t.signedColor));

        // Auto-add any discovered colors that aren't yet in the mapping
        let mappingsChanged = false;
        for (const color of colorsInFile) {
            if (!this.settings.colorMappings.some(m => m.signedColor === color)) {
                this.settings.colorMappings.push({
                    signedColor: color,
                    calloutType: "note",
                    enabled: true,
                });
                mappingsChanged = true;
            }
        }
        if (mappingsChanged) {
            await this.saveSettings();
        }

        // Filter mappings to only those present in this file
        const relevantMappings = this.settings.colorMappings.filter(
            m => colorsInFile.has(m.signedColor)
        );

        // Show multi-select color picker with callout previews
        const colorModal = new ColorPicker(this.app, relevantMappings);
        const selectedMappings = await colorModal.openAndGetValue()
            .catch(() => null) as ColorMapping[] | null;
        
        if (!selectedMappings || selectedMappings.length === 0) {
            new Notice("No colors selected!");
            return;
        }

        // Update enabled states from user's selection
        for (const mapping of this.settings.colorMappings) {
            mapping.enabled = selectedMappings.some(sm => sm.signedColor === mapping.signedColor);
        }
        await this.saveSettings();

        // Generate output with mapped callouts
        const output = generateOutput(
            parsedOutput,
            mrexptChoice,
            selectedMappings,
            this.settings.enableSRSSupport,
        );

        await this.app.vault.append(currentTFile, output);
        new Notice(`Imported ${parsedOutput.filter(
            a => selectedMappings.some(m => m.signedColor === a.signedColor)
        ).length} annotations (${selectedMappings.length} colors)`);
    }

    async loadSettings() {
        this.settings = Object.assign({}, MOONREADER_DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
