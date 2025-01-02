const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite' // Archivo SQLite
  },
  useNullAsDefault: true
});

// Crear tabla si no existe
knex.schema.hasTable('productos').then(async (exists) => {
  if (!exists) {
    // Si la tabla no existe, la creamos
    await knex.schema.createTable('productos', (table) => {
      table.increments('id').primary();
      table.string('nombre');
      table.float('precio');
      table.integer('cantidad');
      table.string('estado').defaultTo('disponible'); // Nueva columna
      table.string('cliente'); // Cliente
      table.string('telefono'); // Teléfono del cliente
      table.string('periodo'); // Periodo de préstamo
    });
    console.log('Tabla "productos" creada.');
  } else {
    // Si la tabla ya existe, comprobamos si las columnas están presentes
    const tableInfo = await knex('productos').columnInfo();
    if (!tableInfo.telefono) {
      // Si la columna 'telefono' no existe, la agregamos
      await knex.schema.table('productos', (table) => {
        table.string('telefono'); // Teléfono del cliente
      });
      console.log('Columna "telefono" agregada a la tabla "productos".');
    }
    if (!tableInfo.periodo) {
      // Si la columna 'periodo' no existe, la agregamos
      await knex.schema.table('productos', (table) => {
        table.string('periodo'); // Periodo de préstamo
      });
      console.log('Columna "periodo" agregada a la tabla "productos".');
    }
  }
});

module.exports = knex;