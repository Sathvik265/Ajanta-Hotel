console.log("Electron main process starting...");

const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  console.log("Creating Electron window...");
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  if (isDev) {
    const url = "http://localhost:5173";
    console.log(`Loading development server from ${url}`);
    win.loadURL(url).catch((err) => {
      console.error("Failed to load Vite dev server:", err);
      setTimeout(() => {
        win.loadURL(url);
      }, 1000);
    });
    win.webContents.openDevTools();
  } else {
    const indexHtml = path.join(__dirname, "dist", "index.html");
    console.log(`Loading production build from ${indexHtml}`);
    win.loadFile(indexHtml).catch((err) => {
      console.error("Failed to load file:", indexHtml, err);
    });
  }

  win.webContents.on("did-fail-load", () => {
    if (isDev) {
      console.log("Retrying connection to dev server...");
      setTimeout(() => {
        win.loadURL("http://localhost:5173");
      }, 1000);
    }
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

console.log("Electron main process loaded.");
