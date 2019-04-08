const electron = require("electron");
const path = require("path");
require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron")
});

const { app, BrowserWindow, Menu } = electron;
let mainWindow, lab02_00, lab02_01, lab03, lab05_advanced_lighting;

// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
app.on("ready", () => {
  lab05_Window();

  const menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);
});

// Handle create add window
const lab02_00_Window = () => {
  lab02_00 = new BrowserWindow({
    // webPreferences: {
    //   nodeIntegration: false
    // },
    title: "Lab 02 - 00"
  });

  lab02_00.loadURL(`file://${__dirname}/lab02_00.html`);
};

const lab02_01_Window = () => {
  lab02_01 = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false
    },
    title: "Lab 02 - 01"
  });

  lab02_01.loadURL(`file://${__dirname}/lab02_01.html`);
};

// Lab 03 - Moebius Strip
const lab03_Window = () => {
  lab03 = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false
    },
    title: "Lab 03"
  });

  lab03.loadURL(`file://${__dirname}/lab03.html`);
};

const lab05_Window = () => {
  lab05_advanced_lighting = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false
    },
    title: "Lab 03"
  });
  lab05_advanced_lighting.loadURL(
    `file://${__dirname}/advanced_lighting_starting_code.html`
  );
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
    label: "Devtool",
    accelerator: "Ctrl+D",
    click() {
      BrowserWindow.getFocusedWindow().webContents.openDevTools();
    }
  },
  {
    label: "Reload",
    accelerator: "Ctrl+R",
    click() {
      BrowserWindow.getFocusedWindow().reload();
    }
  },
  {
    label: "Labs",
    submenu: [
      {
        role: "Lab 02 00",
        label: "Lab 02 00",
        click() {
          lab02_00_Window();
        }
      },
      {
        role: "Lab 02 01",
        label: "Lab 02 01",
        click() {
          lab02_01_Window();
        }
      },
      {
        role: "Lab 03",
        label: "Lab 03",
        click() {
          lab03_Window();
        }
      },
      {
        role: "Advanced Lighting Lab 05",
        label: "Advanced Lighting Lab 05",
        click() {
          lab03_Window();
        }
      }
    ]
  }
];
