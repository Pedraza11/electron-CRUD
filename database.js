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
        table.string('periodo'); // Periodo de préstamo
      });
      console.log('Tabla "productos" creada.');
    } else {
      // Si la tabla ya existe, comprobamos si las columnas están presentes
      const tableInfo = await knex('productos').columnInfo();
  
      // Verificar si las columnas 'estado', 'cliente' y 'periodo' existen, y agregarlas si no
      if (!tableInfo.hasOwnProperty('estado')) {
        await knex.schema.table('productos', (table) => {
          table.string('estado').defaultTo('disponible');
        });
        console.log('Columna "estado" agregada.');
      }
      if (!tableInfo.hasOwnProperty('cliente')) {
        await knex.schema.table('productos', (table) => {
          table.string('cliente');
        });
        console.log('Columna "cliente" agregada.');
      }
      if (!tableInfo.hasOwnProperty('periodo')) {
        await knex.schema.table('productos', (table) => {
          table.string('periodo');
        });
        console.log('Columna "periodo" agregada.');
      }
    }
  }).catch((error) => {
    console.error('Error al verificar o crear la tabla:', error);
  });
  
  module.exports = knex;
  