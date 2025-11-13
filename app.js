document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.getElementById("btnLogin");
  const btnCheckin = document.getElementById("btnCheckin");
  const userSelect = document.getElementById("userSelect");
  const welcome = document.getElementById("welcome");
  const status = document.getElementById("status");
  const arrivalSpan = document.getElementById("arrivalTime");
  const dutyLeadName = document.getElementById("dutyLeadName");

  // Ключи для localStorage
  const STORAGE_USER_ID = "pd_current_user_id";
  const STORAGE_ARRIVAL = "pd_arrival_time";

  // Тестовые пользователи
  const users = [
    { id: 1, short: "Иванов И.И.", full: "Иванов Иван Иванович" },
    { id: 2, short: "Петров П.П.", full: "Петров Пётр Петрович" },
    { id: 3, short: "Сидорова М.А.", full: "Сидорова Мария Александровна" },
    { id: 4, short: "Кузнецов А.О.", full: "Кузнецов Алексей Олегович" },
  ];

  // 📅 Расписание дежурных (тестовые ФИО)
  // 0 = Вс, 1 = Пн ... 6 = Сб
  const dutySchedule = {
    1: "Иванов Иван Иванович",         // Пн
    2: "Петров Пётр Петрович",         // Вт
    3: "Сидорова Мария Александровна", // Ср
    4: "Кузнецов Алексей Олегович",    // Чт
    5: "Иванов Иван Иванович",         // Пт
    // Сб и Вс – выходные
  };

  // 👉 Определяем дежурного по текущему дню недели
  if (dutyLeadName) {
    const day = new Date().getDay();
    dutyLeadName.textContent =
      dutySchedule[day] || "Дежурный не назначен (выходной день)";
  }

  // Заполняем выпадающий список пользователей
  users.forEach((u) => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = u.short;
    userSelect.appendChild(opt);
  });

  let currentUser = null;

  // --- ВОССТАНОВЛЕНИЕ userId ---
  const savedUserId = Number(localStorage.getItem(STORAGE_USER_ID));
  if (savedUserId) {
    const u = users.find((x) => x.id === savedUserId);
    if (u) {
      currentUser = u;
      userSelect.value = String(u.id);
      welcome.textContent = `Добро пожаловать, ${u.short}!`;
      btnCheckin.disabled = false;
    }
  }

  // --- ВОССТАНОВЛЕНИЕ времени прихода ---
  const savedArrival = localStorage.getItem(STORAGE_ARRIVAL);
  if (savedArrival) {
    arrivalSpan.textContent = savedArrival;
    if (currentUser) {
      status.textContent = `${currentUser.short} пришёл в ${savedArrival} (сохранено).`;
    }
  }

  // --- Кнопка "Войти" ---
  btnLogin.addEventListener("click", () => {
    const userId = Number(userSelect.value);
    currentUser = users.find((u) => u.id === userId);

    if (!currentUser) {
      status.textContent = "Выберите пользователя.";
      return;
    }

    welcome.textContent = `Добро пожаловать, ${currentUser.short}!`;
    btnCheckin.disabled = false;

    localStorage.setItem(STORAGE_USER_ID, String(currentUser.id));

    status.textContent = `${currentUser.short} вошёл в систему.`;
  });

  // --- Кнопка "Отметиться" ---
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

    arrivalSpan.textContent = timeStr;

    localStorage.setItem(STORAGE_ARRIVAL, timeStr);

    status.textContent = `${currentUser.short} отметился в ${timeStr}.`;
  });
});