'use strict';
import * as vscode from 'vscode';
const spawn = require('child_process').spawnSync;
import * as path from 'path';

import * as util from './utils';

import {QuickPorkItem, ActionType, ItemType} from './quick-pork-item';

export function activateSearch(context: vscode.ExtensionContext, command: string): vscode.Disposable {
    const s = new Searcher(command);

    return vscode.commands.registerCommand('extension.quickPork.plugins.search', (input) => {
		  return s.fetch(input);
    });
}

class Searcher {
   static description = "search";

    private _items: QuickPorkItem[];
    private _command: string;

    constructor(command: string) {
        this._items = [];
        this._command = command;
    }

    public fetch(arg: string): QuickPorkItem[] {
        const cwd = this.getCwd();
        const args = ["--nocolor", "--nogroup", arg];
        const ret = spawn(this._command, args, {
            cwd: cwd,
            stdio: 'pipe',
            encoding: 'utf-8',
            timeout: 1000, // to be CONST or configurable?
        });
        if (ret.output === null) {
            return [];
        }
        return this.makeItems(this._command, ret.output[1], cwd);
    }

    private getCwd(): string {
        const f = vscode.window.activeTextEditor.document.fileName;
        return path.dirname(f);
    }

    private makeItems(command: string, output: string, cwd: string): QuickPorkItem[] {
        if (command.includes("pt") || command.includes("ag")) {
            return this.parsePlatinumSearcher(output, cwd);
        }
        return [];
    }
    private parsePlatinumSearcher(output: string, cwd: string): QuickPorkItem[] {
        return output.split("\n").map((line):QuickPorkItem => {
            const l = line.split(":");
            if (!l) {
                return null;
            }
            const p = path.join(path.resolve(cwd), l[0]);
            return {
                description: Searcher.description,
                action: ActionType.OPEN,
                type: ItemType.FILE,
                detail: l.slice(2, l.length).join(""),
                label: l[0]+":"+l[1],
                uri: vscode.Uri.parse("file://" + p),
                data: {
                    line: l[1],
                },
            }
        })
        .filter((item) => item !== null);
    }

}
