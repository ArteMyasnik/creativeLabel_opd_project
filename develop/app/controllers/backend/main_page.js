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
document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('login-button');
  const registrationButton = document.getElementById('registration_button');
  const logoutButton = document.getElementById('logout-button');
  function updateAuthButtons() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
      loginButton.style.display = 'none';
      registrationButton.style.display = 'none';
      logoutButton.style.display = 'inline-block'; // Или 'block'
    } else {
      loginButton.style.display = 'inline-block'; // Или 'block'
      registrationButton.style.display = 'inline-block'; // Или 'block'
      logoutButton.style.display = 'none';
    }
  }

  // Изначальная проверка при загрузке страницы
  updateAuthButtons();

  // Пока что у нас нет обработки формы входа на этой странице,
  // поэтому я просто добавлю пример, как можно вызвать updateAuthButtons
  // после успешного входа на другой странице (например, login_page.html).
  // Предположим, что после успешного входа на login_page.html, мы устанавливаем
  // sessionStorage.setItem('isLoggedIn', 'true');
  // Затем, когда мы возвращаемся на эту страницу (main_page.html), функция
  // updateAuthButtons() будет вызвана автоматически и кнопки будут обновлены.

  // Обработка выхода:
  logoutButton.addEventListener('click', function() {
    sessionStorage.removeItem('isLoggedIn'); // Удаляем информацию об аутентификации
    updateAuthButtons(); // Обновляем отображение кнопок
    // Дополнительно: Отправить запрос на сервер для завершения сессии (если необходимо)

    // Дополнительно: перенаправляем на страницу входа, если хотим
    //window.location.href = "login_page.html";
  });
});
