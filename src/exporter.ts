import {Annotation, ColorMapping} from 'src/types';
import {TFile} from 'obsidian';
import integerToRGBA from "./util";

export function generateOutput(
    listOfAnnotations: Annotation[],
    mrexptTFile: TFile,
    colorMappings: ColorMapping[],
    enableNewExporter: boolean,
    includeFrontmatter: boolean,
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
            output += `${template(annotation, enableNewExporter, colorToCallout)}\n`;
        }
    }

    return output;
}

function template(
    annotation: Annotation,
    enableNewExporter: boolean,
    colorToCallout: Map<number, { type: string; title: string }>,
) {
    let {indexCount, highlightText: highlight, noteText: note, signedColor} = annotation;

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
        
        // Build callout header: [!type] or [!type] Title
        let calloutHeader = `> [!${calloutType}]`;
        if (calloutTitle) {
            calloutHeader += ` ${calloutTitle}`;
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
