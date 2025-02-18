//РЕГИСТРАЦИЯ
function hasNumber(str) {
    return /\d/.test(str);
}

function hasSpecialCharacter(password) {
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialCharacters.test(password);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function hasUpperCase(str) {
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            return true;
        }
    }
    return false;
}

async function checkRegisterForm(event) {
    document.getElementById("error").innerHTML = "";
    event.preventDefault();
    var form = document.querySelector('form');
    var login = document.querySelector('input[name="login"]');
    var password = document.querySelector('input[name="password"]');
    var repassword = document.querySelector('input[name="repassword"]');
    var email = document.querySelector('input[name="email"]');
    loginValue = login.value;
    passwordValue = password.value;
    repasswordValue = repassword.value;
    emailValue = email.value;
    var fail = '';
    if (passwordValue.length < 6) {
        fail = "Длина пароля должна быть не меньше 6 символов";
    } else if (!hasUpperCase(passwordValue)) {
        fail = "Пароль должен содержать заглавные буквы";
    } else if (!isValidEmail(emailValue)) {
        fail = "Некорректный адрес почты";
    } else if (password.value != repassword.value) {
        fail = "Пароли должны совпадать";
    } else if (!hasNumber(passwordValue) && !hasSpecialCharacter(passwordValue)) {
        fail = "Пароль должен содержать цифры и специальный символ";
    } else if (!hasNumber(passwordValue) && hasSpecialCharacter(passwordValue)) {
        fail = "Пароль должен содержать цифры";
    } else if (hasNumber(passwordValue) && !hasSpecialCharacter(passwordValue)) {
        fail = "Пароль должен содержать специальный символ";
    }
    if (fail != "") {
        document.getElementById("error").innerHTML = fail;
    } else {
        sessionStorage.setItem('isLoggedIn', 'true'); // Сохраняем информацию о входе
        window.location.href = "/main"; // Перенаправляем на главную страницу
        // 1. Собираем данные из формы
        const formData = {
            login: loginValue,
            email: emailValue,
            password: passwordValue,
        };

        // 2. Преобразуем данные в JSON
        const jsonData = JSON.stringify(formData);

        try {
            // 3. Отправляем данные на сервер (Node.js) с помощью fetch
            const response = await fetch('http://localhost:3000/api/registration', { // Замените на URL вашего сервера
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            // 4. Обрабатываем ответ от сервера
            if (response.ok) {
                const result = await response.json();
                console.log('Успешно зарегистрирован!', result);
                alert('Вы успешно зарегистрированы!'); // Или другое уведомление
                form.reset(); // Очищаем форму
            } else {
                console.error('Ошибка регистрации:', response.status);
                const errorData = await response.json(); // Получаем сообщение об ошибке с сервера
                document.getElementById("error").innerHTML = errorData.message || 'Ошибка регистрации. Попробуйте позже.'; // Выводим сообщение об ошибке на страницу
            }

        } catch (error) {
            console.error('Произошла ошибка:', error);
            document.getElementById("error").innerHTML = 'Произошла ошибка при регистрации. Попробуйте позже.';
        }
    }

}

const registrationForm = document.querySelector('form').addEventListener('submit', checkRegisterForm);
