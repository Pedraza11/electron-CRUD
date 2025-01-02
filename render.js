const productForm = document.getElementById('product-form');
const productTable = document.querySelector('#product-table tbody');
const productSummaryTable = document.querySelector('#product-summary-table tbody'); // Tabla de resumen
const searchInput = document.getElementById('searchInput'); // Campo de búsqueda

// Formulario de cambio de estado
const statusForm = document.getElementById('status-form');
const clienteInput = document.getElementById('cliente');
const telefonoInput = document.getElementById('telefono'); // Campo de teléfono
const periodoInput = document.getElementById('periodo');
const saveStatusButton = document.getElementById('save-status');
const cancelStatusButton = document.getElementById('cancel-status');

let editingProductId = null;
let changingStatusId = null;
let allProducts = []; // Variable para almacenar todos los productos

// Inicializar Flatpickr para el campo periodo (rango de fechas)
flatpickr(periodoInput, {
  enableTime: false,
  dateFormat: "Y-m-d",
  mode: "range", // Permite seleccionar un rango de fechas
  minDate: "today", // Fecha mínima para la selección
});

// Cargar los productos desde la API (ajusta según tu backend)
async function loadProducts() {
  console.log("Cargando productos...");  // Paso de depuración para verificar que la función se ejecuta
  try {
    const products = await window.api.getProducts(); // Ajusta según tu API
    console.log("Productos obtenidos:", products); // Verificar los productos que se obtienen de la API
    allProducts = products; // Almacenar todos los productos en la variable global

    renderProducts(products); // Renderizar productos
    renderProductSummary(products); // Renderizar resumen de productos

  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

// Renderizar productos en la tabla
function renderProducts(products) {
  productTable.innerHTML = ''; // Limpiar la tabla de productos antes de cargar nuevos productos

  products.forEach((product) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.nombre}</td>
      <td>${product.precio}</td>
      <td>${product.cantidad}</td>
      <td>${product.estado}</td>
      <td>${product.cliente || ''}</td>
      <td>${product.telefono || ''}</td> <!-- Asegúrate de que el campo telefono se renderice correctamente -->
      <td>${product.periodo || ''}</td> <!-- Asegúrate de que el campo periodo se renderice correctamente -->
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

// Renderizar resumen de productos
function renderProductSummary(products) {
  productSummaryTable.innerHTML = ''; // Limpiar la tabla de resumen

  // Crear un objeto para llevar la contabilidad de las cantidades de cada producto
  const productCounts = {};

  products.forEach((product) => {
    // Contabilizar la cantidad de productos por nombre
    if (productCounts[product.nombre]) {
      productCounts[product.nombre] += product.cantidad;
    } else {
      productCounts[product.nombre] = product.cantidad;
    }
  });

  // Actualizar la tabla de resumen con las cantidades totales por producto
  Object.keys(productCounts).forEach((productName) => {
    const summaryRow = document.createElement('tr');
    summaryRow.innerHTML = `
      <td class="accordion-toggle" data-product-name="${productName}">${productName}</td>
      <td>${productCounts[productName]}</td>
    `;
    productSummaryTable.appendChild(summaryRow);
  });

  // Agregar evento de clic a las filas de resumen para desplegar productos
  document.querySelectorAll('.accordion-toggle').forEach(row => {
    row.addEventListener('click', (event) => {
      const productName = event.target.getAttribute('data-product-name');
      toggleProductDetails(productName);
    });
  });
}

// Función para buscar productos
function searchProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredProducts = allProducts.filter(product => 
    product.nombre.toLowerCase().includes(searchTerm)
  );
  renderProducts(filteredProducts);
}

// Función para filtrar y ordenar productos por vencimiento
function filterByExpiration() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignorar horas, minutos, segundos

  const productsWithDaysLeft = allProducts.map(product => {
    if (product.periodo) {
      const periodo = product.periodo.split(' to ');
      const endDate = new Date(periodo[1]);
      endDate.setHours(0, 0, 0, 0); // Ignorar horas, minutos, segundos

      // Calcular la diferencia en días
      const timeDiff = endDate - today;
      const daysLeft = timeDiff / (1000 * 60 * 60 * 24);

      return { ...product, daysLeft };
    }
    return { ...product, daysLeft: Infinity }; // Si no tiene periodo, lo ponemos al final
  });

  // Filtrar productos que tienen un periodo de vencimiento definido
  const filteredProducts = productsWithDaysLeft.filter(product => product.daysLeft !== Infinity);

  // Ordenar los productos por la fecha más cercana a la fecha actual
  filteredProducts.sort((a, b) => a.daysLeft - b.daysLeft);

  console.log("Productos filtrados y ordenados:", filteredProducts);
  renderProducts(filteredProducts);
}

// Función para listar todos los productos sin ningún filtro
function listarProductos() {
  renderProducts(allProducts);
}

// Función para desplegar productos en la tabla de resumen
function toggleProductDetails(productName) {
  const productRows = document.querySelectorAll(`#product-table tbody tr`);
  productRows.forEach(row => {
    if (row.querySelector('td:nth-child(2)').innerText === productName) {
      row.classList.toggle('hidden');
    }
  });
}

// Agregar o editar producto
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const cantidad = parseInt(document.getElementById('cantidad').value, 10);

  console.log("Formulario enviado", { nombre, precio, cantidad }); // Verificar datos del formulario

  if (editingProductId === null) {
    // Si no estamos editando un producto, creamos uno nuevo
    for (let i = 0; i < cantidad; i++) {
      const product = { nombre, precio, cantidad: 1 };
      await window.api.addProduct(product);
    }
  } else {
    // Si estamos editando un producto, actualizamos el producto
    const product = { nombre, precio, cantidad };
    await window.api.updateProduct(editingProductId, product);
    editingProductId = null; // Resetear la variable para no seguir en modo de edición
  }

  loadProducts(); // Recargar productos después de agregar o editar

  // Limpiar el formulario después de cargar los productos
  productForm.reset();
});

// Editar producto
async function editProduct(id) {
  console.log("Editando producto con ID:", id); // Verificar si el ID de producto es correcto
  try {
    editingProductId = id;
    const product = await window.api.getProductById(id);
    if (!product) {
      console.error('Producto no encontrado');
      return;
    }
    console.log("Producto a editar:", product); // Verificar datos del producto
    document.getElementById('nombre').value = product.nombre;
    document.getElementById('precio').value = product.precio;
    document.getElementById('cantidad').value = product.cantidad;
    document.getElementById('cliente').value = product.cliente || '';
    document.getElementById('telefono').value = product.telefono || '';
    document.getElementById('periodo').value = product.periodo || '';
  } catch (error) {
    console.error('Error al editar el producto:', error);
  }
}

// Eliminar producto
async function deleteProduct(id) {
  console.log("Eliminando producto con ID:", id); // Verificar ID de producto a eliminar
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
  const telefono = telefonoInput.value; // Obtener el valor del campo de teléfono
  const periodo = periodoInput.value;

  console.log("Guardando estado con cliente:", cliente, "teléfono:", telefono, "y periodo:", periodo); // Verificar datos del formulario

  await window.api.updateStatus(changingStatusId, cliente, telefono, periodo);
  loadProducts();
  closeStatusForm();
});

// Cancelar cambio de estado
cancelStatusButton.addEventListener('click', closeStatusForm);

// Cerrar formulario de estado
function closeStatusForm() {
  statusForm.classList.add('hidden');
  clienteInput.value = '';
  telefonoInput.value = ''; // Limpiar el campo de teléfono
  periodoInput.value = '';
}

// Desbloquear producto
async function unlockProduct(id) {
  console.log("Desbloqueando producto con ID:", id); // Verificar desbloqueo
  // Actualizar cliente, teléfono, periodo y estado en la base de datos
  await window.api.updateProduct(id, {
    estado: 'Disponible',
    cliente: '',
    telefono: '', // Limpiar el campo de teléfono
    periodo: ''
  });

  // Recargar productos para reflejar los cambios en la tabla
  loadProducts();
}

// Cargar productos al inicio
loadProducts();