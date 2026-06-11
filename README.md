# Variable Import/Export

> Export variables to CSV for bulk editing in spreadsheets, then import back.

![Status: Stable](https://img.shields.io/badge/status-stable-green)

**Privacy:** This plugin runs entirely locally. No data is sent to external servers (`networkAccess: { allowedDomains: ["none"] }`).

## Features

- **CSV Export** - Spreadsheet-friendly format for bulk calculations
- **Multi-Mode Support** - All modes appear as separate columns in CSV
- **Selective Export** - Choose specific collections and variables to export
- **Validation Before Import** - Preview exactly what will change before applying
- **Type Support** - Handles colors (hex), numbers, strings, and booleans

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   ```
4. In Figma Desktop: **Plugins → Development → Import plugin from manifest**
5. Select the `manifest.json` file from this folder

## Usage

### Exporting Variables

1. Open the plugin from **Plugins → Development → Variable Import/Export**
2. Select collections and variables to export
3. Export CSV for spreadsheet editing
4. Download the generated CSV files

### Editing in Spreadsheets

1. Open the CSV in Excel, Google Sheets, or Numbers
2. Each mode appears as a separate column (e.g., `Mode: Desktop`, `Mode: Mobile`)
3. Use formulas for bulk calculations:
   - `=B2*1.6` - Calculate line-height as 160% of font size
   - `=B2*1.25` - Scale up by major third ratio
4. Save as CSV

**Important:** Don't modify the `variableId` column - it's used to match variables during import.

### Importing Updated Values

1. Switch to Import mode in the plugin
2. Upload your edited CSV file
3. Review the preview - the plugin shows exactly what will change
4. Click Import to apply changes

## Screenshots

<!-- Screenshots will be added in Chapter 11 -->

## Known Limitations

- **Alias variables are skipped** - Variables that reference other variables aren't exported
- **Remote/library variables not supported** - Only local variables can be exported/imported
- **Existing variables only** - Can't create new variables from CSV (updates only)
- **Mode structure must match** - Import file must have the same modes as your collections
- **Font loading errors** - Updating font-size variables applied to text with custom fonts may fail with "unloaded font" errors
- **Formulas are not preserved** - Downloaded CSV contains raw values only
- **JSON and direct Google Sheets sync are not exposed** - These remain backlog items until they are reliable enough for the product interface

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## License

[MIT](./LICENSE)

## Author

Created by [Mark Andrassy](https://github.com/amarkkk)

---

**Part of the [Figma Variable Tools](https://github.com/amarkkk) suite:**

| Plugin | Description |
|--------|-------------|
| [Variable to CSS](https://github.com/amarkkk/figma-variable-to-css) | Export variables to fluid CSS with clamp() scaling |
| [Variable Mover](https://github.com/amarkkk/figma-variable-mover) | Move variables between collections preserving aliases |
| [Variable Remapper](https://github.com/amarkkk/figma-variable-remapper) | Bulk find-and-replace variable bindings |
| **Variable Import/Export** | CSV export/import for spreadsheet editing |
| [Variable Description Manager](https://github.com/amarkkk/figma-variable-description-manager) | Bulk clear/update variable descriptions |
| [Variable Network](https://github.com/amarkkk/figma-variable-network) | Visualize token alias chains and component usage |
