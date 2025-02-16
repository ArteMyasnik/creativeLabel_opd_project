function hasSpecialCharacter(password) {
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialCharacters.test(password);
    }
    
function hasUpperCase(str) {
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) { // ASCII коды заглавных букв
        return true;
        }
    }
    return false;
}
function hasNumber(str) {
    return /\d/.test(str);
  }


async function checkLoginForm(event) {
    event.preventDefault();
    document.getElementById("error").innerHTML = "";
    var form = document.querySelector('form');
    var login = document.querySelector('input[name="login"]');
    var password = document.querySelector('input[name="password"]');
    loginValue = login.value;
    passwordValue = password.value;
    var fail = '';
    if (passwordValue.length < 6) {
        fail = "Длина пароля должна быть не меньше 6 символов";
    }else if (!hasUpperCase(passwordValue)) {
        fail = "Пароль должен содержать заглавные буквы";
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
        // 1. Собираем данные из формы
        const formData = {
            login: loginValue,
            password: passwordValue
        };

        // 2. Преобразуем данные в JSON
        const jsonData = JSON.stringify(formData);

        try {
            // 3. Отправляем данные на сервер (Node.js) с помощью fetch
            const response = await fetch('http://localhost:3000/login', { // Замените на URL вашего сервера
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            // 4. Обрабатываем ответ от сервера
            if (response.ok) {
                const result = await response.json();
                console.log('Вход выполнен успешно!', result);
                alert('Вход выполнен успешно!'); // Или перенаправление на другую страницу
                // Например: window.location.href = '/profile';
            } else {
                const errorData = await response.json();
                console.error('Ошибка входа:', response.status);
                document.getElementById('error').innerText = errorData.message || 'Неверный логин или пароль.';
            }

        } catch (error) {
            console.error('Произошла ошибка:', error);
            document.getElementById('error').innerText = 'Произошла ошибка при входе. Попробуйте позже.';
        }
    }
}

const loginForm = document.querySelector('form').addEventListener('submit', checkLoginForm);