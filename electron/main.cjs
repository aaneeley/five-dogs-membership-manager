// Modules to control application life and create native browser window
const { log } = require('console')
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

if (require('electron-squirrel-startup')) app.quit();

const isDevEnvironment = process.env.DEV_ENV === 'true'

// enable live reload for electron in dev mode
if (isDevEnvironment) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    });
}

var sqlite3 = require('@journeyapps/sqlcipher').verbose();
var db = new sqlite3.Database('test.db');
db.serialize(function () {
    // This is the default, but it is good to specify explicitly:
    db.run("PRAGMA cipher_compatibility = 4");

    // To open a database created with SQLCipher 3.x, use this:
    // db.run("PRAGMA cipher_compatibility = 3");

    db.run("PRAGMA key = 'mysecret'");

    // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    // for (var i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();

    db.each("SELECT * FROM members", function (err, row) {
        console.log(row);
    });
});



let mainWindow;

const createWindow = () => {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // define how electron will load the app
    if (isDevEnvironment) {

        // if your vite app is running on a different port, change it here
        mainWindow.loadURL('http://localhost:5173/');

        // Open the DevTools.
        mainWindow.webContents.on("did-frame-finish-load", () => {
            //mainWindow.webContents.openDevTools();
        });

        log('Electron running in dev mode: 🧪')

    } else {

        // when not in dev mode, load the build file instead
        mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

        log('Electron running in prod mode: 🚀')
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('quit', () => {
    db.close();
})

ipcMain.handle('search-member', async (event, membership_id) => {
    try {
        console.log(membership_id)

        const sql = `SELECT * FROM members WHERE id = ?`

        return new Promise((resolve, reject) => {
            db.all(sql, [membership_id], (err, rows) => {
              if (err) {
                console.error('Error running query:', err.message);
                reject(err.message);
              } else {
                resolve(rows);
              }
            });
          });
    } catch (err) {
        console.error('Error in IPC handler:', err);
        throw err;
    }
})