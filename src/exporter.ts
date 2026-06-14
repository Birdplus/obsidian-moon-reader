import {Annotation, ColorMapping} from 'src/types';
import {TFile} from 'obsidian';
import integerToRGBA from "./util";

export function generateOutput(
    listOfAnnotations: Annotation[],
    mrexptTFile: TFile,
    colorMappings: ColorMapping[],
    enableNewExporter: boolean,
): string {
    const sample = listOfAnnotations[0];
    if (!sample) return '';

    // Build a lookup map: signedColor -> calloutType
    const colorToCallout = new Map<number, string>();
    for (const mapping of colorMappings) {
        colorToCallout.set(mapping.signedColor, mapping.calloutType);
    }

    const selectedColors = new Set(colorMappings.map(m => m.signedColor));

    let output = `---
path: "${mrexptTFile.path}"
title: "${sample.bookName}"
author: 
lastExportedTimestamp: ${mrexptTFile.stat.mtime}
lastExportedID: ${listOfAnnotations[listOfAnnotations.length - 1].indexCount}
tags: 
  - "review/book"
---

`;

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
    colorToCallout: Map<number, string>,
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
        // Look up the mapped callout type, fall back to hex color
        const calloutType = colorToCallout.get(signedColor) || integerToRGBA(signedColor).slice(0, 6);
        
        if (highlight.includes("\n")) {
            highlight = highlight.replaceAll("\n", "\n> ");
        }
        
        let result = `> [!${calloutType}]\n`;
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
