const { Pool } = require('pg');
require('dotenv').config()

// Create a pool instance and pass in our config, which we set in our env vars
const pool = new Pool({
    user: 'ubuntu2',
    host: process.env.DB_HOST,
    database: 'reviews',
    password: 'ubuntu',
    port: process.env.PG_PORT
});

module.exports = {
  query: (text, params, callback) => {
      return pool.query(text, params, callback);
  },
  connect: (err, client, done) => {
      return pool.connect(err, client, done);
  },
};