'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as proc from 'process';

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

    private resolve(filePath: string): string {
        if (!filePath) {
            return "";
        }
        const p = filePath.replace("~", this.home());
        return path.normalize(path.resolve(p));
    }

    private home(): string{
        return proc.env[(proc.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
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
