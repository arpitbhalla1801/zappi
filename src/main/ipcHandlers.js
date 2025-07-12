const { ipcMain } = require('electron');
const { scanApps } = require('../utils/appScanner');
const { installApps } = require('../utils/appInstaller');
const db = require('../utils/db');


ipcMain.handle('get-installed-apps', async () => {
  return await scanApps();
});


ipcMain.handle('save-apps', async (_event, appList) => {
  db.saveApps(appList);
  return { success: true };
});


ipcMain.handle('install-saved-apps', async () => {
  const apps = db.getSavedApps();
  return await installApps(apps);
});
