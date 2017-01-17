'use strict';
import * as vscode from 'vscode';

export function activateBrew(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.commands.registerCommand('extension.quickPork.plugins.brew', (input) => {
		  console.log("brew", input)
    });
}
