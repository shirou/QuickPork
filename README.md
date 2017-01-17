# Quick Pork

`Quick Pork` provides usuful Quick Pick utilties.

![QuickPork Demo](https://github.com/shirou/quickpork/raw/master/QuickPork.gif)

In this demo, search from recently used file. And then, search under
that files by using platinum searcher with keyword input.

inspired from [helm](https://github.com/emacs-helm/helm).

## How to use

- `extension.quickPork.open`
  - default: `ctrl+c l`
  - search from recentf and buffer
- `extension.quickPork.input`
  - default: `ctrl+c d`
  - Input keyword and search under current document directory using pt(platinum searcher)
  - You can change command via `quickPork.search.command` config.

## plugins

- recent used file (recentf)
- current using file (buffer)
- string search such as ack, ag, pt (search)

## plugin API

Plugins must return `QuickPorkItem[]`.

QuickPorkItem is defined at `src/quick-pork-item.ts`. It will be
publish at npm and other developers can use this.

QuickPorkItem definition:

```
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
```

## License

Apache 2.0
