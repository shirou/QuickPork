'use strict';
import * as vscode from 'vscode';
import fs = require('fs');
import path = require('path');
import readline = require('readline');
import * as proc from 'process';

export function activateRecentf(context: vscode.ExtensionContext, filepath: string): vscode.Disposable {
    return vscode.commands.registerCommand('extension.quickPork.plugins.recentf', () => {
        vscode.window.showInputBox()
        .then(input=>{
            console.log(input);
        });
    });
}


