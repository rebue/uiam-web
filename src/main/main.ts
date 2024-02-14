import { app, BrowserWindow, autoUpdater, dialog, MessageBoxOptions } from 'electron';
import path from 'path';
// import { updateElectronApp } from 'update-electron-app';
// import Logger from 'electron-log';

const isDev = !app.isPackaged;
console.log('isDev', isDev);

// // github自动更新程序
// updateElectronApp({
//     updateInterval: '5 minutes',
//     logger: Logger,
// });

if (!isDev) {
    // 第3方自动更新程序的服务器
    const platform = process.platform === 'win32' ? 'win64' : process.platform;
    const url = `${process.env.AUTO_UPDATE_SERVER}/update/${platform}/${app.getVersion()}`;
    console.log('更新服务器的地址', url);
    autoUpdater.setFeedURL({ url });
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 60000);
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts: MessageBoxOptions = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: 'A new version has been downloaded. Restart the application to apply the updates.',
        };

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall();
        });
    });
    autoUpdater.on('error', (message) => {
        console.error('There was a problem updating the application');
        console.error(message);
    });
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    console.log('main_window_vite_dev_server_url', MAIN_WINDOW_VITE_DEV_SERVER_URL);
    console.log('main_window_vite_name', MAIN_WINDOW_VITE_NAME);
    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
