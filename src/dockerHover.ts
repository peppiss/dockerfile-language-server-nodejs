/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {
	TextDocument, TextDocumentPositionParams, Hover, Range, Position
} from 'vscode-languageserver';
import { DockerfileParser } from './parser/dockerfileParser';
import { Arg } from './parser/instructions/arg';
import { Env } from './parser/instructions/env';
import { ModifiableInstruction } from './parser/instructions/modifiableInstruction';
import { Onbuild } from './parser/instructions/onbuild';
import { Util, DIRECTIVE_ESCAPE } from './docker';
import { MarkdownDocumentation } from './dockerMarkdown';
import { DockerDefinition } from './dockerDefinition';

export class DockerHover {

	private markdown: MarkdownDocumentation;

	constructor(markdown: MarkdownDocumentation) {
		this.markdown = markdown;
	}

	onHover(document: TextDocument, textDocumentPosition: TextDocumentPositionParams): Hover | null {
		let parser = new DockerfileParser();
		let dockerfile = parser.parse(document);
		let directive = dockerfile.getDirective();

		if (textDocumentPosition.position.line === 0 && directive !== null && directive.getDirective() === DIRECTIVE_ESCAPE) {
			let range = directive.getNameRange();
			if (Util.isInsideRange(textDocumentPosition.position, range)) {
				return this.markdown.getMarkdown(DIRECTIVE_ESCAPE);
			}
		}

		for (let instruction of dockerfile.getInstructions()) {
			for (let variable of instruction.getVariables()) {
				// are we hovering over a variable
				if (Util.isInsideRange(textDocumentPosition.position, variable.getNameRange())) {
					let instructions = dockerfile.getInstructions();
					for (let i = instructions.length - 1; i >= 0; i--) {
						// only look for variables defined before the current instruction
						if (instruction.isAfter(instructions[i]) && instructions[i] instanceof Env) {
							for (let property of (instructions[i] as Env).getProperties()) {
								// check that the names match
								if (property.getName() === variable.getName()) {
									return property.getValue() !== null ? { contents: property.getValue() } : null;
								}
							}
						}
					}
				}
			}
		}

		for (let instruction of dockerfile.getInstructions()) {
			let instructionRange = instruction.getInstructionRange();
			if (Util.isInsideRange(textDocumentPosition.position, instructionRange)) {
				return this.markdown.getMarkdown(instruction.getKeyword());
			}

			if (instruction instanceof Onbuild) {
				// hovering over a trigger instruction of an ONBUILD
				let range = instruction.getTriggerRange();
				if (Util.isInsideRange(textDocumentPosition.position, range)) {
					return this.markdown.getMarkdown(instruction.getTriggerInstruction());
				}
			}

			if (instruction instanceof Arg) {
				// hovering over an argument defined by ARG
				let property = instruction.getProperty();
				if (property && Util.isInsideRange(textDocumentPosition.position, property.getNameRange()) && property.getValue() !== null) {
					return {
						contents: property.getValue()
					};
				}
			}

			if (instruction instanceof Env) {
				// hovering over an argument defined by ENV
				for (let property of instruction.getProperties()) {
					if (Util.isInsideRange(textDocumentPosition.position, property.getNameRange()) && property.getValue() !== null) {
						return {
							contents: property.getValue()
						};
					}
				}
			}

			switch (instruction.getKeyword()) {
				case "HEALTHCHECK":
					let flags = (instruction as ModifiableInstruction).getFlags();
					for (let flag of flags) {
						if (Util.isInsideRange(textDocumentPosition.position, flag.getNameRange())) {
							switch (flag.getName()) {
								case "interval":
									return this.markdown.getMarkdown("HEALTHCHECK_FlagInterval");
								case "retries":
									return this.markdown.getMarkdown("HEALTHCHECK_FlagRetries");
								case "start-period":
									return this.markdown.getMarkdown("HEALTHCHECK_FlagStartPeriod");
								case "timeout":
									return this.markdown.getMarkdown("HEALTHCHECK_FlagTimeout");
							}
							return null;
						}
					}
					break;
				case "ONBUILD":
					if ((instruction as Onbuild).getTriggerInstruction() === "HEALTHCHECK") {
						for (let arg of instruction.getArguments()) {
							let value = arg.getValue().toUpperCase();
							if ((value === "CMD" || value === "NONE") && arg.isBefore(textDocumentPosition.position)) {
								return null;
							}
						}

						for (let arg of instruction.getArguments()) {
							if (Util.isInsideRange(textDocumentPosition.position, arg.getRange())) {
								let value = arg.getValue();
								if (value.indexOf("--interval") === 0) {
									return this.markdown.getMarkdown("HEALTHCHECK_FlagInterval");
								}
								if (value.indexOf("--retries") === 0) {
									return this.markdown.getMarkdown("HEALTHCHECK_FlagRetries");
								}
								if (value.indexOf("--start-period") === 0) {
									return this.markdown.getMarkdown("HEALTHCHECK_FlagStartPeriod");
								}
								if (value.indexOf("--timeout") === 0) {
									return this.markdown.getMarkdown("HEALTHCHECK_FlagTimeout");
								}
							}
						}
					}
					break;

			}
		}

		let property = DockerDefinition.computeVariableDefinition(dockerfile, textDocumentPosition.position);
		if (property && property.getValue() !== null) {
			return { contents: property.getValue() };
		}

		return null;
	}
}
