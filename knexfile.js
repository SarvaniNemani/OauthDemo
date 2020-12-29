// Update with your config settings.

require('dotenv').config()

console.log(process.env.DB_NAME);
module.exports = {

  client: 'mysql2',
  connection: {
    multipleStatements: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
    typeCast: function (field, next) {
      // console.log("typeCast::", field.type)
      if (field.type == 'JSON') {
        return (JSON.parse(field.string())); 
      } else if (field.type === 'TINY' && field.length === 1) {
        return (field.string() === '1'); // 1 = true, 0 = false
      } 
      // else if (field.type == 'TIMESTAMP') {
      //   console.log("field:: ", field)
      //   // console.log(field.string())
      //   return next();
      // }
      return next();
    }
  },
  pool: {
    min: 2,
    max: 50
  },
  migrations: {
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './seeds'
  }

};




