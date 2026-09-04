const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

const WEBSITE_URL = "https://git-hub-universe-com-nu.vercel.app";
const PRIVACY_POLICY_URL = `${WEBSITE_URL}/privacy`;

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 960,
    minHeight: 700,
    backgroundColor: "#000000",
    icon: app.isPackaged
      ? path.join(process.resourcesPath, "icon.ico")
      : path.join(__dirname, "../build/icon.ico"),
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.loadURL(WEBSITE_URL);
  window.once("ready-to-show", () => {
    window.maximize();
    window.show();
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url === PRIVACY_POLICY_URL || url.startsWith("https://")) {
      void shell.openExternal(url);
    }
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
