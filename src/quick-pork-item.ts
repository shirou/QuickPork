'use strict';

import * as vscode from 'vscode';

export enum ActionType {
    OPEN = 1,
}
export enum ItemType {
    FILE = 1,
    FOLDER = 2,
    URI = 3,
    DICTONARY = 4,
    APPLICATION = 5,
}

export interface QuickPorkItem {
    // from vscode.QuickPickItem
    description: string;
    detail?: string;
    label: string;
    // Extentended
    uri?: vscode.Uri;
    action?: ActionType;
    type?: ItemType;
    data?: any;
}
