'use strict';
import * as vscode from 'vscode';


import { activateRecentf } from './recentf';
import { activateBuffers } from './buffers';
import { activateSearch } from './search';
import { QuickPork } from './quickpork';

// currently, no return value
export interface ExtensionInternal {
}

let onExit: vscode.Disposable;

export function activate(context: vscode.ExtensionContext): ExtensionInternal {
    // activate built-in plugin, recentf
    activateRecentf(context, getConfig<string>('recentfiles'));
    activateBuffers(context);
    activateSearch(context, getConfig<string>('search.command'));

    // TODO: should generate automatally.
    const commands = [ 
        {command: "extension.quickPork.open", config: "open.plugins"},
        {command: "extension.quickPork.open.1", config: "open.plugins1"},
        {command: "extension.quickPork.open.2", config: "open.plugins2"},
        {command: "extension.quickPork.open.3", config: "open.plugins3"},
        {command: "extension.quickPork.input", config: "input.plugins"},
        {command: "extension.quickPork.input.1", config: "input.plugins1"},
        {command: "extension.quickPork.input.2", config: "input.plugins2"},
        {command: "extension.quickPork.input.3", config: "input.plugins3"},
    ]
    commands.forEach((c) => {
        const qp = new QuickPork(getConfig<string[]>(c.config));
        if (c.command.includes("open")) {
            context.subscriptions.push(
                vscode.commands.registerCommand(c.command, () => {
                    return qp.open();
                })
            );
        } else {
            context.subscriptions.push(
                vscode.commands.registerCommand(c.command, () => {
                    return qp.openWithInput();
                })
            );
        }
    });

    // for testing purpse
    return {
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