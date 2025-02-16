-- Удаление таблиц, если они существуют (для очистки базы данных перед созданием)
DROP TABLE IF EXISTS test_user CASCADE;
DROP TABLE IF EXISTS test_pvk CASCADE;
DROP TABLE IF EXISTS profession_pvk CASCADE;
DROP TABLE IF EXISTS tests CASCADE;
DROP TABLE IF EXISTS pvks CASCADE;
DROP TABLE IF EXISTS professions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Создание таблицы users (Пользователи)
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       login VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(64) NOT NULL,
                       isAdmin BOOLEAN DEFAULT FALSE,
                       isModerator BOOLEAN DEFAULT FALSE,
                       createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       age INT,
                       sex VARCHAR(10) CHECK (sex IN ('male', 'female')) -- Ограничение на пол
);

-- Создание таблицы tests (Тесты)
CREATE TABLE tests (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       description TEXT,
                       approximate_time_of_completion INT -- Время в минутах
);

-- Создание таблицы pvks (Профессионально важные качества)
CREATE TABLE pvks (
                      id SERIAL PRIMARY KEY,
                      pvk VARCHAR(255) NOT NULL,
                      description TEXT
);

-- Создание таблицы professions (Профессии)
CREATE TABLE professions (
                             id SERIAL PRIMARY KEY,
                             name VARCHAR(255) NOT NULL,
                             description TEXT
);

-- Создание таблицы profession_pvk (Связь профессий и PVK)
CREATE TABLE profession_pvk (
                                id SERIAL PRIMARY KEY,
                                profession_id INT REFERENCES professions(id) ON DELETE CASCADE,
                                pvk_id INT REFERENCES pvks(id) ON DELETE CASCADE,
                                UNIQUE (profession_id, pvk_id) -- Уникальная связь
);

-- Создание таблицы test_pvk (Связь тестов и PVK)
CREATE TABLE test_pvk (
                          id SERIAL PRIMARY KEY,
                          test_id INT REFERENCES tests(id) ON DELETE CASCADE,
                          pvk_id INT REFERENCES pvks(id) ON DELETE CASCADE,
                          UNIQUE (test_id, pvk_id) -- Уникальная связь
);

-- Создание таблицы test_user (Результаты прохождения тестов пользователями)
CREATE TABLE test_user (
                           id SERIAL PRIMARY KEY,
                           test_id INT REFERENCES tests(id) ON DELETE CASCADE,
                           user_id INT REFERENCES users(id) ON DELETE CASCADE,
                           result INT,
                           time_of_passage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           UNIQUE (test_id, user_id) -- Уникальная связь
);

-- Создание индексов для ускорения поиска
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tests_name ON tests(name);
CREATE INDEX idx_pvks_pvk ON pvks(pvk);
CREATE INDEX idx_professions_name ON professions(name);