import {Annotation} from 'src/types';
import {parseMrexptContents} from "./parseMrexptContents";

/**
 * Parse the content of a .mrexpt file into a list of Annotations.
 * 
 * @param content The raw text content of the .mrexpt file
 * @returns Array of parsed annotations
 */
export function parse(content: string): Annotation[] {
    return parseMrexptContents(content);
}
