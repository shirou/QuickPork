'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

import {QuickPorkItem, ActionType} from './quick-pork-item';

export class QuickPork {
    private _items: QuickPorkItem[];
    private _plugins: string[];

    constructor(plugins: string[]) {
        this._plugins = plugins;
    }

    open() {
        const plugins = this._plugins.map((p) => {
            return vscode.commands.executeCommand(p);
        });

        Promise.all(plugins)
        .then((items) => {
            const quickItems = items.reduce((inner) => {
                return inner;
            });
            vscode.window.showQuickPick(<QuickPorkItem[]>quickItems)
            .then(item => {
                if (!item) {
                    return;
                }
                if (fs.lstatSync(item.label).isDirectory()) {
                    vscode.commands.executeCommand("vscode.openFolder", {
                        uri: item.uri,
                        newWindow: false,
                    });

                }else{
                    vscode.commands.executeCommand("extension.quickOpen", item.label);
                }

            });
        });
     }
}

