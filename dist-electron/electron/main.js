var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_os = require("os");
var import_path = __toESM(require("path"));
var import_electron = require("electron");
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
if ((0, import_os.release)().startsWith("6.1"))
  import_electron.app.disableHardwareAcceleration();
if (process.platform === "win32")
  import_electron.app.setAppUserModelId(import_electron.app.getName());
if (!import_electron.app.requestSingleInstanceLock()) {
  import_electron.app.quit();
  process.exit(0);
}
let win = null;
const distPath = import_path.default.join(__dirname, "../../.output/public");
async function createWindow() {
  win = new import_electron.BrowserWindow({
    fullscreen: true,
    webPreferences: {
      //   preload,
      // Warning: Enabling nodeIntegration and disabling contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      zoomFactor: 1.5
    }
  });
  if (import_electron.app.isPackaged) {
    win.loadFile(import_path.default.join(distPath, "index.html"));
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  }
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:"))
      import_electron.shell.openExternal(url);
    return { action: "deny" };
  });
}
import_electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    import_electron.app.quit();
});
import_electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
import_electron.app.on("activate", () => {
  const allWindows = import_electron.BrowserWindow.getAllWindows();
  if (allWindows.length)
    allWindows[0].focus();
  else
    createWindow();
});
import_electron.app.whenReady().then(() => {
  createWindow();
});
import_electron.ipcMain.handle("exit-app", async (event, ...args) => {
  import_electron.app.exit(0);
});
