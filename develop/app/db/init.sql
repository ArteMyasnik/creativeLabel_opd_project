-- Создание таблицы users
CREATE TABLE users
(
    id            SERIAL PRIMARY KEY,
    login         VARCHAR(255) NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(64)  NOT NULL,
    isAdmin       BOOLEAN   DEFAULT FALSE,
    isModerator   BOOLEAN   DEFAULT FALSE,
    createdAt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    age           INT,
    sex           VARCHAR(10) CHECK (sex IN ('male', 'female'))
);

-- Создание таблицы tests
CREATE TABLE tests
(
    id                             SERIAL PRIMARY KEY,
    name                           VARCHAR(255) NOT NULL,
    description                    TEXT,
    approximate_time_of_completion INT
);

-- Создание таблицы pvks (Профессионально-важные качества)
CREATE TABLE pvks
(
    id          SERIAL PRIMARY KEY,
    pvk         VARCHAR(255) NOT NULL,
    description TEXT
);

-- Создание таблицы professions
CREATE TABLE professions
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT
);

-- Создание таблицы profession_pvk (Связь профессий и PVK)
CREATE TABLE profession_pvk
(
    id            SERIAL PRIMARY KEY,
    profession_id INT REFERENCES professions (id) ON DELETE CASCADE,
    pvk_id        INT REFERENCES pvks (id) ON DELETE CASCADE,
    UNIQUE (profession_id, pvk_id)
);

-- Создание таблицы test_pvk (Связь тестов и PVK)
CREATE TABLE test_pvk
(
    id      SERIAL PRIMARY KEY,
    test_id INT REFERENCES tests (id) ON DELETE CASCADE,
    pvk_id  INT REFERENCES pvks (id) ON DELETE CASCADE,
    UNIQUE (test_id, pvk_id)
);

-- Создание таблицы test_user (Связь пользователей и тестов)
CREATE TABLE test_user
(
    id              SERIAL PRIMARY KEY,
    test_id         INT REFERENCES tests (id) ON DELETE CASCADE,
    user_id         INT REFERENCES users (id) ON DELETE CASCADE,
    result          INT,
    time_of_passage TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных данных (опционально)
-- Пример добавления ролей, если они нужны
CREATE TABLE roles
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles
(
    id      SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    role_id INT REFERENCES roles (id) ON DELETE CASCADE,
    UNIQUE (user_id, role_id)
);

INSERT INTO roles (name)
VALUES ('admin'),
       ('moderator'),
       ('user');

-- Создание индексов для ускорения запросов (опционально)
CREATE INDEX idx_users_login ON users (login);
CREATE INDEX idx_tests_name ON tests (name);
CREATE INDEX idx_pvks_pvk ON pvks (pvk);
CREATE INDEX idx_professions_name ON professions (name);

-- Вставка начальных данных (опционально)
INSERT INTO users (login, email, password_hash, isAdmin, isModerator)
VALUES ('ArteMyasnik', 'artemyasnik@mail.ru', '$2b$10$61V2A10gT0xfEwrzB.dzCOg9diVbpmcRjjh6Jb90and4T02Zz66My', true, true),
       ('everpr0g', 'everpr0g@mail.ru', '$2b$10$61V2A10gT0xfEwrzB.dzCOg9diVbpmcRjjh6Jb90and4T02Zz66My', true, true),
       ('sdnssijxi', 'sdnssijxi@mail.ru', '$2b$10$61V2A10gT0xfEwrzB.dzCOg9diVbpmcRjjh6Jb90and4T02Zz66My', true, true),
       ('tanunika', 'tanunika@mail.ru', '$2b$10$61V2A10gT0xfEwrzB.dzCOg9diVbpmcRjjh6Jb90and4T02Zz66My', true, true),
       ('tisak142', 'tisak142@mail.ru', '$2b$10$61V2A10gT0xfEwrzB.dzCOg9diVbpmcRjjh6Jb90and4T02Zz66My', true, true),
       ('xqzmy22', 'xqzmy22@mail.ru', '$2b$10$61V2A10gT0xfEwrzB.dzCOg9diVbpmcRjjh6Jb90and4T02Zz66My', true, true),
       ('Barrrakyda', 'barrrakyda@mail.ru', '$2b$10$61V2A10gT0xfEwrzB.dzCOg9diVbpmcRjjh6Jb90and4T02Zz66My', true, true),
       ('oleg-music', 'oleg_music@mail.ru', '$2b$10$61V2A10gT0xfEwrzB.dzCOg9diVbpmcRjjh6Jb90and4T02Zz66My', true, true);

-- Распределение ролей
DO
$$
DECLARE
r_admin INT;
    r_moderator
INT;
    r_user
INT;
    u_id
INT;
    u_isAdmin
BOOLEAN;
    u_isModerator
BOOLEAN;
BEGIN
    -- Получаем ID для ролей
SELECT id
INTO r_admin
FROM roles
WHERE name = 'admin';
SELECT id
INTO r_moderator
FROM roles
WHERE name = 'moderator';
SELECT id
INTO r_user
FROM roles
WHERE name = 'user';

-- Пробегаем по всем пользователям
FOR u_id IN (SELECT id FROM users) LOOP
        -- Получаем значения isAdmin и isModerator для текущего пользователя
SELECT isAdmin, isModerator
INTO u_isAdmin, u_isModerator
FROM users
WHERE id = u_id;

-- Присваиваем роли в зависимости от флагов
IF
u_isAdmin THEN
            -- Если isAdmin = true, присваиваем роль admin
            INSERT INTO user_roles (user_id, role_id) VALUES (u_id, r_admin)
            ON CONFLICT (user_id, role_id) DO NOTHING;
        ELSIF
u_isModerator THEN
            -- Если isModerator = true, присваиваем роль moderator
            INSERT INTO user_roles (user_id, role_id) VALUES (u_id, r_moderator)
            ON CONFLICT (user_id, role_id) DO NOTHING;
ELSE
            -- Если ни один флаг не установлен, присваиваем роль user
            INSERT INTO user_roles (user_id, role_id) VALUES (u_id, r_user)
            ON CONFLICT (user_id, role_id) DO NOTHING;
END IF;
END LOOP;
END $$;