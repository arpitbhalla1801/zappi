const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();
require('./ipcHandlers'); // Import IPC logic

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
