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
    if (charCode >= 65 && charCode <= 90) { // ASCII коды заглавных букв
    return true;
    }
}
return false;
}

function checkRegisterForm(event) {
    event.preventDefault();
    var form = document.querySelector('form');
    var login = document.querySelector('[name="login"]');
    var password = document.querySelector('[name="password"]');
    var repassword = document.querySelector('[name="repassword"]');
    var email = document.querySelector('[name="email"]');
    loginValue = login.value;
    passwordValue = password.value;
    repasswordValue = repassword.value;
    emailValue = email.value;
    var fail = '';
    if (!hasUpperCase(loginValue)) {
        fail = "Логин должен содержать заглавные буквы";
    } else if (!isValidEmail(emailValue)) {
        fail = "Некорректный адрес почты";
    } else if (password.value.length < 6) {
        fail = "Длина пароля должна быть не меньше 6 символов";
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
        alert("Все данные заполнены корректно");
      }

}

const registrationForm = document.querySelector('form').addEventListener('submit', checkRegisterForm);



//МЕНЮ
// Функция для показа/скрытия выпадающего меню
function toggleDropdown() {
    const dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");
  }

  // Закрытие выпадающего меню при клике вне его области
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }