const electron = require('electron');
const path = require('path');
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

const { app, BrowserWindow, Menu } = electron;
let mainWindow, lab02_00, lab02_01;

// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
app.on('ready', () => {
  // lab02_00_Window();
  mainWindowLoad();
  // console.log();

  const menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);
});

// Handle create add window
const lab02_00_Window = () => {
  lab02_00 = new BrowserWindow({
    // webPreferences: {
    //   nodeIntegration: false
    // },
    title: 'Lab 02 - 00'
  });

  lab02_00.loadURL(`file://${__dirname}/lab02_00.html`);
};

const lab02_01_Window = () => {
  lab02_01 = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false
    },
    title: 'Lab 02 - 01'
  });

  lab02_01.loadURL(`file://${__dirname}/lab02_01.html`);
};

const mainWindowLoad = () => {
  mainWindow = new BrowserWindow({
    // webPreferences: {
    //   nodeIntegration: false
    // }
  });
  // mainWindow.maximize();
  mainWindow.loadURL(`file://${__dirname}/index.html`);
};
const mainMenuTemplate = [
  {
    label: 'Devtool',
    accelerator: 'Ctrl+D',
    click() {
      mainWindow.webContents.openDevTools();
    }
  },
  {
    label: 'Reload',
    accelerator: 'Ctrl+R',
    click() {
      BrowserWindow.getFocusedWindow().reload();
    }
  },
  {
    label: 'Lab 02 00',
    click() {
      lab02_00_Window();
    }
  },
  {
    label: 'Lab 02 01',
    click() {
      lab02_01_Window();
    }
  }
];
