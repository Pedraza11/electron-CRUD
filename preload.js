const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getProducts: () => ipcRenderer.invoke('get-products'),
  getProductById: (id) => ipcRenderer.invoke('get-product-by-id', id),
  addProduct: (product) => ipcRenderer.invoke('add-product', product),
  updateProduct: (id, product) => ipcRenderer.invoke('update-product', id, product),
  deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
  updateStatus: (id, cliente, telefono, direccion, periodo, pago) => ipcRenderer.invoke('update-status', id, cliente, telefono, direccion, periodo, pago),
  unlockProduct: (id) => ipcRenderer.invoke('unlock-product', id),
  addClient: (clientData) => ipcRenderer.invoke('add-client', clientData),
  getClients: () => ipcRenderer.invoke('get-clients'),
  getClientByDni: (dni) => ipcRenderer.invoke('get-client-by-dni', dni),
  deleteClient: (clientId) => ipcRenderer.invoke('delete-client', clientId),
  insertEarnings: (earning) => ipcRenderer.invoke('insert-earnings', earning),
  getEarningsByProductId: (productId) => ipcRenderer.invoke('get-earnings-by-product-id', productId)
});