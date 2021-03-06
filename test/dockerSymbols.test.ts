/* --------------------------------------------------------------------------------------------
 * Copyright (c) Remy Suen. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as assert from "assert";

import { TextDocument, SymbolKind } from 'vscode-languageserver';
import { DockerSymbols } from '../src/dockerSymbols';

let uri = "uri://host/Dockerfile.sample";
let symbolsProvider = new DockerSymbols();

function createDocument(content: string): any {
	return TextDocument.create("uri://host/Dockerfile.sample", "dockerfile", 1, content);
}

describe("Dockerfile document symbols", function () {
	describe("no directives", function() {
		it("empty file", function () {
			let document = createDocument("");
			let symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 0);
		});

		it("comment", function () {
			let document = createDocument("#");
			let symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 0);
			
			document = createDocument("# comment");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 0);
		});
	});

	describe("directives", function() {
		it("escape directive", function () {
			let document = createDocument("#escape=`");
			let symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 1);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 7);
		});

		it("space", function () {
			let document = createDocument("# escape=`");
			let symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 2);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 8);

			document = createDocument("#\tescape=`");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 2);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 8);

			document = createDocument("# escape= `");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 2);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 8);

			document = createDocument("# escape=\t`");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 2);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 8);

			document = createDocument("# escape=` ");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 2);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 8);
		});

		it("leading whitespace", function () {
			let document = createDocument(" #escape=`");
			let symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 2);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 8);

			document = createDocument("\t#escape=`");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 2);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 8);

			document = createDocument("# escape\t=\t` ");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 2);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 8);
		});

		it("directive becomes a comment if not at the top", function() {
			let document = createDocument("\r#escape=`");
			let symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 0);

			document = createDocument("\n#escape=`");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 0);

			document = createDocument("\r\n#escape=`");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 0);
		});

		it("invalid directive definition with leading comment", function () {
			let document = createDocument("#\n#escape=`");
			let symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 0);
			
			document = createDocument("#\r#escape=`");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 0);
			
			document = createDocument("#comment\n#escape=`");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 0);
		});

		it("invalid directive definition with nothing", function () {
			let document = createDocument("#escape=");
			let symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 1);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 7);

			document = createDocument("#escape=\r");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 1);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 7);

			document = createDocument("#escape=\n");
			symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "escape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 1);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 7);
		});

		it("invalid directive name", function () {
			let document = createDocument("#eskape=`");
			let symbols = symbolsProvider.parseSymbolInformation(document, uri);
			assert.equal(symbols.length, 1);
			assert.equal(symbols[0].containerName, undefined);
			assert.equal(symbols[0].name, "eskape");
			assert.equal(symbols[0].kind, SymbolKind.Property);
			assert.equal(symbols[0].location.uri, uri);
			assert.equal(symbols[0].location.range.start.line, 0);
			assert.equal(symbols[0].location.range.start.character, 1);
			assert.equal(symbols[0].location.range.end.line, 0);
			assert.equal(symbols[0].location.range.end.character, 7);
		});
	});

	describe("instructions", function() {
		describe("single", function() {
			it("keyword only", function () {
				let document = createDocument("FROM");
				let symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FROM");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 0);
				assert.equal(symbols[0].location.range.end.character, 4);
				
				document = createDocument("FROM\r");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FROM");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 0);
				assert.equal(symbols[0].location.range.end.character, 4);
				
				document = createDocument("FROM\n");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FROM");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 0);
				assert.equal(symbols[0].location.range.end.character, 4);
			});

			it("valid", function () {
				let document = createDocument("FROM node");
				let symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FROM");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 0);
				assert.equal(symbols[0].location.range.end.character, 4);
			});

			it("escaped", function () {
				let document = createDocument("RUN npm install && \\\n\tnpm test");
				let symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "RUN");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 0);
				assert.equal(symbols[0].location.range.end.character, 3);

				document = createDocument("RUN npm install && \\\r\tnpm test");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "RUN");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 0);
				assert.equal(symbols[0].location.range.end.character, 3);

				document = createDocument("RUN npm install && \\\r\n\tnpm test");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "RUN");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 0);
				assert.equal(symbols[0].location.range.end.character, 3);
			});

			it("keyword with escape character", function () {
				let document = createDocument("HEALTHCHECK\\\nNONE");
				let symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "HEALTHCHECKNONE");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);

				document = createDocument("HEALTHCHECK\\\rNONE");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "HEALTHCHECKNONE");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);

				document = createDocument("HEALTHCHECK\\\r\nNONE");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "HEALTHCHECKNONE");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);

				document = createDocument("HEALTHCHECK\\\nNONE ");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "HEALTHCHECKNONE");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);

				document = createDocument("HEALTHCHECK\\\nNONE\r");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "HEALTHCHECKNONE");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);

				document = createDocument("HEALTHCHECK\\\nNONE\n");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "HEALTHCHECKNONE");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);
			});

			it("escape in string", function () {
				let document = createDocument("RUN echo \"\\\\n\"");
				let symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "RUN");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 0);
				assert.equal(symbols[0].location.range.end.character, 3);
			});

			it("escape not with a newline", function () {
				let document = createDocument("FR\\om node");
				let symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FR\\om");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 0);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 0);
				assert.equal(symbols[0].location.range.end.character, 5);
			});

			it("whitespace", function () {
				let document = createDocument("\rFROM node");
				let symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FROM");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 1);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);
				
				document = createDocument("\nFROM node");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FROM");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 1);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);
				
				document = createDocument("\r\nFROM node");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FROM");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 1);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);
				
				document = createDocument("\rFROM node\r");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FROM");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 1);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);
				
				document = createDocument("\nFROM node\n");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FROM");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 1);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);
				
				document = createDocument("\r\nFROM node\r\n");
				symbols = symbolsProvider.parseSymbolInformation(document, uri);
				assert.equal(symbols.length, 1);
				assert.equal(symbols[0].containerName, undefined);
				assert.equal(symbols[0].name, "FROM");
				assert.equal(symbols[0].kind, SymbolKind.Function);
				assert.equal(symbols[0].location.uri, uri);
				assert.equal(symbols[0].location.range.start.line, 1);
				assert.equal(symbols[0].location.range.start.character, 0);
				assert.equal(symbols[0].location.range.end.line, 1);
				assert.equal(symbols[0].location.range.end.character, 4);
			});
		});
	});
});
