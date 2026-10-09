'use strict';

const path = require('node:path');
const { app, BrowserWindow, session } = require('electron');
const { createLocalServer } = require('./local-server.cjs');

let staticHost;
let mainWindow;
let baseUrl;

async function createWindow() {
  const contentRoot = app.isPackaged
    ? path.join(process.resourcesPath, 'site')
    : path.resolve(__dirname, '..');

  staticHost = createLocalServer(contentRoot);
  baseUrl = await staticHost.listen();

  // The interface behaves as a normal isolated browser; no privileged Node API is exposed.
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  mainWindow = new BrowserWindow({
    title: 'Marble Run Maker',
    width: 1440,
    height: 960,
    minWidth: 960,
    minHeight: 640,
    show: false,
    backgroundColor: '#171922',
    autoHideMenuBar: true,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(`${baseUrl}/Marbles/`)) event.preventDefault();
  });
  await mainWindow.loadURL(`${baseUrl}/Marbles/`);
}

app.whenReady().then(createWindow).catch((error) => {
  console.error('Unable to start Marble Run Maker:', error);
  app.quit();
});

app.on('window-all-closed', () => app.quit());
app.on('before-quit', () => {
  if (staticHost) staticHost.server.close();
});
