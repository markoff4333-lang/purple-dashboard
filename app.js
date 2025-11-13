document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
  const btnCheckin = document.getElementById("btnCheckin");
  const userSelect = document.getElementById("userSelect");
  const welcome = document.getElementById("welcome");
  const status = document.getElementById("status");
  const arrivalSpan = document.getElementById("arrivalTime");

  // Ключи для localStorage
  const STORAGE_USER_ID = "pd_current_user_id";
  const STORAGE_ARRIVAL = "pd_arrival_time";

  // Наши тренировочные пользователи
  const users = [
    { id: 1, short: "Серёга Л.", full: "Лях Вячеслав Михайлович" },
    { id: 2, short: "Иван И.", full: "Иван Иванович" },
    { id: 3, short: "Мария П.", full: "Мария Петровна" },
  ];

  // Заполняем select
  users.forEach((u) => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = u.short;
    userSelect.appendChild(opt);
  });

  let currentUser = null;

  // --- ВОССТАНОВЛЕНИЕ ДАННЫХ ИЗ localStorage ---
  const savedUserId = Number(localStorage.getItem(STORAGE_USER_ID));
  const savedArrival = localStorage.getItem(STORAGE_ARRIVAL);

  if (savedUserId) {
    const u = users.find((x) => x.id === savedUserId);
    if (u) {
      currentUser = u;
      userSelect.value = String(u.id);
      welcome.textContent = `Добро пожаловать, ${u.short}!`;
      btnCheckin.disabled = false; // раз уже был вход, позволим снова отмечаться
    }
  }

  if (savedArrival) {
    arrivalSpan.textContent = savedArrival;
    if (currentUser) {
      status.textContent = `${currentUser.short} пришёл в ${savedArrival} (данные сохранены).`;
    } else {
      status.textContent = `Приход в ${savedArrival} (данные сохранены).`;
    }
  }

  // --- Обработчик "Войти" ---
  btnLogin.addEventListener("click", () => {
    const userId = Number(userSelect.value);
    currentUser = users.find((u) => u.id === userId);

    if (!currentUser) {
      status.textContent = "Сначала выберите пользователя.";
      return;
    }

    welcome.textContent = `Добро пожаловать, ${currentUser.short}!`;
    btnCheckin.disabled = false;

    // сохраняем выбранного пользователя
    localStorage.setItem(STORAGE_USER_ID, String(currentUser.id));

    status.textContent = `${currentUser.short} вошёл в систему.`;
  });

  // --- Обработчик "Отметиться" ---
  btnCheckin.addEventListener("click", () => {
    if (!currentUser) {
      status.textContent = "Сначала войдите.";
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // показываем время прихода
    arrivalSpan.textContent = timeStr;

    // сохраняем в localStorage
    localStorage.setItem(STORAGE_ARRIVAL, timeStr);
    localStorage.setItem(STORAGE_USER_ID, String(currentUser.id));

    status.textContent = `${currentUser.short} отметился в ${timeStr}.`;
  });
});