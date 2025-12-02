# Variable Import/Export

A Figma plugin for exporting variable values to CSV or JSON, enabling external bulk calculations and editing workflows that aren't possible within Figma's native interface.

> **⚠️ Development Status**: This plugin is currently in development and not yet published to the Figma Community. Follow the installation instructions below to use it locally.

## Use Case

Figma doesn't support bulk mathematical operations on variables. This creates friction when building design systems with calculated relationships between values.

### Examples

#### Adjusting fluid values:

Sometimes, I like use the approach from [Utopia.fyi](https://utopia.fyi) - starting with a base value (e.g., 16px body text) and calculating everything through ratios. With this plugin: export to CSV, use spreadsheet formulas to calculate your entire type scale and line heights from one foundation value, then import back.

**The core problem**: Figma makes you calculate and enter each value manually, one at a time, for every mode. With Mobile/Tablet/Laptop/Desktop viewports, that's 4× the manual work for every change.

**The solution**: Create placeholder values in Figma → Export → Calculate in spreadsheets → Import back.

#### Multi-language content:
Store your site's content in string variables and use modes for different languages. Export to CSV, edit all your copy in a spreadsheet or send it to translators, then import the updated content back. Much easier than editing strings one-by-one in Figma's UI.

## What This Plugin Does (and Doesn't Do)

✅ **Does:**
- Export existing variable values to CSV or JSON
- Import updated values for existing variables
- Support multi-mode variables (all modes export to separate columns)
- Preserve variable IDs for reliable re-importing
- Create operation logs on a dedicated page (basic implementation, needs improvement)

❌ **Doesn't:**
- Create new variables from scratch
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

<img width="922" height="708" alt="Screenshot 2025-12-02 at 13 31 53" src="https://github.com/user-attachments/assets/5c0fadaf-e3b2-4fb3-8ff4-8d5ccdb0955f" />
<img width="922" height="708" alt="Screenshot 2025-12-02 at 13 26 33" src="https://github.com/user-attachments/assets/90ab85fc-313d-46af-95c1-8e95455ba601" />
<img width="922" height="708" alt="Screenshot 2025-12-02 at 13 31 27" src="https://github.com/user-attachments/assets/3701d5f8-31ba-4dab-a91e-4ad0b9d777a9" />
<img width="922" height="708" alt="Screenshot 2025-12-02 at 13 31 35" src="https://github.com/user-attachments/assets/a240ee14-ff85-4307-ad52-db569676e6d9" />
<img width="922" height="708" alt="Screenshot 2025-12-02 at 13 43 24" src="https://github.com/user-attachments/assets/c53aa8e8-3425-41fd-a6f3-e8e50e15561d" />
<img width="922" height="708" alt="Screenshot 2025-12-02 at 13 47 49" src="https://github.com/user-attachments/assets/553d9b46-0718-4732-b5c8-2f741879bab2" />

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
   =B2*1.25     // Scale up by major third ratio
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
VariableCollectionId:1:23,Typography,VariableID:4:56,font-size/body,FLOAT,16,16
VariableCollectionId:1:23,Typography,VariableID:4:57,font-size/h4,FLOAT,20,20
VariableCollectionId:1:23,Typography,VariableID:4:58,font-size/h3,FLOAT,25,25
VariableCollectionId:1:23,Typography,VariableID:4:59,line-height/body,FLOAT,25.6,25.6
```

**Key Points:**
- `variableId` is used to match variables during import - don't modify this column
- Each mode gets its own column with the format `Mode: {ModeName}`
- Color values use hex format (#RRGGBB)
- Number values are plain decimals
- Aliases appear as `[ALIAS]` and cannot be edited

**Note:** The CSV includes metadata columns (collectionId, collectionName, variableType) that shouldn't be edited but are necessary for the plugin to work correctly. Only edit the mode value columns.

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
- [ ] Variable alias handling during export/import
- [ ] Direct Google Sheets synchronization (currently falls back to CSV export/import)
- [ ] Improved UX: better variable selection, collapsible collections, sorting/ordering
- [ ] Resizable plugin window
- [ ] Fix font loading for text variable updates

## Known Limitations

**Core Functionality:**
- **Alias variables are skipped**: Variables that reference other variables aren't exported
- **Remote variables aren't supported**: Only local variables can be exported/imported
- **Existing variables only**: Can't create new variables from CSV
- **Mode structure must match**: Import file must have the same modes as your current collections
- **Font loading errors**: If you update a number variable (like font size) that's applied to text using a custom font, the import may fail with "unloaded font" errors. This is a Figma API quirk—even though you're only changing a number, Figma requires the font to be loaded first. Workaround: Make sure all fonts used in your document are loaded/active before importing.

**UX Needs Improvement:**
The core export/import functionality works, but the user experience has rough edges:
- Variable selection interface could be more intuitive
- Collection expand/collapse behavior is inconsistent
- No sorting or filtering options
- Window is fixed size (not resizable)
- Google Sheets direct sync was attempted but currently not implemented—use CSV export/import workflow instead

## Contributing

This is a personal project currently in development. Once published, contributions will be welcome!

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions, please [open an issue](../../issues) on GitHub.
