import {expect, test} from "@jest/globals";
import {generateOutput} from "../exporter";
import {
	colorFilter,
	listOfAnnotations,
	mrexptTFile
} from "./json/howtotakenotes-success/exporter.generateOutput.input-2022-11-19 14-04-30.json";
import {Annotation, ColorMapping} from "../types";
import {TFile} from "obsidian";

const colorMappings: ColorMapping[] = [
	{ signedColor: colorFilter, calloutType: "cite", calloutTitle: "", enabled: true },
];

test("exporter.generateOutput with frontmatter", () => {
	const list = Array.from(listOfAnnotations);
	expect(generateOutput(list as Annotation[], mrexptTFile as unknown as TFile, colorMappings, false, true)).toMatchSnapshot();
});

test("exporter.generateOutput without frontmatter", () => {
	const list = Array.from(listOfAnnotations);
	expect(generateOutput((list as Annotation[]), ((mrexptTFile as unknown) as TFile), colorMappings, false, false)).toMatchInlineSnapshot(`
"> [!cite]
> INTRODUCTION

> [!cite]
> 1 Everything You Need to Know
> ***
> ##

> [!cite]
> 2 Everything You Need to Do
> 
> ***
> ##

> [!cite]
> 3 Everything You Need to Have
> ***
> ##

> [!cite]
> 4 A Few Things to Keep in Mind
> ***
> ##

> [!cite]
> 5 Writing Is the Only Thing That Matters
> ***
> ##

> [!cite]
> 6 Simplicity Is Paramount
> ***
> ##

> [!cite]
> 7 Nobody Ever Starts From Scratch
> ***
> ##

> [!cite]
> 8 Let the Work Carry You Forward
> ***
> ##

> [!cite]
> 9 Separate and Interlocking Tasks
> ***
> ##

> [!cite]
> 10 Read for Understanding
> ***
> ##

> [!cite]
> 11 Take Smart Notes
> ***
> ##

> [!cite]
> 12 Develop Ideas
> ***
> ##

> [!cite]
> 13 Share Your Insight
> ***
> ##

> [!cite]
> 14 Make It a Habit
> ***
> ##

> [!cite]
> 1.1 Good Solutions are Simple – and Unexpected
> ***
> ###

> [!cite]
> 1.2 The Slip-box
> ***
> ###

> [!cite]
> 1.3 The slip-box manual
> ***
> ###

"
`);
});

test("exporter generateOutput with callout title", () => {
	const list = Array.from(listOfAnnotations);
	const mappingsWithTitle: ColorMapping[] = [
		{ signedColor: colorFilter, calloutType: "cite", calloutTitle: "Chapter", enabled: true },
	];
	const output = generateOutput(list as Annotation[], mrexptTFile as unknown as TFile, mappingsWithTitle, false, false);
	expect(output).toContain("[!cite] Chapter");
	expect(output).not.toContain("---");
});

test("exporter new experimental output", () => {
	const list = Array.from(listOfAnnotations);
	expect(generateOutput((list as Annotation[]), ((mrexptTFile as unknown) as TFile), colorMappings, true, true)).toMatchInlineSnapshot(`
"---
path: "Book Exports/Sönke Ahrens - How to Take Smart Notes_ One Simple Technique to Boost Writing,  Learning and Thinking-Sönke Ahrens (2022).mrexpt"
title: "How to Take Smart Notes. One Simple Technique to Boost Writing,  Learning and Thinking"
author: 
lastExportedTimestamp: 1665321164166
lastExportedID: 12623
tags: 
  - "review/book"
---

> [!notes] 12585
> INTRODUCTION
> ***
> 

## 1 Everything You Need to Know

## 2 Everything You Need to Do: 

## 3 Everything You Need to Have

## 4 A Few Things to Keep in Mind

## 5 Writing Is the Only Thing That Matters

## 6 Simplicity Is Paramount

## 7 Nobody Ever Starts From Scratch

## 8 Let the Work Carry You Forward

## 9 Separate and Interlocking Tasks

## 10 Read for Understanding

## 11 Take Smart Notes

## 12 Develop Ideas

## 13 Share Your Insight

## 14 Make It a Habit

### 1.1 Good Solutions are Simple – and Unexpected

### 1.2 The Slip-box

### 1.3 The slip-box manual

"
`);
});
