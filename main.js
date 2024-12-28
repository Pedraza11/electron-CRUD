const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const knex = require('./database');

let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('index.html');
});

// Eventos IPC para CRUD
ipcMain.handle('get-products', async () => {
  return await knex('productos').select('*');
});

ipcMain.handle('add-product', async (event, product) => {
  return await knex('productos').insert(product);
});

ipcMain.handle('update-product', async (event, id, product) => {
  return await knex('productos').where('id', id).update(product);
});

ipcMain.handle('delete-product', async (event, id) => {
  return await knex('productos').where('id', id).del();
});

ipcMain.handle('update-status', async (event, id, cliente, periodo) => {
  return await knex('productos').where('id', id).update({
    estado: 'NO disponible',
    cliente: cliente,
    periodo: periodo
  });
});

// Nueva ruta para desbloquear el producto (cambiar estado a 'Disponible')
ipcMain.handle('unlock-product', async (event, id) => {
  return await knex('productos').where('id', id).update({
    estado: 'Disponible' // Cambiar estado de 'NO disponible' a 'Disponible'
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
