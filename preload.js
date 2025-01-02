const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getProducts: () => ipcRenderer.invoke('get-products'),
  getProductById: (id) => ipcRenderer.invoke('get-product-by-id', id),
  addProduct: (product) => ipcRenderer.invoke('add-product', product),
  updateProduct: (id, product) => ipcRenderer.invoke('update-product', id, product),
  deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
  updateStatus: (id, cliente, telefono, periodo) => ipcRenderer.invoke('update-status', id, cliente, telefono, periodo),
  unlockProduct: (id) => ipcRenderer.invoke('unlock-product', id)
});