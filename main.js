const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const knex = require('./database');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Ruta para obtener productos
ipcMain.handle('get-products', async () => {
  return await knex('productos').select('*');
});

// Ruta para obtener un producto por ID
ipcMain.handle('get-product-by-id', async (event, id) => {
  return await knex('productos').where('id', id).first();
});

// Ruta para agregar un producto
ipcMain.handle('add-product', async (event, product) => {
  return await knex('productos').insert(product);
});

// Ruta para actualizar un producto
ipcMain.handle('update-product', async (event, id, product) => {
  return await knex('productos').where('id', id).update(product);
});

// Ruta para eliminar un producto
ipcMain.handle('delete-product', async (event, id) => {
  return await knex('productos').where('id', id).del();
});

// Ruta para actualizar el estado del producto
ipcMain.handle('update-status', async (event, id, cliente, telefono, direccion, periodo, pago) => {
  return await knex('productos').where('id', id).update({
    estado: 'No disponible',
    cliente: cliente,
    telefono: telefono,
    direccion: direccion,
    periodo: periodo,
    pago: pago
  });
});

// Nueva ruta para desbloquear el producto (cambiar estado a 'Disponible')
ipcMain.handle('unlock-product', async (event, id) => {
  return await knex('productos').where('id', id).update({
    estado: 'Disponible',
    cliente: '',
    telefono: '',
    direccion: '',
    periodo: '',
    pago: false
  });
});