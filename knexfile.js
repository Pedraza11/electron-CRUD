module.exports = {
    development: {
      client: 'sqlite3',
      connection: {
        filename: './database.sqlite'
      },
      useNullAsDefault: true
    }
  };