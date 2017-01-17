# Quick Pork

`Quick Pork` provides usuful Quick Pick utilties.

![QuickPork Demo](https://github.com/shirou/quickpork/raw/master/QuickPork.gif)

In this demo, search from recently used file. And then, search under that files by using platinum searcher with keyword input.

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

## License

Apache 2.0
