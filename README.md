# Variable Import/Export

A Figma plugin for exporting and importing variable values via CSV or JSON. Enables bulk mathematical calculations and external editing of variable values that aren't possible within Figma's native interface.

> **⚠️ Development Status**: This plugin is currently in development and not yet published to the Figma Community. Follow the installation instructions below to use it locally.

## Why This Plugin?

Figma doesn't support bulk mathematical operations on variables. This creates friction when building design systems with calculated relationships between values.

### Common Use Cases

**Type Scales with Mathematical Ratios**
When creating a typographic scale using ratios (golden ratio, major third, etc.), you need to calculate each size individually. For example:
- H1: 48px
- H2: 48 ÷ 1.618 = 29.7px
- H3: 29.7 ÷ 1.618 = 18.3px
- H4: 18.3 ÷ 1.618 = 11.3px

Doing this one-by-one in Figma is tedious.

**Calculated Line Heights**
When you want consistent line-height ratios across your type scale:
- Body text: font-size × 1.6 (160%)
- Headings: font-size × 1.2 (120%)
- Display: font-size × 1.4 (140%)

Without this plugin, you'd need to calculate and update each variable individually for every mode in your collection.

**The Solution**
Export your variables to CSV, use spreadsheet formulas (Excel, Google Sheets, Numbers) to calculate all values at once, then import them back into Figma.

## What This Plugin Does (and Doesn't Do)

✅ **Does:**
- Export existing variable values to CSV or JSON
- Import updated values for existing variables
- Support multi-mode variables (all modes export to separate columns)
- Preserve variable IDs for reliable re-importing
- Create operation logs on a dedicated page

❌ **Doesn't (currently):**
- Create new variables from scratch
- Migrate variables to empty files
- Handle variable aliases (they're skipped during export)
- Support remote/library variables (only local variables)

## Features

- **CSV Export**: Export to spreadsheet-friendly format for bulk calculations
- **JSON Export**: Export complete variable data with full metadata
- **Multi-Mode Support**: All modes appear as separate columns in CSV
- **Selective Export**: Choose specific collections and variables to export
- **Validation Before Import**: Preview changes before applying them
- **Import Logs**: Automatic logging of all operations to a dedicated page
- **Type Support**: Handles colors (hex), numbers, strings, and booleans
- **Safe Imports**: Shows exactly what will change before you commit

## Screenshots

<!-- Add screenshots here once available -->
_Screenshots coming soon_

## Installation

Since this plugin is not yet published, you'll need to install it manually:

1. **Download or clone this repository** to your local machine

2. **Install dependencies** (if using TypeScript):
   ```bash
   npm install
   ```

3. **Build the plugin** (if using TypeScript):
   ```bash
   npm run build
   ```
   This compiles `code.ts` to `code.js`

4. **Open Figma Desktop** (the plugin requires the desktop app for development mode)

5. **Import the plugin**:
   - Go to `Menu → Plugins → Development → Import plugin from manifest...`
   - Navigate to the folder where you downloaded this repository
   - Select the `manifest.json` file

6. **Run the plugin**:
   - Go to `Menu → Plugins → Development → Variable Import/Export`

The plugin will now appear in your development plugins list.

## Usage

### Basic Workflow

#### Exporting Variables

1. **Open the plugin** from the Plugins menu
2. **Select collections** and variables you want to export
3. **Choose export format**:
   - **CSV**: For spreadsheet editing and bulk calculations
   - **JSON**: For complete data backup or programmatic editing
4. **Download** the exported file

#### Editing Values Externally

**For CSV (Recommended for Calculations):**
1. Open the CSV in Excel, Google Sheets, or Numbers
2. Each mode appears as a separate column (e.g., "Mode: Light", "Mode: Dark")
3. Use spreadsheet formulas to calculate new values:
   ```
   =B2*1.6      // Calculate line-height as 160% of font size
   =A2/1.618    // Apply golden ratio
   =B2+16       // Add consistent spacing
   ```
4. Export/save as CSV

**For JSON:**
1. Edit the JSON file in any text editor
2. Modify the `valuesByMode` objects for each variable
3. Save the file

#### Importing Updated Values

1. **Open the plugin** and switch to Import mode
2. **Upload your edited CSV or JSON file**
3. **Review the preview** - the plugin shows exactly what will change
4. **Import** to apply changes
5. Check the **📋 Variable Export/Import Logs** page for a record of the operation

### CSV Format

The CSV structure looks like this:

```csv
collectionId,collectionName,variableId,variableName,variableType,Mode: Light,Mode: Dark
VariableCollectionId:1:23,Typography,VariableID:4:56,font-size/h1,FLOAT,48,48
VariableCollectionId:1:23,Typography,VariableID:4:57,font-size/h2,FLOAT,32,32
VariableCollectionId:1:23,Typography,VariableID:4:58,line-height/h1,FLOAT,57.6,57.6
```

**Key Points:**
- `variableId` is used to match variables during import - don't modify this column
- Each mode gets its own column with the format `Mode: {ModeName}`
- Color values use hex format (#RRGGBB)
- Number values are plain decimals
- Aliases appear as `[ALIAS]` and cannot be edited

### Tips

- **Always validate first**: The preview shows you exactly what will change
- **Keep variable IDs intact**: The `variableId` column is crucial for matching
- **Use formulas**: The real power is in spreadsheet formulas for bulk calculations
- **Check the logs**: Every operation is logged to the "📋 Variable Export/Import Logs" page
- **Backup first**: Export to JSON before making major changes for easy rollback

## Development

This plugin is built with:
- TypeScript
- Figma Plugin API
- Vanilla JavaScript for UI
- HTML/CSS

### File Structure

```
variable_import_export/
├── manifest.json          # Plugin configuration
├── code.ts               # Main plugin logic (TypeScript source)
├── code.js               # Compiled plugin code
├── ui.html               # User interface
├── package.json          # npm dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

### Building

```bash
npm install
npm run build
```

The TypeScript compiler watches for changes and automatically recompiles.

## Roadmap

- [ ] Publish to Figma Community
- [ ] Support for creating new variables from CSV
- [ ] Variable alias handling during export/import
- [ ] Bulk operations (rename, retype, rescope)
- [ ] Template library for common calculations (type scales, spacing systems)
- [ ] Direct formula evaluation (calculate within the plugin)
- [ ] Support for remote/library variables

## Known Limitations

- **Alias variables are skipped**: Variables that reference other variables aren't exported
- **Remote variables aren't supported**: Only local variables can be exported/imported
- **Existing variables only**: Can't create new variables from CSV (yet)
- **Mode structure must match**: Import file must have the same modes as your current collections

## Contributing

This is a personal project currently in development. Once published, contributions will be welcome!

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions, please [open an issue](../../issues) on GitHub.
