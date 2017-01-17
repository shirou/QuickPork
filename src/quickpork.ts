'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

import {QuickPorkItem, ActionType} from './quick-pork-item';

export class QuickPork {
    private _items: QuickPorkItem[];
    private _plugins: string[];
    private _pluginNames: string;
    private _options: vscode.QuickPickOptions;

    constructor(plugins: string[]) {
        this._plugins = plugins;
        this._pluginNames = plugins.map((p) => {
            return p.slice(p.lastIndexOf(".")+1);
        }).join(",");
        this._options = {
            matchOnDescription: true,
            placeHolder: this._pluginNames,
        };
    }

    open() {
        const plugins = this._plugins.map((p) => {
            return vscode.commands.executeCommand(p);
        });
		this.execute(plugins)
	}

    openWithInput() {
        if (!this._plugins){
            return;
        }
        const options: vscode.InputBoxOptions = {
            placeHolder: "input for " + this._pluginNames,
        }
        vscode.window.showInputBox(options)
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
            const quickItems = <QuickPorkItem[]>items.reduce((inner) => {
                return inner;
            });
            if (quickItems.length === 0){
                vscode.window.showErrorMessage("no result");
                return;
            }
            vscode.window.showQuickPick(
                <QuickPorkItem[]>quickItems,
                this._options)
            .then(item => {
				this.action(item)
            });
        });
    }

	action(item: QuickPorkItem) {
        if (!item) {
            return;
        }
        switch (item.action) {
            case ActionType.OPEN: 
                this.actionOpen(item);
                break;
        }
        /*
        if (fs.lstatSync(item.label).isDirectory()) {
            vscode.commands.executeCommand("vscode.openFolder", {
                uri: item.uri,
                newWindow: false,
            });
            */
	}
    actionOpen(item: QuickPorkItem) {
        if (item.uri) {
            vscode.workspace.openTextDocument(item.uri).then(doc => {
                this.reveal(item, doc);
            });
        } else {
            vscode.workspace.openTextDocument(item.label).then(doc => {
                this.reveal(item, doc);
            });
        }
    }
    reveal(item: QuickPorkItem, doc: vscode.TextDocument) {
        let newSe: vscode.Selection;
        if (item.data && item.data.line) {
            newSe = new vscode.Selection(item.data.line-1, 0, item.data.line-1, 0);
        } else {
            newSe = new vscode.Selection(0, 0, 0, 0);
        }
        vscode.window.showTextDocument(doc)
        .then(() => {
            vscode.window.activeTextEditor.selection = newSe;
            vscode.window.activeTextEditor.revealRange(newSe, vscode.TextEditorRevealType.InCenter)
        });
    }
}
