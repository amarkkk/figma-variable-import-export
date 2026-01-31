# Variable Import/Export

> Export variables to CSV for bulk editing in spreadsheets, then import back.

> **⚠️ Development Status**: This plugin is currently in development and not yet published to the Figma Community. Follow the installation instructions below to use it locally.

> **🔒 Privacy**: This plugin operates entirely locally. No data is sent to external servers.

## Use Case

Figma doesn't support bulk mathematical operations on variables. When building design systems with calculated relationships between values, you're forced to manually calculate and enter each value one at a time, for every mode. With Mobile/Tablet/Laptop/Desktop viewports, that's 4x the manual work for every change.

**The solution:** Export to CSV -> Calculate in spreadsheets -> Import back.

### Examples

**Fluid type scales:** Export your typography variables, use spreadsheet formulas to calculate your entire type scale and line heights from a base value (e.g., `=B2*1.25` for major third ratio), then import back.

**Multi-language content:** Store your site's content in string variables with modes for different languages. Export to CSV, send to translators or edit in a spreadsheet, then import the updated content back.

## Features

- **CSV Export** - Spreadsheet-friendly format for bulk calculations
- **JSON Export** - Complete variable data with full metadata for backup or programmatic editing
- **Multi-Mode Support** - All modes appear as separate columns in CSV
- **Selective Export** - Choose specific collections and variables to export
- **Validation Before Import** - Preview exactly what will change before applying
- **Type Support** - Handles colors (hex), numbers, strings, and booleans

## Installation

1. Clone or download this repository
2. In Figma Desktop: **Plugins -> Development -> Import plugin from manifest**
3. Select the `manifest.json` file from this folder

## Usage

### Exporting Variables

1. Open the plugin from **Plugins -> Development -> Variable Import/Export**
2. Select collections and variables to export
3. Choose **CSV** (for spreadsheets) or **JSON** (for backup/programmatic editing)
4. Download the file

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
2. Upload your edited CSV or JSON file
3. Review the preview - the plugin shows exactly what will change
4. Click Import to apply changes

## Screenshots

<!-- Add screenshots here -->

## Known Limitations

**Core Functionality:**
- **Alias variables are skipped** - Variables that reference other variables aren't exported
- **Remote/library variables not supported** - Only local variables can be exported/imported
- **Existing variables only** - Can't create new variables from CSV (updates only)
- **Mode structure must match** - Import file must have the same modes as your collections
- **Font loading errors** - Updating font-size variables applied to text with custom fonts may fail with "unloaded font" errors. Workaround: ensure all fonts are loaded before importing.

**Spreadsheet Workflow:**
- **Formulas are not preserved** - Downloaded CSV contains raw values only. If you use spreadsheet formulas for calculations, keep your original spreadsheet intact and avoid overwriting it with re-exported CSVs.
- **Locale/formatting issues** - Comma vs. dot decimal separators may cause issues. Set your spreadsheet's locale to US English for consistent number formatting.

**UX Issues:**
- **Fixed window size** - Plugin window is not resizable
- **Selection behavior** - Collections auto-expand on every selection action, making bulk selection tedious
- **Import logs are buggy** - The automatic logging to a dedicated Figma page is unreliable; sometimes triggers when no import occurred and creates clutter. Manual cleanup may be needed.

## License

MIT

## Author

Created by [Márk Andrássy](https://github.com/amarkkk)

Part of a collection of Figma plugins for design token management.
