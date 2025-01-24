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
ipcMain.handle('update-status', async (event, id, data) => {
  try {
    console.log('Datos recibidos en update-status:', { id, ...data });

    const result = await knex('productos').where('id', id).update({
      cliente_id: data.cliente_id,
      cliente: data.cliente,
      telefono: data.telefono,
      direccion: data.direccion,
      periodo: data.periodo,
      pago: data.pago,
      estado: 'No disponible',
      socio: data.socio,
    });

    console.log('Resultado de la actualización en la base de datos:', result);
    return result;
  } catch (error) {
    console.error('Error al actualizar el estado del producto:', error);
    throw error;
  }
});

// Ruta para desbloquear el producto (cambiar estado a 'Disponible')
ipcMain.handle('unlock-product', async (event, id) => {
  return await knex('productos').where('id', id).update({
    estado: 'Disponible',
    cliente: '',
    telefono: '',
    direccion: '',
    periodo: '',
    pago: false,
    socio: '',
  });
});

// Ruta para obtener clientes
ipcMain.handle('get-clients', async () => {
  return await knex('clientes').select('*');
});

// Ruta para agregar un cliente
ipcMain.handle('add-client', async (event, clientData) => {
  try {
    console.log('Intentando insertar cliente:', clientData);
    await knex('clientes').insert(clientData);
    console.log('Cliente insertado exitosamente.');
  } catch (error) {
    console.error('Error al agregar cliente:', error);
    throw error; // Propaga cualquier otro error
  }
});

// Ruta para actualizar un cliente
ipcMain.handle('update-client', async (event, id, clientData) => {
  return await knex('clientes').where('id', id).update(clientData);
});

ipcMain.handle('get-client-by-dni', async (event, dni) => {
  try {
    const client = await knex('clientes').where('dni', dni).first();
    console.log('Cliente encontrado con DNI:', dni, client); // Mostrar el cliente completo
    return client || null;
  } catch (error) {
    console.error('Error al buscar cliente por DNI:', error);
    throw error;
  }
});

ipcMain.handle('delete-client', async (event, clientId) => {
  try {
    // Eliminar el cliente de la base de datos
    await knex('clientes').where('id', clientId).del();
    console.log(`Cliente con ID ${clientId} eliminado correctamente.`);
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    throw error;
  }
});

// Ruta para insertar ganancias
ipcMain.handle('insert-earnings', async (event, earning) => {
  try {
    await knex('ganancias').insert(earning);
    console.log('Ganancia insertada:', earning);
    return { success: true };
  } catch (error) {
    console.error('Error al insertar la ganancia:', error);
    return { success: false, error };
  }
});

// Ruta para obtener ganancias por ID de producto
ipcMain.handle('get-earnings-by-product-id', async (event, productId) => {
  try {
    const earnings = await knex('ganancias').where('descripcion', 'like', `%ID: ${productId}%`);
    return earnings;
  } catch (error) {
    console.error('Error al obtener ganancias por ID de producto:', error);
    throw error;
  }
});