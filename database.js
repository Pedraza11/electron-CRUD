const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database.sqlite' // Archivo SQLite
  },
  useNullAsDefault: true
});

// Crear tabla de productos si no existe
knex.schema.hasTable('productos').then(async (exists) => {
  if (!exists) {
    await knex.schema.createTable('productos', (table) => {
      table.increments('id').primary();
      table.string('nombre');
      table.float('precio');
      table.integer('cantidad');
      table.string('estado').defaultTo('disponible'); // Nueva columna
      table.integer('cliente_id').references('id').inTable('clientes').nullable(); // Relación con cliente
      table.string('periodo'); // Periodo de préstamo
      table.boolean('pago').defaultTo(false); // Estado de pago
      table.string('socio').defaultTo(''); // Con valor por defecto
    });
    console.log('Tabla "productos" creada.');
  }
});

// Crear tabla de clientes si no existe
knex.schema.hasTable('clientes').then(async (exists) => {
  if (!exists) {
    await knex.schema.createTable('clientes', (table) => {
      table.increments('id').primary();
      table.string('nombre').notNullable();
      table.string('direccion').notNullable();
      table.string('dni').unique().notNullable();
      table.string('telefono').notNullable();
      table.string('garante_nombre').notNullable(); // Nombre del garante
      table.string('garante_telefono').notNullable(); // Teléfono del garante
    });
    console.log('Tabla "clientes" creada.');
  }
});

// Crear tabla de ganancias si no existe y agregar columna descripcion si no existe
knex.schema.hasTable('ganancias').then(async (exists) => {
  if (!exists) {
    await knex.schema.createTable('ganancias', (table) => {
      table.increments('id').primary();
      table.decimal('monto', 10, 2).notNullable();
      table.date('fecha').notNullable();
      table.string('descripcion').notNullable();
    });
    console.log('Tabla "ganancias" creada.');
  } else {
    // Agregar columna descripcion si no existe
    const hasDescripcionColumn = await knex.schema.hasColumn('ganancias', 'descripcion');
    if (!hasDescripcionColumn) {
      await knex.schema.table('ganancias', (table) => {
        table.string('descripcion').notNullable();
      });
      console.log('Columna "descripcion" agregada a la tabla "ganancias".');
    }
  }
});

module.exports = knex;