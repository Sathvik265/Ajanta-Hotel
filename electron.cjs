console.log("Electron main process starting...");

const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  console.log("Creating Electron window...");
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the Vite dev server in development, or the built index.html in production
  if (process.env.NODE_ENV === "development") {
    console.log("Loading Vite dev server at http://localhost:5173");
    win.loadURL("http://localhost:5173").catch((err) => {
      console.error("Failed to load Vite dev server:", err);
    });
  } else {
    const filePath = path.join(__dirname, "dist", "index.html");
    console.log("Loading file:", filePath);
    win.loadFile(filePath).catch((err) => {
      console.error("Failed to load file:", filePath, err);
    });
  }

  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Window failed to load:", errorCode, errorDescription);
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

console.log("Electron main process loaded.");
