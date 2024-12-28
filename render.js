const productForm = document.getElementById('product-form');
const productTable = document.querySelector('#product-table tbody');
const productIdInput = document.getElementById('product-id');

// Formulario de cambio de estado
const statusForm = document.getElementById('status-form');
const clienteInput = document.getElementById('cliente');
const periodoInput = document.getElementById('periodo');
const saveStatusButton = document.getElementById('save-status');
const cancelStatusButton = document.getElementById('cancel-status');

let editingProductId = null;
let changingStatusId = null;

// Inicializar Flatpickr para el campo periodo (rango de fechas)
flatpickr(periodoInput, {
  enableTime: false,
  dateFormat: "Y-m-d",
  mode: "range", // Permite seleccionar un rango de fechas
  minDate: "today", // Fecha mínima para la selección
});

// Cargar los productos desde la API (ajusta según tu backend)
async function loadProducts() {
  const products = await window.api.getProducts(); // Ajusta según tu API
  productTable.innerHTML = ''; // Limpiar la tabla antes de cargar nuevos productos

  products.forEach((product) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.nombre}</td>
      <td>${product.precio}</td>
      <td>${product.cantidad}</td>
      <td>${product.estado}</td>
      <td>${product.cliente || ''}</td>
      <td>${product.periodo || ''}</td>
      <td>
        <button onclick="editProduct(${product.id})">Editar</button>
        <button onclick="deleteProduct(${product.id})">Eliminar</button>
        <button onclick="openStatusForm(${product.id})">Cambiar Estado</button>
        <button onclick="unlockProduct(${product.id})">Desbloquear</button>
      </td>
    `;
    productTable.appendChild(row);
  });
}

// Agregar o editar producto
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const cantidad = document.getElementById('cantidad').value;

  const product = { nombre, precio, cantidad };

  if (editingProductId) {
    await window.api.updateProduct(editingProductId, product);
  } else {
    await window.api.addProduct(product);
  }

  loadProducts(); // Recargar productos después de agregar o editar
  resetForm();
});

// Editar producto
function editProduct(id) {
  const product = products.find(p => p.id === id);
  document.getElementById('nombre').value = product.nombre;
  document.getElementById('precio').value = product.precio;
  document.getElementById('cantidad').value = product.cantidad;
  editingProductId = id;
}

// Eliminar producto
async function deleteProduct(id) {
  await window.api.deleteProduct(id);
  loadProducts();
}

// Abrir el formulario para cambiar el estado del producto
function openStatusForm(id) {
  changingStatusId = id;
  statusForm.classList.remove('hidden');
}

// Guardar el estado cambiado
saveStatusButton.addEventListener('click', async () => {
  const cliente = clienteInput.value;
  const periodo = periodoInput.value;

  await window.api.updateStatus(changingStatusId, cliente, periodo);
  loadProducts();
  closeStatusForm();
});

// Cancelar cambio de estado
cancelStatusButton.addEventListener('click', closeStatusForm);

// Cerrar formulario de estado
function closeStatusForm() {
  statusForm.classList.add('hidden');
  clienteInput.value = '';
  periodoInput.value = '';
}

// Desbloquear producto
async function unlockProduct(id) {
  await window.api.unlockProduct(id);
  loadProducts(); // Recargar productos después de desbloquear
}

// Cargar productos al inicio
loadProducts();
