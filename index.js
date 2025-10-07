const { app, BrowserWindow, nativeImage, screen } = require('electron');
const path = require('path');
const eConfig = require('electron-config');
const config = new eConfig()

if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
}

app.whenReady().then(() => {
    const iconNativeImage = nativeImage.createFromPath(path.join(__dirname, 'build', 'icon.png'))

    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        icon: iconNativeImage,
        resizable: true
    });

    if (config.has('winBounds')) {
        let bounds = config.get('winBounds');
        const currentDisplay = screen.getDisplayMatching(bounds);
        if (!currentDisplay) {
            bounds.x = undefined;
            bounds.y = undefined;
        }
        mainWindow.setBounds(bounds)
    }

    mainWindow.setIcon(iconNativeImage);

    mainWindow.setMenu(null);

    mainWindow.loadURL('https://linear.app/login');

    mainWindow.on('close', () => {
        let bounds = mainWindow.getBounds();
        config.set('winBounds', bounds)
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
});
