const API_URL = "https://698a22b0c04d974bc6a17e23.mockapi.io/Menu"; // Replace with your actual API endpoint

/* ---------- TIME & DAY HELPERS ---------- */
function getTodayName() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

function getCurrentMealInfo() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();

  if (mins >= 450 && mins <= 540)
    return { key: "breakfast", label: "🍳 Breakfast" };

  if (mins >= 750 && mins <= 840)
    return { key: "lunch", label: "🍛 Lunch" };

  if (mins >= 1170 && mins <= 1260)
    return { key: "dinner", label: "🍽️ Dinner" };

  return null;
}

/* ---------- LOAD TODAY'S MEAL ---------- */
async function loadMealByTime() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const todayName = getTodayName();
  const today = data.find(
    d => d.day.toLowerCase().trim() === todayName.toLowerCase().trim()
  );

  const mealCard = document.getElementById("meal-card");
  const mealInfo = getCurrentMealInfo();

  if (!today) {
    mealCard.innerHTML = "<p>❌ Day not found in menu</p>";
    return;
  }

  if (!mealInfo) {
    mealCard.innerHTML = `
      <h2>${today.day}</h2>
      <p style="text-align:center;">
        🌙 Kitchen is closed<br>
        ⏰ Next meal: <b>Breakfast at 7:30 AM</b>
      </p>
    `;
    return;
  }

  mealCard.innerHTML = `
    <h2>${today.day}</h2>
    <div class="meal">
      <h3>${mealInfo.label}</h3>
      <p>${today[mealInfo.key]}</p>
    </div>
  `;
}

/* ---------- WEEKLY MENU ---------- */
async function toggleWeeklyMenu() {
  const weeklyDiv = document.getElementById("weekly-menu");
  const btn = document.getElementById("toggle-week");

  if (weeklyDiv.style.display === "block") {
    weeklyDiv.style.display = "none";
    btn.textContent = "📅 View Weekly Menu";
    return;
  }

  const res = await fetch(API_URL);
  const data = await res.json();

  let table = `
    <table>
      <tr>
        <th>Day</th>
        <th>Breakfast</th>
        <th>Lunch</th>
        <th>Dinner</th>
      </tr>
  `;

  data.forEach(d => {
    table += `
      <tr>
        <td>${d.day}</td>
        <td>${d.breakfast}</td>
        <td>${d.lunch}</td>
        <td>${d.dinner}</td>
      </tr>
    `;
  });

  table += "</table>";
  weeklyDiv.innerHTML = table;
  weeklyDiv.style.display = "block";
  btn.textContent = "❌ Hide Weekly Menu";
}

/* ---------- INITIAL LOAD ---------- */
loadMealByTime();
setInterval(loadMealByTime, 60000);

/* ---------- BUTTON BINDING ---------- */
document.getElementById("toggle-week").onclick = toggleWeeklyMenu;

