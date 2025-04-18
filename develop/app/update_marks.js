// // Метод для добавления оценок в таблицу profession_pvk
// async function addPvkMarks(professionId, userId, pvkMarks) {
//
// try {
// // Увеличиваем счётчик экспертов для профессии
// const updateProfessionQuery = `
//     UPDATE professions
//     SET expert_count = expert_count + 1
//     WHERE id = $1;
// `;
// await pool.query(updateProfessionQuery, [professionId]);
//
// // Проходим по каждому качеству и его оценке
// for (const pvkMark of pvkMarks) {
//     const { pvkId, mark } = pvkMark;
//
// // Проверяем, существует ли запись для данной профессии и PVK
// const checkQuery = `
// SELECT mark FROM profession_pvk
// WHERE profession_id = $1 AND pvk_id = $2 AND user_id = $3;
// `;
// const checkResult = await pool.query(checkQuery, [professionId, pvkId, userId]);
//
// if (checkResult.rows.length > 0) {
// // Если запись существует, обновляем оценку
// const updateQuery = `
//     UPDATE profession_pvk
//     SET mark = $1
//     WHERE profession_id = $2 AND pvk_id = $3 AND user_id = $4;
// `;
// await pool.query(updateQuery, [mark, professionId, pvkId, userId]);
// } else {
// // Если записи нет, создаем новую запись
// const insertQuery = `
//     INSERT INTO profession_pvk (profession_id, pvk_id, mark)
//     VALUES ($1, $2, $3);
// `;
// await pool.query(insertQuery, [professionId, pvkId, mark]);
// }
//
// }
//
// console.log('Оценки успешно добавлены!');
// } catch (error) {
// console.error('Ошибка при добавлении оценок:', error);
// }
// }
//
// /*
// // Пример использования
// const professionId = 1; // ID профессии
// const userId = 1; // ID эксперта
// const pvkMarks = [
// { pvkId: 1, mark: 5 }, // PVK ID и оценка
// { pvkId: 2, mark: 4 },
// { pvkId: 3, mark: 3 },
// { pvkId: 4, mark: 5 },
// { pvkId: 5, mark: 2 },
// { pvkId: 6, mark: 4 },
// { pvkId: 7, mark: 3 },
// { pvkId: 8, mark: 5 },
// ];
//
// addPvkMarks(professionId, userId, pvkMarks);
// */


// async function calculateStats(professionId, pvkId) {
//     try {
//
//         // Получаем все оценки для profession_pvk_id
//         const resultMarks = await pool.query(`
//             SELECT mark
//             FROM profession_pvk
//             WHERE profession_id = $1
//               AND pvk_id = $2;
//         `, [professionId, pvkId]);
//
//         // Извлекаем оценки
//         const marks = resultMarks.rows.map(row => row.mark);
//
//         // Кол-во оценок экспертов
//         const expertCount = await pool.query(`
//             SELECT expert_count
//             FROM profession
//             WHERE id = $1
//         `, [professionId]);
//
//         // Вычисляем среднее арифметическое var numbers = [5, 10, 15, 20];
//         const mean = marks.reduce((sum, mark) => sum + mark, 0) / expertCount;
//
//         // Вычисляем дисперсию
//         const variance = marks.reduce((sum, mark) => sum + Math.abs(mark - mean), 0) / expertCount;
//
//         return {variance, mean};
//     } catch (error) {
//         console.error('Ошибка при вычислении статистики:', error);
//         throw error;
//     }
// }
//
// // Пример использования
// const professionId = 1;
// const pvkId = 1;
// calculateStats(professionId, pvkId).then(stats => {
//     console.log('Дисперсия:', stats.variance);
//     console.log('Среднее:', stats.mean);
// });