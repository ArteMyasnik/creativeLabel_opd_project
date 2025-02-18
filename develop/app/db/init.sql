-- Создание таблицы users
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       login VARCHAR(255) NOT NULL UNIQUE,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(64) NOT NULL,
                       isAdmin BOOLEAN DEFAULT FALSE,
                       isModerator BOOLEAN DEFAULT FALSE,
                       createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       age INT,
                       sex VARCHAR(10) CHECK (sex IN ('male', 'female'))
);

-- Создание таблицы tests
CREATE TABLE tests (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       description TEXT,
                       approximate_time_of_completion INT
);

-- Создание таблицы pvks (Профессионально-важные качества)
CREATE TABLE pvks (
                      id SERIAL PRIMARY KEY,
                      pvk VARCHAR(255) NOT NULL,
                      description TEXT
);

-- Создание таблицы professions
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
                                UNIQUE (profession_id, pvk_id)
);

-- Создание таблицы test_pvk (Связь тестов и PVK)
CREATE TABLE test_pvk (
                          id SERIAL PRIMARY KEY,
                          test_id INT REFERENCES tests(id) ON DELETE CASCADE,
                          pvk_id INT REFERENCES pvks(id) ON DELETE CASCADE,
                          UNIQUE (test_id, pvk_id)
);

-- Создание таблицы test_user (Связь пользователей и тестов)
CREATE TABLE test_user (
                           id SERIAL PRIMARY KEY,
                           test_id INT REFERENCES tests(id) ON DELETE CASCADE,
                           user_id INT REFERENCES users(id) ON DELETE CASCADE,
                           result INT,
                           time_of_passage TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных данных (опционально)
-- Пример добавления ролей, если они нужны
CREATE TABLE roles (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
                            id SERIAL PRIMARY KEY,
                            user_id INT REFERENCES users(id) ON DELETE CASCADE,
                            role_id INT REFERENCES roles(id) ON DELETE CASCADE,
                            UNIQUE (user_id, role_id)
);

INSERT INTO roles (name) VALUES ('admin'), ('moderator'), ('user');

-- Создание индексов для ускорения запросов (опционально)
CREATE INDEX idx_users_login ON users(login);
CREATE INDEX idx_tests_name ON tests(name);
CREATE INDEX idx_pvks_pvk ON pvks(pvk);
CREATE INDEX idx_professions_name ON professions(name);

-- Вставка начальных данных (опционально)
INSERT INTO users (login, email, password_hash) VALUES
                            ('admin', 'admin@example.com', 'hashed_password_here'),
                            ('user1', 'user1@example.com', 'hashed_password_here');