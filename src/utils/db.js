const fs = require('fs');
const path = require('path');
const os = require('os');

// Database file path
const DB_DIR = path.join(os.homedir(), '.zappi');
const DB_FILE = path.join(DB_DIR, 'apps.json');

/**
 * Ensure the database directory and file exist
 */
function ensureDbExists() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(DB_FILE)) {
      const initialData = {
        apps: [],
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error ensuring database exists:', error);
  }
}

/**
 * Read the database file
 * @returns {Object} Database content
 */
function readDb() {
  try {
    ensureDbExists();
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {
      apps: [],
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}

/**
 * Write to the database file
 * @param {Object} data - Data to write
 */
function writeDb(data) {
  try {
    ensureDbExists();
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
}

/**
 * Save apps to the database
 * @param {Array} apps - Array of app objects
 */
function saveApps(apps) {
  try {
    const db = readDb();
    db.apps = apps.map(app => ({
      ...app,
      savedAt: new Date().toISOString()
    }));
    
    const success = writeDb(db);
    if (success) {
      console.log(`Saved ${apps.length} apps to database`);
    }
    
    return success;
  } catch (error) {
    console.error('Error saving apps:', error);
    return false;
  }
}

/**
 * Get saved apps from the database
 * @returns {Array} Array of saved apps
 */
function getSavedApps() {
  try {
    const db = readDb();
    return db.apps || [];
  } catch (error) {
    console.error('Error getting saved apps:', error);
    return [];
  }
}

/**
 * Add a single app to the database
 * @param {Object} app - App object to add
 */
function addApp(app) {
  try {
    const db = readDb();
    const existingIndex = db.apps.findIndex(existing => existing.name === app.name);
    
    const appWithTimestamp = {
      ...app,
      savedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      db.apps[existingIndex] = appWithTimestamp;
    } else {
      db.apps.push(appWithTimestamp);
    }
    
    return writeDb(db);
  } catch (error) {
    console.error('Error adding app:', error);
    return false;
  }
}

/**
 * Remove an app from the database
 * @param {string} appName - Name of the app to remove
 */
function removeApp(appName) {
  try {
    const db = readDb();
    db.apps = db.apps.filter(app => app.name !== appName);
    
    return writeDb(db);
  } catch (error) {
    console.error('Error removing app:', error);
    return false;
  }
}

/**
 * Clear all saved apps
 */
function clearApps() {
  try {
    const db = readDb();
    db.apps = [];
    
    return writeDb(db);
  } catch (error) {
    console.error('Error clearing apps:', error);
    return false;
  }
}

/**
 * Get database statistics
 * @returns {Object} Database stats
 */
function getStats() {
  try {
    const db = readDb();
    return {
      totalApps: db.apps.length,
      lastUpdated: db.lastUpdated,
      version: db.version,
      dbPath: DB_FILE,
      dbSize: fs.statSync(DB_FILE).size
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalApps: 0,
      lastUpdated: null,
      version: '1.0.0',
      dbPath: DB_FILE,
      dbSize: 0
    };
  }
}

/**
 * Export apps to a JSON file
 * @param {string} exportPath - Path to export the file
 */
function exportApps(exportPath) {
  try {
    const db = readDb();
    const exportData = {
      apps: db.apps,
      exportedAt: new Date().toISOString(),
      exportedFrom: 'Zappi v1.0.0'
    };
    
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
    return true;
  } catch (error) {
    console.error('Error exporting apps:', error);
    return false;
  }
}

/**
 * Import apps from a JSON file
 * @param {string} importPath - Path to the import file
 * @param {boolean} merge - Whether to merge with existing apps or replace
 */
function importApps(importPath, merge = true) {
  try {
    const importData = JSON.parse(fs.readFileSync(importPath, 'utf8'));
    const db = readDb();
    
    if (merge) {
      // Merge imported apps with existing ones
      const existingNames = new Set(db.apps.map(app => app.name));
      const newApps = importData.apps.filter(app => !existingNames.has(app.name));
      db.apps = [...db.apps, ...newApps];
    } else {
      // Replace existing apps
      db.apps = importData.apps;
    }
    
    return writeDb(db);
  } catch (error) {
    console.error('Error importing apps:', error);
    return false;
  }
}

module.exports = {
  saveApps,
  getSavedApps,
  addApp,
  removeApp,
  clearApps,
  getStats,
  exportApps,
  importApps
};
