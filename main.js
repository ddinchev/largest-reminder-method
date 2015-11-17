'use strict';

const ipcMain = require('electron').ipcMain;

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;
// var settingsWindow = null;

var configuration = require('./configuration');

app.on('ready', function() {
    if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }

    mainWindow = new BrowserWindow({
        frame: true,
        height: 600,
        // resizable: false,
        width: 1600
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});

ipcMain.on('close-main-window', function () {
    app.quit();
});

/*

ipc.on('open-settings-window', function () {
    if (settingsWindow) {
        settingsWindow.show();
        return;
    }

    settingsWindow = new BrowserWindow({
        frame: false,
        height: 250,
        // resizable: false,
        width: 200
    });

    settingsWindow.loadUrl('file://' + __dirname + '/app/settings.html');

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});

ipc.on('close-settings-window', function() {
    if (settingsWindow) {
        settingsWindow.close();
    }
});

*/