async function addExpertProfessionTest(userId, professionId, tests) {

    if (!Array.isArray(tests) || tests.length === 0) {
        throw new Error('Поле tests должно быть непустым массивом чисел');
    }
    try {

        // Проверяем, существуют ли все тесты
        const { rows } = await pool.query(
        'SELECT id FROM tests WHERE id = ANY($1)',
        [tests]
        );

        const foundTestIds = rows.map(row => row.id);
        const missingTests = tests.filter(t => !foundTestIds.includes(t));
        if (missingTests.length > 0) {
        throw new Error(`Некоторые тесты не существуют: ${missingTests.join(', ')}`);
        }
        // Проверяем, существует ли запись для данной профессии и PVK
        const checkQuery = `
        SELECT id FROM profession_test
        WHERE user_id = $1 AND profession_id = $2;
        `;
        const checkResult = await pool.query(checkQuery,[userId, professionId]);

        if (checkResult.rows.length > 0) {
        // Если запись существует, обновляем оценку
        const updateQuery = `
            UPDATE profession_test
            SET tetst = $1
            WHERE user_id = $2 AND profession_id = $3;
        `;
        await pool.query(updateQuery, [tests, userId, professionId,]);
        } else {
        // Добавляем запись
        const insertQuery = `
        INSERT INTO profession_test (user_id, profession_id, tests)
        VALUES ($1, $2, $3);
        `;
        await pool.query(insertQuery, [userId, professionId, tests]);
        }
    } catch (error) {
        console.error('Ошибка при добавлении тестов от эксперта:', error);
    }
}