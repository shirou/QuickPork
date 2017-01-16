'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as proc from 'process';

import {QuickPorkItem, ActionType, ItemType} from './quick-pork-item';

let deactivateFunc: () => boolean;

export function activateRecentf(context: vscode.ExtensionContext, filepath: string): Recentf {
    const rf = new Recentf(filepath);

    deactivateFunc = (() => {
        return rf.close();
    });

    context.subscriptions.push(
    	vscode.workspace.onDidOpenTextDocument(e => {
            rf.append(e);
        }),
        vscode.commands.registerCommand('extension.quickPork.plugins.recentf', () => {
            return rf.fetch();
        }),
    );

    return rf; // for testing purpose
}

class Recentf {
    static description = "recentf";

    private _items: QuickPorkItem[];
    private filepath: string;
    
    constructor(filepath: string) {
        this._items = [];
        this.filepath = this.resolve(filepath);
        this.readRecentFile(this.filepath);
    }

    /**
     * append file path
    */
    public append(e: vscode.TextDocument){
        // check if already exists
        for(let item of this._items) {
            if (item.label && item.label === e.fileName){
                return;
            }
        }
        this.push(e.fileName, e.uri);
    }
    /**
     * append file path to internal memory.
     */
    private push(filePath: string, uri?: vscode.Uri) {
        this._items.push({
                description: Recentf.description,
                uri: uri,
                label: filePath,
                action: ActionType.OPEN,
                type: ItemType.FILE,
        });
    }

    /**
     * dump to the file.
     */
    public close(): boolean {
        const file = fs.createWriteStream(this.filepath);
        this._items.forEach(item => {
            file.write(item.label + "\n");
        });
        file.end();
        return true;
    }

    /**
     * read from the file.
     */
    private readRecentFile(filepath: string) {
        console.log(filepath);
        if (fs.existsSync(filepath) === false) {
            return;
        }
        const rl = readline.createInterface({
            input: fs.createReadStream(filepath),
        });
        rl.on('line', (line) => {
            // no check dup check.
            this.push(line);
        });
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
        return this._items;
    }
}

export function deactivate() {
    if (deactivateFunc) {
        deactivateFunc();
        deactivateFunc = undefined;
    }
}
