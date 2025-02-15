const { Pool } = require('pg');
const pool = new Pool({
    user: "postgres",
    password: "iloveopd",
    host: "localhost",
    port: 5432,
    database: "creativeLabelDB"
});

module.exports = pool;