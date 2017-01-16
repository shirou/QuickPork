'use strict';
import * as vscode from 'vscode';


import { activateRecentf } from './recentf';
import { activateBuffers } from './buffers';
import { QuickPork } from './quickpork';

export interface ExtensionInternal {
    QuickPork: QuickPork,
}

let onExit: vscode.Disposable;

export function activate(context: vscode.ExtensionContext): ExtensionInternal {
    const qp = new QuickPork(getConfig<string[]>('plugins'));

    // activate built-in plugin, recentf
    activateRecentf(context, getConfig<string>('recentfiles'));
    activateBuffers(context);

    context.subscriptions.push(
        vscode.commands.registerCommand("extension.quickPork.open", () => {
            return qp.open();
        }),
    );

     // for testing purpse
    return {
        QuickPork: qp,
    };
}

export function deactivate() {
    if (onExit) {
        onExit.dispose();
        onExit = undefined;
    }
}

function config() {
    return vscode.workspace.getConfiguration('quickPork');
}

function getConfig<T>(section: string, defaults?: T) {
    return config().get<T>(section, defaults);
}