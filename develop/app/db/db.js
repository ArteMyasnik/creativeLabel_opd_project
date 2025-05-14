// POSTGRESQL
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

module.exports = pool;

// require('dotenv').config();
// const { createTunnel } = require('tunnel-ssh'); // <-- обновлённый импорт
// const { Pool } = require('pg');
//
// const tunnelConfig = {
//     username: process.env.SSH_USER,
//     host: process.env.SSH_HOST,
//     port: Number(process.env.SSH_PORT),
//     dstHost: process.env.DB_HOST,
//     dstPort: Number(process.env.DB_PORT),
//     localHost: '127.0.0.1',
//     localPort: Number(process.env.LOCAL_PORT),
//     password: process.env.SSH_PASSWORD || undefined,
//     keepAlive: true,
//     tryKeyboard: true,
// };
//
// const poolConfig = {
//     host: '127.0.0.1',
//     port: Number(process.env.LOCAL_PORT),
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD || undefined,
// };
//
// const dbPromise = new Promise((resolve, reject) => {
//     createTunnel(tunnelConfig, (error, server) => {
//         if (error) {
//             console.error('Ошибка при создании SSH-туннеля:', error);
//             return reject(error);
//         }
//
//         const pool = new Pool(poolConfig);
//
//         pool.connect((err, client, release) => {
//             if (err) {
//                 console.error('Ошибка подключения к базе данных:', err);
//                 server.close();
//                 return reject(err);
//             }
//
//             release();
//             console.log('✅ Подключение к базе данных установлено через SSH-туннель');
//             resolve(pool);
//         });
//     });
// });
//
// module.exports = dbPromise;
