import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const progressFile = join(process.cwd(), 'public', 'progress.json');

function safeReadJSON(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf-8').trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getLastProcessedRow(sheetId, sheetName) {
  if (!existsSync(progressFile)) return 2;

  const data = safeReadJSON(progressFile);
  const sheetData = data[sheetId] || {};
  const lastRow = sheetData[sheetName];

  if (lastRow === undefined) {
    return 2;
  }

  return lastRow;
}

function setLastProcessedRow(sheetId, sheetName, rowNumber) {
  const data = existsSync(progressFile) ? safeReadJSON(progressFile) : {};
  if (!data[sheetId]) {
    data[sheetId] = {};
  }
  data[sheetId][sheetName] = rowNumber;
  writeFileSync(progressFile, JSON.stringify(data, null, 2));
}

export default { getLastProcessedRow, setLastProcessedRow };
