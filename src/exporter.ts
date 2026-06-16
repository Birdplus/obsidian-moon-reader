import {Annotation, ColorMapping} from 'src/types';
import {TFile} from 'obsidian';
import integerToRGBA from "./util";

/**
 * Convert a Moon+ Reader millisecond timestamp to Obsidian date format.
 * "1669300806081" -> "[[2022-11-24]] 22:40"
 */
function formatTimestamp(unixTimestamp: string): string {
    const ms = parseInt(unixTimestamp, 10);
    if (isNaN(ms)) return '';
    const date = new Date(ms);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `[[${y}-${m}-${d}]] ${h}:${min}`;
}

export function generateOutput(
    listOfAnnotations: Annotation[],
    mrexptTFile: TFile,
    colorMappings: ColorMapping[],
    enableNewExporter: boolean,
    includeFrontmatter: boolean,
    showTimestampInCallout: boolean,
): string {
    const sample = listOfAnnotations[0];
    if (!sample) return '';

    // Build lookup maps
    const colorToCallout = new Map<number, { type: string; title: string }>();
    for (const mapping of colorMappings) {
        colorToCallout.set(mapping.signedColor, {
            type: mapping.calloutType,
            title: mapping.calloutTitle || '',
        });
    }

    const selectedColors = new Set(colorMappings.map(m => m.signedColor));

    let output = '';

    // Optional frontmatter
    if (includeFrontmatter) {
        output += `---
path: "${mrexptTFile.path}"
title: "${sample.bookName}"
author: 
lastExportedTimestamp: ${mrexptTFile.stat.mtime}
lastExportedID: ${listOfAnnotations[listOfAnnotations.length - 1].indexCount}
tags: 
  - "review/book"
---

`;
    }

    // Filter annotations to only selected colors
    const filteredAnnotations = listOfAnnotations.filter(
        a => selectedColors.has(a.signedColor)
    );

    for (const annotation of filteredAnnotations) {
        if (annotation.highlightText || annotation.noteText) {
            output += `${template(annotation, enableNewExporter, colorToCallout, showTimestampInCallout)}\n`;
        }
    }

    return output;
}

function template(
    annotation: Annotation,
    enableNewExporter: boolean,
    colorToCallout: Map<number, { type: string; title: string }>,
    showTimestampInCallout: boolean,
) {
    let {indexCount, highlightText: highlight, noteText: note, signedColor, unixTimestamp} = annotation;

    if (enableNewExporter) {
        if (note.trim() === "#") {
            return `# ${highlight.replace("\n", ": ")}\n`;
        }
        if (note.trim() === "##") {
            return `## ${highlight.replace("\n", ": ")}\n`;
        }
        if (note.trim() === "###") {
            return `### ${highlight.replace("\n", ": ")}\n`;
        }
        return `> [!notes] ${indexCount}
${highlight.split("\n").map(t=>`> ${t}`).join("\n")}
> ***
${note.split("\n").map(t=>`> ${t}`).join("\n")}
`;
    } else {
        // Look up the mapped callout type + title, fall back to hex color
        const mapped = colorToCallout.get(signedColor);
        const calloutType = mapped?.type || integerToRGBA(signedColor).slice(0, 6);
        const calloutTitle = mapped?.title || '';
        
        if (highlight.includes("\n")) {
            highlight = highlight.replaceAll("\n", "\n> ");
        }
        
        // Build callout header: [!type] or [!type] Title or [!type] [[date]] time
        let calloutHeader = `> [!${calloutType}]`;
        const parts: string[] = [];
        if (calloutTitle) {
            parts.push(calloutTitle);
        }
        if (showTimestampInCallout && unixTimestamp) {
            parts.push(formatTimestamp(unixTimestamp));
        }
        if (parts.length > 0) {
            calloutHeader += ' ' + parts.join(' ');
        }
        
        let result = `${calloutHeader}\n`;
        result += `> ${highlight}\n`;
        if (note && note.trim()) {
            result += `> ***\n`;
            const noteLines = note.split("\n");
            for (const line of noteLines) {
                result += `> ${line}\n`;
            }
        }
        return result;
    }
}
