const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const isDev = require('electron-is-dev');
const { saveXls } = require('../src/lib/xls');
let mainWindow;

async function createWindow() {
  try {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
      width: width,
      height: height,
      minWidth: 420,
      minHeight: 600,
      show: false,
      autoHideMenuBar: true,
      frame: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: false,
        preload: `${__dirname}/preload.js`,
      },
      icon: `${__dirname}/logo512.ico`,
    });
    ipcMain.on("files", async event => {
      const result = await dialog
        .showOpenDialog(null, {
          filters: [
            {
              name: "Images",
              extensions: ["jpg", "png"]
            }
          ],
          properties: ["openFile", "multiSelections"]
        })
        .then(result => {
          const { canceled, filePaths } = result;

          if (canceled) return [];
          return filePaths;
        })
        .catch(err => {
          console.log(err);
          return [];
        });

      event.reply("files", { files: result });
    });
    ipcMain.on('save-xls', (event, data) => {
      saveXls(data);

    })

    if (isDev) {
      console.log('dev', __dirname);
      mainWindow.loadURL('http://localhost:3000');
      mainWindow.webContents.openDevTools();
    } else {
      console.log('release', __dirname);
      mainWindow.loadFile(`${path.join(__dirname, '../build/index.html')}`);
    }

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  } catch (error) {
    return console.error('createWindow', error.message);
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  // instance exist
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
        mainWindow.show();
      }
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    try {
      if (!mainWindow) {
        await createWindow();
      }
    } catch (error) {
      console.log('whenReady', error.message);
    }
  });
}

// 종료시 정리 : app.quit() 호출시 발생
app.on('before-quit', async (event) => {
  try {
  } catch (error) {
    console.error('before-quit', error.message);
  }
});

// all windows closed non-macOS 플랫폼에서 창이 모두 닫혔을 때 앱 종료
app.on('window-all-closed', function () {
  try {
    if (process.platform !== 'darwin') app.quit();
  } catch (error) {
    console.error('window-all-closed', error.message);
  }
});

app.on('activate', () => {
  try {
    if (!mainWindow) {
      createWindow();
    }
  } catch (error) {
    console.error('activate', error.message);
  }
});


