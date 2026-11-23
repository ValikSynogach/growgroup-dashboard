/* Shared Grow Groups dashboard. index.html is SOL Youth; hsm.html is SOL HSM.
   Both pages load the same CSVs. Ministry.belongsTo decides which rows each
   page keeps, on the first load and on every refresh. */
"use strict";

const DEMO_ROWS = [
  ["2026-05-10 19:30", "111", "John Miller",     "Tracy Sunday",  "yes", "5", "",          "Pray for mom's healing and salvation of relatives",                  "",                     "completed", ""],
  ["2026-05-10 19:45", "222", "Anna Ivanenko",   "Young Adults",  "yes", "7", "",          "Brother needs a job. Pray for his interview Tuesday.",               "",                     "completed", ""],
  ["2026-05-10 20:00", "333", "Michael Brown",   "Marriage Grp",  "no",  "",  "",          "",                                                                   "Travel — back next week","skipped",  ""],
  ["2026-05-10 20:15", "444", "Sergey Levchenko","College Group", "yes", "6", "",          "For our students preparing for finals.",                              "",                     "completed", ""],
  ["2026-05-10 20:30", "555", "Olha Romanova",   "Wed Night",     "yes", "4", "",          "none",                                                                "",                     "completed", ""],
  ["2026-05-10 20:45", "666", "David Chen",      "Saturday Grp",  "yes", "5", "",          "Healing for Mark's father after surgery.",                            "",                     "completed", ""],
  ["2026-05-03 19:30", "111", "John Miller",     "Tracy Sunday",  "yes", "5", "", "", "", "completed", ""],
  ["2026-05-03 19:45", "222", "Anna Ivanenko",   "Young Adults",  "yes", "6", "", "", "", "completed", ""],
  ["2026-05-03 20:15", "444", "Sergey Levchenko","College Group", "yes", "7", "", "", "", "completed", ""],
  ["2026-05-03 20:30", "555", "Olha Romanova",   "Wed Night",     "yes", "4", "", "", "", "completed", ""],
  ["2026-04-26 19:30", "111", "John Miller",     "Tracy Sunday",  "yes", "4", "", "", "", "completed", ""],
  ["2026-04-26 19:45", "222", "Anna Ivanenko",   "Young Adults",  "yes", "5", "", "", "", "completed", ""],
  ["2026-04-26 20:15", "444", "Sergey Levchenko","College Group", "yes", "5", "", "", "", "completed", ""],
  ["2026-04-19 19:30", "111", "John Miller",     "Tracy Sunday",  "yes", "6", "", "", "", "completed", ""],
  ["2026-04-19 20:30", "555", "Olha Romanova",   "Wed Night",     "yes", "3", "", "", "", "completed", ""],
];
const DEMO_HEADER = ["timestamp","chat_id","leader_name","group_name","attended","attendance_count","topic","prayer_requests","notes","status","prayed_for"];

const DEMO_LEADERS_HEADER = ["user_id","full_name","username","group_name","active","registered_at","onboarded","members"];
const DEMO_LEADERS = [
  ["111", "John Miller",      "johnm",    "", "yes", "2026-04-01 10:00", "yes", "Anna Smith, Maria Petrenko, David Lee"],
  ["222", "Anna Ivanenko",    "annai",    "", "yes", "2026-04-02 10:00", "yes", "Kate Brown, Olha Romaniuk, Petro Hrytsiuk, Lesia Ivanchuk"],
  ["333", "Michael Brown",    "mikeb",    "", "yes", "2026-04-03 10:00", "yes", "Tom Wilson, Sarah Adams"],
  ["444", "Sergey Levchenko", "serge_l",  "", "yes", "2026-04-04 10:00", "yes", "Andrew Kim, Ben Park, Chris Lee, Dan Cho, Eric Han"],
  ["555", "Olha Romanova",    "olharomas","", "yes", "2026-04-05 10:00", "yes", "Iryna Tkach, Vita Yarema"],
  ["666", "David Chen",       "davidc",   "", "yes", "2026-04-06 10:00", "yes", "Mark Lin, Joshua Wong, Daniel Park, Sam Choi"],
];

const COPY = {
  en: {
    locale: "en-US",
    gateTitle: "Welcome 🙏",
    enter: "Enter",
    passwordPlaceholder: "Enter password",
    badPassword: "That doesn't look right.",
    week: "Week",
    refresh: "Refresh",
    overview: "An overview",
    totalLeaders: "Total leaders",
    registered: "registered",
    reported: "Reported",
    thisWeek: "this week",
    met: "Met",
    groupsGathered: "groups gathered",
    avgAttendance: "Avg attendance",
    perGroup: "people per group",
    attendanceTitle: "Attendance over time",
    attendanceSub: "Total people gathered, by week",
    thisWeekTitle: "This week",
    metSkipped: "Met vs. skipped",
    prayersTitle: "Prayer <em>requests</em>",
    awaitingTitle: "Awaiting reports",
    awaitingSub: "Leaders who haven't submitted this week's check-in",
    leadersTitle: "Leaders <em>& their groups</em>",
    leadersSub: "Tap a leader to see members and history.",
    chartAria: "Attendance trend across weeks",
    donutAria: "Met vs skipped donut chart",
    updated: "Last updated",
    noReportsOption: "No reports yet",
    noPrayersWeek: "No prayer requests submitted this week yet.",
    everyoneReported: "Everyone has reported this week 🙌",
    noLeaders: "No leaders yet.",
    friendGroup: "Friend group",
    members: "Members",
    rosterEmpty: "Not provided yet — the leader can send /members in the bot.",
    rosterNotLoaded: "Members list not loaded.<br>Publish the <b>Leaders</b> tab as CSV and add the URL to <code>CONFIG.LEADERS_CSV_URL</code>.",
    statistics: "Statistics",
    totalReports: "Total reports",
    skipped: "Skipped",
    lastCheckin: "Last check-in",
    lastPrayer: "Last prayer request",
    noPrayerYet: "No prayer requests yet.",
    people: "People",
    loadFailed: "Couldn't load the sheet.",
    loadFailedRest: "Refresh the page to try again.",
    emptyYouth: "No reports yet.",
    emptyYouthRest: "Check-ins will appear here after leaders submit them.",
    emptyHsmNone: "No SOL HSM data yet.",
    emptyHsmNoneRest: "This page stays empty until a leader is part of SOL HSM and submits a report.",
    emptyHsmReports: "No SOL HSM reports yet.",
    emptyHsmReportsRest: "Registered leaders are listed below. Check-ins will show up here on the next refresh.",
  },
  uk: {
    locale: "uk-UA",
    gateTitle: "Вітаємо 🙏",
    enter: "Увійти",
    passwordPlaceholder: "Пароль",
    badPassword: "Схоже, пароль не той.",
    week: "Тиждень",
    refresh: "Оновити",
    overview: "Огляд",
    totalLeaders: "Усього лідерів",
    registered: "зареєстровано",
    reported: "Здали звіт",
    thisWeek: "цього тижня",
    met: "Зустрілись",
    groupsGathered: "групи зібрались",
    avgAttendance: "Середня відвідуваність",
    perGroup: "людей у групі",
    attendanceTitle: "Відвідуваність",
    attendanceSub: "Скільки людей зібралось, по тижнях",
    thisWeekTitle: "Цей тиждень",
    metSkipped: "Зустрілись і пропустили",
    prayersTitle: "Молитовні <em>потреби</em>",
    awaitingTitle: "Чекаємо на звіти",
    awaitingSub: "Лідери, які ще не здали звіт цього тижня",
    leadersTitle: "Лідери <em>та їхні групи</em>",
    leadersSub: "Натисніть на лідера, щоб побачити учасників та історію.",
    chartAria: "Відвідуваність по тижнях",
    donutAria: "Зустрілись і пропустили",
    updated: "Оновлено",
    noReportsOption: "Звітів ще немає",
    noPrayersWeek: "Цього тижня молитовних потреб ще немає.",
    everyoneReported: "Усі здали звіт цього тижня 🙌",
    noLeaders: "Лідерів ще немає.",
    friendGroup: "Friend group",
    members: "Учасники",
    rosterEmpty: "Ще не вказано — лідер може надіслати /members у боті.",
    rosterNotLoaded: "Список учасників не завантажено.<br>Опублікуйте вкладку <b>Leaders</b> як CSV і додайте адресу в <code>CONFIG.LEADERS_CSV_URL</code>.",
    statistics: "Статистика",
    totalReports: "Усього звітів",
    skipped: "Пропустили",
    lastCheckin: "Останній звіт",
    lastPrayer: "Остання молитовна потреба",
    noPrayerYet: "Молитовних потреб ще немає.",
    people: "Люди",
    loadFailed: "Не вдалося завантажити таблицю.",
    loadFailedRest: "Оновіть сторінку, щоб спробувати ще раз.",
    emptyYouth: "Звітів ще немає.",
    emptyYouthRest: "Вони з’являться тут, коли лідери надішлють звіт.",
    emptyHsmNone: "No SOL HSM data yet.",
    emptyHsmNoneRest: "This page stays empty until a leader is part of SOL HSM and submits a report.",
    emptyHsmReports: "No SOL HSM reports yet.",
    emptyHsmReportsRest: "Registered leaders are listed below. Check-ins will show up here on the next refresh.",
  },
};

function lang() {
  return CONFIG.LANG === "en" ? "en" : "uk";
}
function t(key) {
  const pack = COPY[lang()];
  return pack[key] != null ? pack[key] : COPY.en[key];
}
function ukPlural(n, one, few, many) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}
function reportsWord(n) {
  return lang() === "en" ? (n === 1 ? "report" : "reports") : ukPlural(n, "звіт", "звіти", "звітів");
}
function leadersWord(n) {
  return lang() === "en" ? (n === 1 ? "leader" : "leaders") : ukPlural(n, "лідер", "лідери", "лідерів");
}
const EMPTY_PRAYER = new Set(["none", "no", "n/a", "-", "—", "немає", "нема", "ні", "неа", "нет"]);

const gate = document.getElementById("gate");
const app  = document.getElementById("app");
const pwdInput = document.getElementById("pwd");
const enterBtn = document.getElementById("enter");
const errEl    = document.getElementById("err");

function unlock() {
  sessionStorage.setItem("gg_unlocked", "1");
  gate.style.display = "none";
  app.classList.remove("locked");
  init();
}

function tryEnter() {
  if (pwdInput.value === CONFIG.PASSWORD) {
    unlock();
  } else {
    errEl.textContent = t("badPassword");
    pwdInput.value = "";
    pwdInput.focus();
  }
}
enterBtn.addEventListener("click", tryEnter);
pwdInput.addEventListener("keydown", (e) => { if (e.key === "Enter") tryEnter(); });

function parseDate(s) {
  if (!s) return null;
  const m = String(s).match(/^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  const d = new Date(s);
  return isNaN(d) ? null : d;
}
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((t - yearStart) / 86400000) + 1) / 7);
  return `${t.getUTCFullYear()}-${String(week).padStart(2, "0")}`;
}
function weekRange(weekKey) {
  const [y, w] = weekKey.split("-").map(Number);
  const jan4 = new Date(Date.UTC(y, 0, 4));
  const start = new Date(jan4);
  start.setUTCDate(jan4.getUTCDate() - (jan4.getUTCDay() || 7) + 1 + (w - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const fmt = (d) => d.toLocaleDateString(t("locale"), { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
function rowsFrom(header, records) {
  return records.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}
function forThisPage(rows) {
  return (rows || []).filter((row) => Ministry.belongsTo(row, CONFIG.MINISTRY));
}

async function loadData() {
  if (!CONFIG.SHEET_CSV_URL) {
    document.getElementById("banner").style.display = "flex";
    return forThisPage(rowsFrom(DEMO_HEADER, DEMO_ROWS));
  }
  const res = await fetch(CONFIG.SHEET_CSV_URL + "&_=" + Date.now());
  if (!res.ok) throw new Error("Reports CSV " + res.status);
  const text = await res.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  return forThisPage(parsed.data);
}

async function loadLeaders() {
  if (!CONFIG.SHEET_CSV_URL && !CONFIG.LEADERS_CSV_URL) {
    return forThisPage(rowsFrom(DEMO_LEADERS_HEADER, DEMO_LEADERS));
  }
  if (!CONFIG.LEADERS_CSV_URL) return [];
  try {
    const res = await fetch(CONFIG.LEADERS_CSV_URL + "&_=" + Date.now());
    if (!res.ok) throw new Error("Leaders CSV " + res.status);
    const text = await res.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    return forThisPage(parsed.data);
  } catch (e) {
    console.warn("Could not load Leaders CSV:", e);
    return [];
  }
}

let lineChart, donutChart;
let allRows = [];
let allLeaders = [];
let loadFailed = false;
let booted = false;

function reportsOnly(rows) {
  return rows.filter((r) => r.timestamp);
}

async function init() {
  applyBranding();

  try {
    const [fresh, freshLeaders] = await Promise.all([
      loadData().then(reportsOnly),
      loadLeaders(),
    ]);
    allRows = fresh;
    allLeaders = freshLeaders;
    loadFailed = false;
  } catch (e) {
    allRows = [];
    allLeaders = [];
    loadFailed = true;
    console.error(e);
  }

  if (!booted) {
    document.getElementById("week").addEventListener("change", () => {
      if (!fillWeeks.busy) render();
    });
    document.getElementById("refresh").addEventListener("click", async () => {
      document.getElementById("refresh").textContent = "…";
      try {
        allRows = reportsOnly(await loadData());
        allLeaders = await loadLeaders();
        loadFailed = false;
      } catch (e) {
        loadFailed = true;
        console.error(e);
      }
      render();
      setTimeout(() => location.reload(), 100);
    });
    booted = true;
  }

  render();
  requestAnimationFrame(() => {
    document.querySelectorAll("[data-pane]").forEach((el) => el.classList.add("ready"));
  });

  if (!init.timer) {
    init.timer = setInterval(async () => {
      if (sessionStorage.getItem("gg_unlocked") !== "1") return;
      if (document.hidden) return;
      try {
        const [fresh, freshLeaders] = await Promise.all([
          loadData().then(reportsOnly),
          loadLeaders(),
        ]);
        // Keep the page as-is if a refresh comes back empty, so a glitch
        // doesn't wipe stats. A page that was waiting (no reports yet) still
        // picks up new leaders, and the first reports, on this same timer.
        if (fresh.length) {
          allRows = fresh;
          allLeaders = freshLeaders;
          loadFailed = false;
          render();
        } else if (allRows.length === 0 && freshLeaders.length) {
          allLeaders = freshLeaders;
          loadFailed = false;
          render();
        }
      } catch (e) {
        console.warn("Auto-refresh failed:", e);
      }
    }, 5 * 60 * 1000);
  }
}

function showEmptyCopy(title, rest) {
  const text = document.getElementById("empty-state-text");
  const strong = document.createElement("b");
  strong.textContent = title;
  text.replaceChildren(strong, document.createTextNode(" " + rest));
}

function renderEmptyChrome() {
  const banner = document.getElementById("empty-state");
  const noReports = allRows.length === 0;
  if (noReports) {
    banner.style.display = "flex";
    if (loadFailed) {
      showEmptyCopy(t("loadFailed"), t("loadFailedRest"));
    } else if (CONFIG.MINISTRY === "hsm") {
      const registered = allLeaders.some((ld) => String(ld.onboarded || "").trim().toLowerCase() === "yes");
      showEmptyCopy(
        registered ? t("emptyHsmReports") : t("emptyHsmNone"),
        registered ? t("emptyHsmReportsRest") : t("emptyHsmNoneRest")
      );
    } else {
      showEmptyCopy(t("emptyYouth"), t("emptyYouthRest"));
    }
  } else {
    banner.style.display = "none";
  }
  document.querySelector('[data-pane="row"]').style.display = noReports ? "none" : "";
  document.querySelector('[data-pane="prayers"]').style.display = noReports ? "none" : "";
  document.querySelector('[data-pane="missing"]').style.display = noReports ? "none" : "";
}

function fillWeeks() {
  fillWeeks.busy = true;
  const weeks = new Map();
  for (const r of allRows) {
    const d = parseDate(r.timestamp);
    if (!d) continue;
    const k = isoWeek(d);
    if (!weeks.has(k)) weeks.set(k, weekRange(k));
  }
  const weekSel = document.getElementById("week");
  const previous = weekSel.value;
  weekSel.innerHTML = "";
  if (weeks.size === 0) {
    const option = document.createElement("option");
    option.textContent = t("noReportsOption");
    weekSel.appendChild(option);
    fillWeeks.busy = false;
    return;
  }
  [...weeks.entries()].sort((a, b) => a[0] < b[0] ? 1 : -1).forEach(([k, label]) => {
    weekSel.insertAdjacentHTML("beforeend", `<option value="${k}">${label}</option>`);
  });
  if (previous && weeks.has(previous)) weekSel.value = previous;
  fillWeeks.busy = false;
}

function render() {
  fillWeeks();
  const weekSel = document.getElementById("week");
  const weekKey = weekSel.value;
  renderEmptyChrome();

  const weekRows = allRows.filter((r) => {
    const d = parseDate(r.timestamp);
    return d && isoWeek(d) === weekKey;
  });
  const totalLeaders = new Set(allRows.map((r) => r.chat_id).filter(Boolean)).size || weekRows.length;
  const reported = weekRows.length;
  const met = weekRows.filter((r) => String(r.attended).toLowerCase() === "yes").length;
  const skipped = weekRows.filter((r) => String(r.attended).toLowerCase() === "no").length;
  const counts = weekRows.map((r) => parseInt(r.attendance_count, 10)).filter((n) => !isNaN(n) && n > 0);
  const avg = counts.length ? (counts.reduce((a, b) => a + b, 0) / counts.length) : 0;

  document.getElementById("s-total").textContent = totalLeaders || 0;
  document.getElementById("s-reported").textContent = reported;
  document.getElementById("s-reported-meta").textContent = totalLeaders
    ? `${Math.round(reported / totalLeaders * 100)}% ${lang() === "en" ? "of leaders" : "лідерів"}`
    : t("thisWeek");
  document.getElementById("s-met").textContent = met;
  document.getElementById("s-met-meta").textContent = allRows.length
    ? (lang() === "en"
        ? `of ${reported} reported`
        : (reported === 1 ? "з 1 звіту" : `з ${reported} звітів`))
    : t("groupsGathered");
  document.getElementById("s-avg").textContent = counts.length ? avg.toFixed(1) : "—";

  if (allRows.length === 0) {
    if (lineChart) { lineChart.destroy(); lineChart = null; }
    if (donutChart) { donutChart.destroy(); donutChart = null; }
    document.getElementById("donut-legend").innerHTML = "";
  } else {
    const byWeek = new Map();
    for (const r of allRows) {
      const d = parseDate(r.timestamp);
      if (!d) continue;
      const k = isoWeek(d);
      const n = parseInt(r.attendance_count, 10);
      if (!byWeek.has(k)) byWeek.set(k, 0);
      if (!isNaN(n) && n > 0) byWeek.set(k, byWeek.get(k) + n);
    }
    const sortedWeeks = [...byWeek.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1);
    const labels = sortedWeeks.map(([k]) => weekRange(k));
    const values = sortedWeeks.map(([, v]) => v);

    if (lineChart) lineChart.destroy();
    lineChart = new Chart(document.getElementById("lineChart"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: t("people"),
          data: values,
          borderColor: "#C16545",
          backgroundColor: "rgba(193, 101, 69, 0.10)",
          borderWidth: 2.5,
          pointBackgroundColor: "#C16545",
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.32,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: "#2D1F12", padding: 10, titleFont: { family: "Manrope", weight: 600 }, bodyFont: { family: "Manrope" } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#9C8769", font: { family: "Manrope", size: 11 } } },
          y: { beginAtZero: true, grid: { color: "#EFE7D2" }, ticks: { color: "#9C8769", font: { family: "Manrope", size: 11 }, precision: 0 } },
        },
      },
    });

    if (donutChart) donutChart.destroy();
    donutChart = new Chart(document.getElementById("donutChart"), {
      type: "doughnut",
      data: {
        labels: [t("met"), t("skipped")],
        datasets: [{
          data: [met, skipped],
          backgroundColor: ["#7E8F62", "#B97A6E"],
          borderColor: "#FDFAF1",
          borderWidth: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "68%",
        plugins: { legend: { display: false }, tooltip: { backgroundColor: "#2D1F12", padding: 10 } },
      },
    });
    document.getElementById("donut-legend").innerHTML =
      `<span><span class="sw" style="background:#7E8F62"></span>${escapeHtml(t("met"))} · ${met}</span>` +
      `<span><span class="sw" style="background:#B97A6E"></span>${escapeHtml(t("skipped"))} · ${skipped}</span>`;
    requestAnimationFrame(() => {
      if (lineChart) lineChart.resize();
      if (donutChart) donutChart.resize();
    });
  }

  const prayers = weekRows
    .filter((r) => r.prayer_requests && !EMPTY_PRAYER.has(String(r.prayer_requests).trim().toLowerCase().replace(/[.!]+$/, "")));
  const grid = document.getElementById("prayers-grid");
  document.getElementById("prayers-count").textContent = `${prayers.length} ${t("thisWeek")}`;
  if (prayers.length === 0) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="empty-mark">❦</div><p>${escapeHtml(t("noPrayersWeek"))}</p></div>`;
  } else {
    grid.innerHTML = prayers.map((p) => `
      <article class="prayer">
        <p class="prayer-text">${escapeHtml(p.prayer_requests)}</p>
        <div class="prayer-meta">
          <b>${escapeHtml(p.leader_name || "—")}</b>
          <span>${escapeHtml(p.group_name || "")}</span>
        </div>
      </article>
    `).join("");
  }

  const reportedThisWeek = new Set(weekRows.map((r) => r.chat_id));
  const leaderHistory = new Map();
  for (const r of allRows) {
    if (!leaderHistory.has(r.chat_id)) leaderHistory.set(r.chat_id, { name: r.leader_name, group: r.group_name });
  }
  const missing = [...leaderHistory.entries()]
    .filter(([id]) => !reportedThisWeek.has(id))
    .map(([, v]) => v)
    .filter((v) => v.name);

  const list = document.getElementById("missing-list");
  const sub  = document.getElementById("missing-sub");
  if (allRows.length === 0) {
    sub.textContent = CONFIG.MINISTRY === "hsm" ? t("emptyHsmReports").replace(/\.$/, "") : t("noReportsOption");
    list.innerHTML = "";
  } else if (missing.length === 0) {
    sub.textContent = t("everyoneReported");
    list.innerHTML = "";
  } else {
    if (lang() === "en") {
      sub.textContent = missing.length === 1
        ? "1 leader hasn't submitted this week's check-in"
        : `${missing.length} leaders haven't submitted this week's check-in`;
    } else {
      sub.textContent = missing.length === 1
        ? "1 лідер ще без звіту цього тижня"
        : `${missing.length} ${leadersWord(missing.length)} ще не здали звіт цього тижня`;
    }
    list.innerHTML = missing.map((m) => `
      <li>
        <span class="missing-name">${escapeHtml(m.name)}</span>
        <span class="missing-group">${escapeHtml(m.group || "")}</span>
      </li>
    `).join("");
  }

  const now = new Date();
  document.getElementById("footer-time").innerHTML =
    '<span class="live-dot"></span>' + escapeHtml(t("updated")) + " · " + now.toLocaleString(t("locale"), { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  renderLeaders();
}

function renderLeaders() {
  const list = document.getElementById("leaders-list");
  const countEl = document.getElementById("leaders-count");

  const leaderMap = new Map();
  for (const ld of allLeaders) {
    const uid = String(ld.user_id || "").trim();
    if (!uid) continue;
    const onboarded = String(ld.onboarded || "").trim().toLowerCase() === "yes";
    if (!onboarded) continue;
    leaderMap.set(uid, {
      name: String(ld.full_name || "").trim(),
      roster: Ministry.rosterText(ld, CONFIG.MINISTRY),
    });
  }

  const statsByUid = new Map();
  for (const r of allRows) {
    const uid = String(r.chat_id || "").trim();
    if (!uid) continue;
    if (!statsByUid.has(uid)) {
      statsByUid.set(uid, {
        uid,
        name: String(r.leader_name || "").trim(),
        reports: [],
        met: 0, skipped: 0,
        attendanceSum: 0, attendanceCount: 0,
        lastTimestamp: null,
        lastPrayer: "",
      });
    }
    const s = statsByUid.get(uid);
    s.reports.push(r);
    const attended = String(r.attended || "").toLowerCase() === "yes";
    if (attended) s.met++;
    else if (String(r.attended || "").toLowerCase() === "no") s.skipped++;

    const n = parseInt(r.attendance_count, 10);
    if (!isNaN(n) && n > 0) {
      s.attendanceSum += n;
      s.attendanceCount++;
    }

    const d = parseDate(r.timestamp);
    if (d && (!s.lastTimestamp || d > s.lastTimestamp)) {
      s.lastTimestamp = d;
    }

    const prayer = String(r.prayer_requests || "").trim();
    if (prayer && !EMPTY_PRAYER.has(prayer.toLowerCase().replace(/[.!]+$/, ""))) {
      if (!s._latestPrayerDate || (d && d >= s._latestPrayerDate)) {
        s.lastPrayer = prayer;
        s._latestPrayerDate = d;
      }
    }
  }

  for (const [uid, info] of leaderMap.entries()) {
    if (!statsByUid.has(uid)) {
      statsByUid.set(uid, {
        uid, name: info.name, reports: [],
        met: 0, skipped: 0, attendanceSum: 0, attendanceCount: 0,
        lastTimestamp: null, lastPrayer: "",
      });
    }
    const s = statsByUid.get(uid);
    if (info.name) s.name = info.name;
    s.roster = info.roster;
  }

  const leadersArr = [...statsByUid.values()]
    .filter((s) => s.name)
    .sort((a, b) => b.reports.length - a.reports.length || a.name.localeCompare(b.name));

  countEl.textContent = `${leadersArr.length} ${leadersWord(leadersArr.length)}`;

  if (leadersArr.length === 0) {
    list.innerHTML = `<div class="empty"><div class="empty-mark">❦</div><p>${escapeHtml(t("noLeaders"))}</p></div>`;
    return;
  }

  const openIds = new Set();
  list.querySelectorAll(".leader-card.open").forEach((el) => openIds.add(el.dataset.uid));

  list.innerHTML = leadersArr.map((s) => {
    const avg = s.attendanceCount ? (s.attendanceSum / s.attendanceCount).toFixed(1) : "—";
    const lastCheckIn = s.lastTimestamp ? relativeTime(s.lastTimestamp) : "—";
    const total = s.reports.length;
    const metPct = total ? Math.round(s.met / total * 100) : 0;

    const people = String(s.roster || "").split(/[,\n]/).map((m) => m.trim()).filter(Boolean);
    const rosterLabel = CONFIG.MINISTRY === "hsm" ? t("friendGroup") : t("members");
    const membersHtml = people.length
      ? `<ul class="members-list">${people.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>`
      : (CONFIG.LEADERS_CSV_URL
          ? `<p class="no-members-hint">${escapeHtml(t("rosterEmpty"))}</p>`
          : `<p class="no-members-hint">${t("rosterNotLoaded")}</p>`);

    const prayerHtml = s.lastPrayer
      ? `<div class="last-prayer"><span class="last-prayer-text">${escapeHtml(s.lastPrayer)}</span></div>`
      : `<p class="no-members-hint">${escapeHtml(t("noPrayerYet"))}</p>`;

    const isOpen = openIds.has(s.uid) ? " open" : "";

    return `
      <div class="leader-card${isOpen}" data-uid="${escapeHtml(s.uid)}">
        <button class="leader-toggle" onclick="toggleLeader(this)" aria-expanded="${isOpen ? "true" : "false"}">
          <span class="leader-name">${escapeHtml(s.name)}</span>
          <span class="leader-quick">${total} ${reportsWord(total)} · ${lang() === "en" ? "avg" : "сер."} ${avg}</span>
          <span class="leader-chevron">⌄</span>
        </button>
        <div class="leader-details">
          <div class="detail-block">
            <h4>${escapeHtml(rosterLabel)}${people.length ? ` (${people.length})` : ""}</h4>
            ${membersHtml}
          </div>
          <div class="detail-block">
            <h4>${escapeHtml(t("statistics"))}</h4>
            <dl class="detail-stats">
              <dt>${escapeHtml(t("totalReports"))}</dt>      <dd>${total}</dd>
              <dt>${escapeHtml(t("met"))}</dt>                <dd>${s.met}${total ? ` (${metPct}%)` : ""}</dd>
              <dt>${escapeHtml(t("skipped"))}</dt>            <dd>${s.skipped}</dd>
              <dt>${escapeHtml(t("avgAttendance"))}</dt>     <dd>${avg}</dd>
              <dt>${escapeHtml(t("lastCheckin"))}</dt>      <dd>${lastCheckIn}</dd>
            </dl>
            <h4 style="margin-top:1.25rem">${escapeHtml(t("lastPrayer"))}</h4>
            ${prayerHtml}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function toggleLeader(btn) {
  const card = btn.closest(".leader-card");
  const isOpen = card.classList.toggle("open");
  btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
}
window.toggleLeader = toggleLeader;

function relativeTime(d) {
  const now = new Date();
  const diff = (now - d) / 1000;
  const n = (unit) => Math.floor(diff / unit);
  if (lang() === "en") {
    if (diff < 60) return "just now";
    if (diff < 3600) return n(60) + " min ago";
    if (diff < 86400) return n(3600) + " hr ago";
    if (diff < 86400 * 7) {
      const days = n(86400);
      return days + (days === 1 ? " day ago" : " days ago");
    }
  } else {
    if (diff < 60) return "щойно";
    if (diff < 3600) return n(60) + " хв тому";
    if (diff < 86400) return n(3600) + " год тому";
    if (diff < 86400 * 7) {
      const days = n(86400);
      return `${days} ${ukPlural(days, "день", "дні", "днів")} тому`;
    }
  }
  return d.toLocaleDateString(t("locale"), { month: "short", day: "numeric" });
}

function applyBranding() {
  document.documentElement.lang = lang() === "en" ? "en" : "uk";
  document.title = CONFIG.DOCUMENT_TITLE;
  const gateSub = document.getElementById("gate-sub");
  if (gateSub) gateSub.textContent = CONFIG.GATE_SUB;
  const eyebrow = document.getElementById("church-name");
  if (eyebrow) eyebrow.textContent = CONFIG.EYEBROW;
  const title = document.getElementById("title");
  if (title) title.innerHTML = CONFIG.TITLE_HTML;
  const footer = document.getElementById("footer-name");
  if (footer) footer.textContent = CONFIG.FOOTER_NAME;
  const other = document.getElementById("footer-switch");
  if (other) {
    other.href = CONFIG.OTHER_HREF;
    other.textContent = CONFIG.OTHER_LABEL;
  }
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  const pwd = document.getElementById("pwd");
  if (pwd) pwd.placeholder = t("passwordPlaceholder");
  const line = document.getElementById("lineChart");
  if (line) line.setAttribute("aria-label", t("chartAria"));
  const donut = document.getElementById("donutChart");
  if (donut) donut.setAttribute("aria-label", t("donutAria"));
}

applyBranding();
if (sessionStorage.getItem("gg_unlocked") === "1") {
  unlock();
} else {
  setTimeout(() => pwdInput.focus(), 50);
}
