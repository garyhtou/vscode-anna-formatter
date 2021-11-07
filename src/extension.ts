// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "anna-formatter" is now active!');

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('anna-formatter.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from anna-formatter!');
	// });

	// context.subscriptions.push(disposable);

	vscode.languages.registerDocumentFormattingEditProvider('anna', {
		provideDocumentFormattingEdits(
			document: vscode.TextDocument
		): vscode.TextEdit[] {
			var maxLabelLength: number = 0;
			for (var i = 0; i < document.lineCount; i++) {
				const line = document.lineAt(i);
				const text = line.text;
				const labelRegexResult = text.match(/(\s*)([a-zA-Z0-9_]+)(:)/);
				if (labelRegexResult) {
					const label = labelRegexResult[2];
					maxLabelLength = Math.max(maxLabelLength, label.length + 1); // + 1 for the colon
				}
			}

			maxLabelLength += maxLabelLength % 2 === 0 ? 2 : 3; // add padding and make it even

			const edits: vscode.TextEdit[] = [];
			for (var i = 0; i < document.lineCount; i++) {
				const line = document.lineAt(i);

				// Clear whitespace lines
				if (line.isEmptyOrWhitespace) {
					edits.push(new vscode.TextEdit(line.range, ''));
					continue;
				}

				const text = line.text;
				const labelRegexResult = text.match(/(^\s*)([a-zA-Z0-9_]+)(:)(\s*)(.*)/);

				vscode.window.showInformationMessage(
					`${labelRegexResult ? JSON.stringify(labelRegexResult) : 'null'}`
				);
				if (labelRegexResult) {
					const label = labelRegexResult[2];
					const paddingLen = maxLabelLength - label.length - 1; // - 1 for the colon

					edits.push(
						new vscode.TextEdit(
							line.range,
							label + ':' + ' '.repeat(paddingLen) + labelRegexResult[5]
						)
					);
				} else {
					// no label
					const codeRegexOutput = text.match(/(^\s*)(.*$)/);
					if (codeRegexOutput) {
						const prefixedSpace = codeRegexOutput[1];
						const code = codeRegexOutput[2];
						if (prefixedSpace.length === 0 && code.charAt(0) === '#') {
							// guttered comment
							edits.push(new vscode.TextEdit(line.range, code));
						} else {
							// padded comment/code
							const indent = ' '.repeat(maxLabelLength); // create string with `maxLabelLength` spaces
							edits.push(new vscode.TextEdit(line.range, indent + code));
						}
					}
				}
			}

			return edits;

			// const firstLine = document.lineAt(0);
			// if (firstLine.text !== '42') {
			// 	return [vscode.TextEdit.insert(firstLine.range.start, '42\n')];
			// }
		},
	});
}

// this method is called when your extension is deactivated
export function deactivate() {}
