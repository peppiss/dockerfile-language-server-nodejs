/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { TextDocument, Range } from 'vscode-languageserver';
import { Dockerfile } from '../dockerfile';
import { Argument } from '../argument';
import { Flag } from '../flag';
import { Instruction } from '../instruction';

export abstract class ModifiableInstruction extends Instruction {

	private flags: Flag[];

	constructor(document: TextDocument, range: Range, dockerfile: Dockerfile, escapeChar: string, instruction: string, instructionRange: Range) {
		super(document, range, dockerfile, escapeChar, instruction, instructionRange);
	}

	protected abstract stopSearchingForFlags(value: string): boolean;

	public getFlags(): Flag[] {
		if (!this.flags) {
			this.flags = [];
			for (let arg of this.getArguments()) {
				let value = arg.getValue();
				if (this.stopSearchingForFlags(value)) {
					return this.flags;
				} else if (value.indexOf("--") === 0) {
					let range = arg.getRange();
					let index = value.indexOf('=');
					if (index === -1) {
						this.flags.push(new Flag(
							value,
							range,
							value.substring(2),
							Range.create(range.start.line, range.start.character + 2, range.end.line, range.end.character),
							null,
							null)
						);
					} else if (index === value.length - 1) {
						this.flags.push(new Flag(
							value,
							range,
							value.substring(2, index),
							Range.create(range.start.line, range.start.character + 2, range.end.line, range.end.character - 1),
							"",
							Range.create(range.end.line, range.end.character, range.end.line, range.end.character))
						);
					} else {
						this.flags.push(new Flag(
							value,
							range,
							value.substring(2, index),
							Range.create(range.start.line, range.start.character + 2, range.start.line, range.start.character + index),
							value.substring(index + 1),
							Range.create(range.start.line, range.start.character + index + 1, range.end.line, range.end.character))
						);
					}
				}
			}
		}
		return this.flags;
	}

	public getArguments(): Argument[] {
		const args = super.getArguments();
		const flags = this.getFlags();
		if (flags.length === 0) {
			return args;
		}
		for (let i = 0; i < flags.length; i++) {
			args.shift();
		}
		return args;
	}
}
