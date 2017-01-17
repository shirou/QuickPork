'use strict';

import * as vscode from 'vscode';

import {QuickPorkItem, ActionType, ItemType} from './quick-pork-item';

let deactivateFunc: () => boolean;

export function activateBuffers(context: vscode.ExtensionContext): Buffers {
    const bf = new Buffers();

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.quickPork.plugins.buffers', () => {
            return bf.fetch();
        }),
    );

    return bf; // for testing purpose
}

class Buffers {
    static description = "buffers";

    constructor() {
    }

    public fetch(): QuickPorkItem[] {
        let items = [];
        vscode.window.visibleTextEditors.forEach((editor) => {
            items.push({
                description: Buffers.description,
                uri: editor.document.uri,
                label: editor.document.fileName,
                action: ActionType.OPEN,
                type: ItemType.FILE,
            });
        });
        return items;
    }
}

export function deactivate() {
}
