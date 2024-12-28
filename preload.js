const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getProducts: () => ipcRenderer.invoke('get-products'),
  addProduct: (product) => ipcRenderer.invoke('add-product', product),
  updateProduct: (id, product) => ipcRenderer.invoke('update-product', id, product),
  deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
  updateStatus: (id, cliente, periodo) => ipcRenderer.invoke('update-status', id, cliente, periodo),
  unlockProduct: (id) => ipcRenderer.invoke('unlock-product', id)
});
