'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

import {QuickPorkItem, ActionType} from './quick-pork-item';

export class QuickPork {
    private _items: QuickPorkItem[];
    private _plugins: string[];
    private _options: vscode.QuickPickOptions = { matchOnDescription: true };

    constructor(plugins: string[]) {
        this._plugins = plugins;
    }

    open() {
        const plugins = this._plugins.map((p) => {
            return vscode.commands.executeCommand(p);
        });
		this.execute(plugins)
	}

    openWithInput() {
        vscode.window.showInputBox()
			.then((input)=>{
				const plugins = this._plugins.map((p) => {
					return vscode.commands.executeCommand(p, input);
				});
				this.execute(plugins)
        });
	}

	execute(plugins) {
        Promise.all(plugins)
        .then((items) => {
            const quickItems = items.reduce((inner) => {
                return inner;
            });
            vscode.window.showQuickPick(
                <QuickPorkItem[]>quickItems,
                this._options)
            .then(item => {
				this.action(item)
            });
        });
    }

	action(item) {
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
	}
}
