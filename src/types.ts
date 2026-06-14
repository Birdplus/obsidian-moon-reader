export class Annotation {
    //todo: check types
    indexCount: number;
    bookName: string;
    bookPath: string;
    lowerCasePath: string;
    sectionNumber: number;
    placeholder1: string;
    location: string;
    characterCount: number;
    signedColor: number;
    unixTimestamp: string;
    bookmarkText: string;
    noteText: string;
    highlightText: string;
    annotType1: number;
    annotType2: number;
    annotType3: number;
}

/**
 * Maps a Moon+ Reader signed color integer to an Obsidian callout type.
 */
export interface ColorMapping {
    /** The signed 32-bit ARGB color from Moon+ Reader */
    signedColor: number;
    /** The Obsidian callout type, e.g. "note", "quote", "warning" */
    calloutType: string;
    /** Whether this mapping is enabled for import */
    enabled: boolean;
}
