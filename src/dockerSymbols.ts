/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {
	TextDocument, SymbolInformation, SymbolKind, Range
} from 'vscode-languageserver';
import { DockerfileParser } from './parser/dockerfileParser';

export class DockerSymbols {

	private createSymbolInformation(name: string, textDocumentURI: string, range: Range, kind: SymbolKind) {
		return {
			name: name,
			location: {
				uri: textDocumentURI,
				range: range
			},
			kind: kind
		};
	}

	public parseSymbolInformation(document: TextDocument, textDocumentURI: string): SymbolInformation[] {
		let parser = new DockerfileParser();
		let dockerfile = parser.parse(document);
		let directive = dockerfile.getDirective();
		let symbols: SymbolInformation[] = [];
		if (directive !== null) {
			symbols.push(this.createSymbolInformation(directive.getName(), textDocumentURI, directive.getNameRange(), SymbolKind.Property));
		}
		for (let instruction of dockerfile.getInstructions()) {
			symbols.push(this.createSymbolInformation(instruction.getInstruction(), textDocumentURI, instruction.getInstructionRange(), SymbolKind.Function));
		}
		return symbols;
	}

}
