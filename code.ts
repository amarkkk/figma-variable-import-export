// Variable Import/Export v2.0
// Figma Plugin for exporting and importing variable collections

type CustomVariableData = {
  id: string;
  name: string;
  description: string;
  hiddenFromPublishing: boolean;
  resolvedType: VariableResolvedDataType;
  scopes: VariableScope[];
  codeSyntax: { [platform: string]: string };
  valuesByMode: { [modeId: string]: any };
  variableCollectionId: string;
  isAlias: boolean;
};

type CustomCollectionData = {
  id: string;
  name: string;
  hiddenFromPublishing: boolean;
  remote: boolean;
  defaultModeId: string;
  modes: Array<{ modeId: string; name: string }>;
  key?: string;
  variables: CustomVariableData[];
};

type ExportData = {
  version: string;
  exportDate: string;
  collections: CustomCollectionData[];
};

type CSVRow = {
  collectionId: string;
  collectionName: string;
  variableId: string;
  variableName: string;
  variableType: string;
  [modeName: string]: string;
};

figma.showUI(__html__, { width: 900, height: 650, themeColors: true });

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'scan-collections') {
      await handleScanCollections();
    } else if (msg.type === 'export-csv') {
      await handleExportCSV(msg.collectionIds, msg.variableIds);
    } else if (msg.type === 'export-json') {
      await handleExportJSON(msg.collectionIds, msg.variableIds);
    } else if (msg.type === 'validate-csv-import') {
      await handleValidateCSVImport(msg.csvData);
    } else if (msg.type === 'import-csv') {
      await handleImportCSV(msg.csvData);
    } else if (msg.type === 'validate-json-import') {
      await handleValidateJSONImport(msg.jsonData);
    } else if (msg.type === 'import-json') {
      await handleImportJSON(msg.jsonData);
    } else if (msg.type === 'cancel') {
      figma.closePlugin();
    }
  } catch (error) {
    figma.ui.postMessage({ type: 'error', message: error.message });
  }
};

function isVariableAlias(variable: Variable): boolean {
  for (const value of Object.values(variable.valuesByMode)) {
    if (value && typeof value === 'object' && 'type' in value && value.type === 'VARIABLE_ALIAS') {
      return true;
    }
  }
  return false;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number; a: number } {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b, a: 1 };
}

function formatValueForCSV(value: any, type: VariableResolvedDataType): string {
  if (!value) return '';
  if (typeof value === 'object' && 'type' in value && value.type === 'VARIABLE_ALIAS') {
    return '[ALIAS]';
  }
  switch (type) {
    case 'COLOR':
      if (value.r !== undefined) return rgbToHex(value.r, value.g, value.b);
      return '';
    case 'FLOAT':
      return String(value);
    case 'STRING':
      return value;
    case 'BOOLEAN':
      return value ? 'true' : 'false';
    default:
      return String(value);
  }
}

function parseValueFromCSV(csvValue: string, type: VariableResolvedDataType): any {
  if (!csvValue || csvValue === '[ALIAS]') return null;
  switch (type) {
    case 'COLOR':
      if (csvValue.startsWith('#')) return hexToRgb(csvValue);
      return null;
    case 'FLOAT':
      return parseFloat(csvValue);
    case 'STRING':
      return csvValue;
    case 'BOOLEAN':
      return csvValue.toLowerCase() === 'true';
    default:
      return null;
  }
}

async function handleScanCollections() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const collectionData: CustomCollectionData[] = [];

  for (const collection of collections) {
    if (collection.remote) continue;
    const variables: CustomVariableData[] = [];
    
    for (const variableId of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (!variable) continue;
      const isAlias = isVariableAlias(variable);
      variables.push({
        id: variable.id,
        name: variable.name,
        description: variable.description,
        hiddenFromPublishing: variable.hiddenFromPublishing,
        resolvedType: variable.resolvedType,
        scopes: variable.scopes,
        codeSyntax: variable.codeSyntax,
        valuesByMode: variable.valuesByMode,
        variableCollectionId: variable.variableCollectionId,
        isAlias
      });
    }

    collectionData.push({
      id: collection.id,
      name: collection.name,
      hiddenFromPublishing: collection.hiddenFromPublishing,
      remote: collection.remote,
      defaultModeId: collection.defaultModeId,
      modes: collection.modes.map(m => ({ modeId: m.modeId, name: m.name })),
      key: collection.key,
      variables
    });
  }

  figma.ui.postMessage({ type: 'collections-scanned', collections: collectionData });
}

async function handleExportCSV(collectionIds: string[], variableIds: string[]) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const exportByCollection: { [collectionId: string]: any } = {};

  for (const collection of collections) {
    if (!collectionIds.includes(collection.id)) continue;
    const csvData: CSVRow[] = [];
    
    for (const variableId of collection.variableIds) {
      if (!variableIds.includes(variableId)) continue;
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (!variable || isVariableAlias(variable)) continue;

      const row: CSVRow = {
        collectionId: collection.id,
        collectionName: collection.name,
        variableId: variable.id,
        variableName: variable.name,
        variableType: variable.resolvedType
      };

      for (const mode of collection.modes) {
        const value = variable.valuesByMode[mode.modeId];
        row['Mode: ' + mode.name] = formatValueForCSV(value, variable.resolvedType);
      }
      csvData.push(row);
    }

    if (csvData.length > 0) {
      exportByCollection[collection.id] = { name: collection.name, data: csvData };
    }
  }

  const totalVariables = Object.values(exportByCollection).reduce((sum, col: any) => sum + col.data.length, 0);
  await createLogEntry('EXPORT_CSV', { collectionsCount: Object.keys(exportByCollection).length, variablesCount: totalVariables, status: 'SUCCESS' });
  figma.ui.postMessage({ type: 'csv-export-ready', data: exportByCollection });
}

async function handleExportJSON(collectionIds: string[], variableIds: string[]) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const exportData: ExportData = { version: "2.0", exportDate: new Date().toISOString(), collections: [] };

  for (const collection of collections) {
    if (!collectionIds.includes(collection.id)) continue;
    const variables: CustomVariableData[] = [];
    
    for (const variableId of collection.variableIds) {
      if (!variableIds.includes(variableId)) continue;
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (!variable || isVariableAlias(variable)) continue;

      variables.push({
        id: variable.id,
        name: variable.name,
        description: variable.description,
        hiddenFromPublishing: variable.hiddenFromPublishing,
        resolvedType: variable.resolvedType,
        scopes: variable.scopes,
        codeSyntax: variable.codeSyntax,
        valuesByMode: variable.valuesByMode,
        variableCollectionId: variable.variableCollectionId,
        isAlias: false
      });
    }

    if (variables.length > 0) {
      exportData.collections.push({
        id: collection.id,
        name: collection.name,
        hiddenFromPublishing: collection.hiddenFromPublishing,
        remote: collection.remote,
        defaultModeId: collection.defaultModeId,
        modes: collection.modes.map(m => ({ modeId: m.modeId, name: m.name })),
        key: collection.key,
        variables
      });
    }
  }

  await createLogEntry('EXPORT_JSON', { collectionsCount: exportData.collections.length, variablesCount: exportData.collections.reduce((sum, c) => sum + c.variables.length, 0), status: 'SUCCESS' });
  figma.ui.postMessage({ type: 'json-export-ready', data: JSON.stringify(exportData, null, 2) });
}

async function handleValidateCSVImport(csvData: string) {
  try {
    const lines = csvData.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV file is empty or invalid');

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1);
    const validation = { valid: true, errors: [] as string[], warnings: [] as string[], summary: { variablesToUpdate: 0, variablesNotFound: 0, modesFound: [] as string[] }, preview: [] as any[] };
    const modeColumns = headers.filter(h => h.startsWith('Mode: '));
    validation.summary.modesFound = modeColumns.map(m => m.replace('Mode: ', ''));

    for (const row of rows) {
      const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < headers.length) continue;
      const rowData: any = {};
      headers.forEach((header, i) => { rowData[header] = cols[i]; });

      const variableId = rowData['variableId'];
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (!variable) {
        validation.summary.variablesNotFound++;
        validation.warnings.push('Variable "' + rowData['variableName'] + '" not found');
        continue;
      }

      validation.summary.variablesToUpdate++;
      const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
      if (!collection) continue;

      const changes = [];
      for (const modeCol of modeColumns) {
        const modeName = modeCol.replace('Mode: ', '');
        const mode = collection.modes.find(m => m.name === modeName);
        if (!mode) continue;
        const newValue = rowData[modeCol];
        const currentValue = variable.valuesByMode[mode.modeId];
        const currentFormatted = formatValueForCSV(currentValue, variable.resolvedType);
        if (newValue !== currentFormatted && newValue !== '[ALIAS]') {
          changes.push(modeName + ': ' + currentFormatted + ' → ’ ' + newValue);
        }
      }

      if (changes.length > 0) {
        validation.preview.push({ collectionName: collection.name, variableName: variable.name, variableId: variable.id, changes });
      }
    }

    figma.ui.postMessage({ type: 'csv-validation-result', validation });
  } catch (error) {
    figma.ui.postMessage({ type: 'csv-validation-result', validation: { valid: false, errors: ['Failed to parse CSV: ' + error.message], warnings: [], summary: {}, preview: [] } });
  }
}

async function handleImportCSV(csvData: string) {
  const results = { variablesUpdated: 0, variablesSkipped: 0, errors: [] as string[] };
  try {
    const lines = csvData.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1);
    const modeColumns = headers.filter(h => h.startsWith('Mode: '));

    for (const row of rows) {
      const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < headers.length) continue;
      const rowData: any = {};
      headers.forEach((header, i) => { rowData[header] = cols[i]; });

      const variableId = rowData['variableId'];
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (!variable) { results.variablesSkipped++; continue; }

      const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
      if (!collection) { results.variablesSkipped++; continue; }

      for (const modeCol of modeColumns) {
        const modeName = modeCol.replace('Mode: ', '');
        const mode = collection.modes.find(m => m.name === modeName);
        if (!mode) continue;
        const csvValue = rowData[modeCol];
        if (!csvValue || csvValue === '[ALIAS]') continue;
        const parsedValue = parseValueFromCSV(csvValue, variable.resolvedType);
        if (parsedValue !== null) {
          try {
            variable.setValueForMode(mode.modeId, parsedValue);
          } catch (error) {
            results.errors.push('Failed to update "' + variable.name + '": ' + error.message);
          }
        }
      }
      results.variablesUpdated++;
    }

    await createLogEntry('IMPORT_CSV', { ...results, status: results.errors.length > 0 ? 'PARTIAL_SUCCESS' : 'SUCCESS' });
    figma.ui.postMessage({ type: 'csv-import-complete', results });
  } catch (error) {
    results.errors.push('Import failed: ' + error.message);
    await createLogEntry('IMPORT_CSV', { ...results, status: 'FAILED', error: error.message });
    figma.ui.postMessage({ type: 'csv-import-complete', results });
  }
}

async function handleValidateJSONImport(jsonData: string) {
  try {
    const importData: ExportData = JSON.parse(jsonData);
    const validation = { valid: true, errors: [] as string[], warnings: [] as string[], summary: { variablesToUpdate: 0, variablesNotFound: 0 }, preview: [] as any[] };
    if (!importData.version || !importData.collections) {
      validation.valid = false;
      validation.errors.push('Invalid JSON structure');
      figma.ui.postMessage({ type: 'json-validation-result', validation });
      return;
    }

    for (const collection of importData.collections) {
      for (const importVar of collection.variables) {
        const variable = await figma.variables.getVariableByIdAsync(importVar.id);
        if (!variable) {
          validation.summary.variablesNotFound++;
          validation.warnings.push('Variable "' + importVar.name + '" not found');
          continue;
        }
        validation.summary.variablesToUpdate++;
        const changes = [];
        for (const [modeId, newValue] of Object.entries(importVar.valuesByMode)) {
          const oldValue = variable.valuesByMode[modeId];
          if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push('Mode ' + modeId + ' value changed');
          }
        }
        if (changes.length > 0) {
          validation.preview.push({ collectionName: collection.name, variableName: importVar.name, variableId: importVar.id, changes });
        }
      }
    }

    figma.ui.postMessage({ type: 'json-validation-result', validation });
  } catch (error) {
    figma.ui.postMessage({ type: 'json-validation-result', validation: { valid: false, errors: ['Failed to parse JSON: ' + error.message], warnings: [], summary: {}, preview: [] } });
  }
}

async function handleImportJSON(jsonData: string) {
  const results = { variablesUpdated: 0, variablesSkipped: 0, errors: [] as string[] };
  try {
    const importData: ExportData = JSON.parse(jsonData);
    for (const collection of importData.collections) {
      for (const importVar of collection.variables) {
        const variable = await figma.variables.getVariableByIdAsync(importVar.id);
        if (!variable) { results.variablesSkipped++; continue; }
        for (const [modeId, value] of Object.entries(importVar.valuesByMode)) {
          try {
            variable.setValueForMode(modeId, value);
          } catch (error) {
            results.errors.push('Failed to update "' + importVar.name + '": ' + error.message);
          }
        }
        results.variablesUpdated++;
      }
    }

    await createLogEntry('IMPORT_JSON', { ...results, status: results.errors.length > 0 ? 'PARTIAL_SUCCESS' : 'SUCCESS' });
    figma.ui.postMessage({ type: 'json-import-complete', results });
  } catch (error) {
    results.errors.push('Import failed: ' + error.message);
    await createLogEntry('IMPORT_JSON', { ...results, status: 'FAILED', error: error.message });
    figma.ui.postMessage({ type: 'json-import-complete', results });
  }
}

async function createLogEntry(operation: string, details: any) {
  try {
    let logPage = figma.root.children.find(page => page.type === 'PAGE' && page.name === 'ðŸ“‹ Variable Export/Import Logs') as PageNode;
    if (!logPage) {
      logPage = figma.createPage();
      logPage.name = 'ðŸ“‹ Variable Export/Import Logs';
    }
    const timestamp = new Date().toLocaleString();
    const logText = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    logText.characters = '[' + timestamp + '] ' + operation + '\n' + 'Status: ' + details.status + '\n' + 'Variables: ' + (details.variablesCount || details.variablesUpdated || 0) + ' updated, ' + (details.variablesSkipped || 0) + ' skipped\n' + (details.errors?.length > 0 ? 'Errors: ' + details.errors.join(', ') : '') + '\n---';
    logText.fontSize = 12;
    logText.x = 20;
    logText.y = 20 + (logPage.children.length * 100);
    logPage.appendChild(logText);
  } catch (error) {
    // Silently fail - logging should not break the plugin
  }
}