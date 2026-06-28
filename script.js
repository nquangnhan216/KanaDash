const kana = [
  { romaji: "a", hiragana: "あ", katakana: "ア" },
  { romaji: "i", hiragana: "い", katakana: "イ" },
  { romaji: "u", hiragana: "う", katakana: "ウ" },
  { romaji: "e", hiragana: "え", katakana: "エ" },
  { romaji: "o", hiragana: "お", katakana: "オ" },
  { romaji: "ka", hiragana: "か", katakana: "カ" },
  { romaji: "ki", hiragana: "き", katakana: "キ" },
  { romaji: "ku", hiragana: "く", katakana: "ク" },
  { romaji: "ke", hiragana: "け", katakana: "ケ" },
  { romaji: "ko", hiragana: "こ", katakana: "コ" },
  { romaji: "sa", hiragana: "さ", katakana: "サ" },
  { romaji: "shi", hiragana: "し", katakana: "シ" },
  { romaji: "su", hiragana: "す", katakana: "ス" },
  { romaji: "se", hiragana: "せ", katakana: "セ" },
  { romaji: "so", hiragana: "そ", katakana: "ソ" },
  { romaji: "ta", hiragana: "た", katakana: "タ" },
  { romaji: "chi", hiragana: "ち", katakana: "チ" },
  { romaji: "tsu", hiragana: "つ", katakana: "ツ" },
  { romaji: "te", hiragana: "て", katakana: "テ" },
  { romaji: "to", hiragana: "と", katakana: "ト" },
  { romaji: "na", hiragana: "な", katakana: "ナ" },
  { romaji: "ni", hiragana: "に", katakana: "ニ" },
  { romaji: "nu", hiragana: "ぬ", katakana: "ヌ" },
  { romaji: "ne", hiragana: "ね", katakana: "ネ" },
  { romaji: "no", hiragana: "の", katakana: "ノ" },
  { romaji: "ha", hiragana: "は", katakana: "ハ" },
  { romaji: "hi", hiragana: "ひ", katakana: "ヒ" },
  { romaji: "fu", hiragana: "ふ", katakana: "フ" },
  { romaji: "he", hiragana: "へ", katakana: "ヘ" },
  { romaji: "ho", hiragana: "ほ", katakana: "ホ" },
  { romaji: "ma", hiragana: "ま", katakana: "マ" },
  { romaji: "mi", hiragana: "み", katakana: "ミ" },
  { romaji: "mu", hiragana: "む", katakana: "ム" },
  { romaji: "me", hiragana: "め", katakana: "メ" },
  { romaji: "mo", hiragana: "も", katakana: "モ" },
  { romaji: "ya", hiragana: "や", katakana: "ヤ" },
  { romaji: "yu", hiragana: "ゆ", katakana: "ユ" },
  { romaji: "yo", hiragana: "よ", katakana: "ヨ" },
  { romaji: "ra", hiragana: "ら", katakana: "ラ" },
  { romaji: "ri", hiragana: "り", katakana: "リ" },
  { romaji: "ru", hiragana: "る", katakana: "ル" },
  { romaji: "re", hiragana: "れ", katakana: "レ" },
  { romaji: "ro", hiragana: "ろ", katakana: "ロ" },
  { romaji: "wa", hiragana: "わ", katakana: "ワ" },
  { romaji: "wo", hiragana: "を", katakana: "ヲ" },
  { romaji: "n", hiragana: "ん", katakana: "ン" }
];


const rowIds = ["vowel", "k", "s", "t", "n", "h", "m", "y", "r", "w"];
const rowRomaji = {
  vowel: ["a", "i", "u", "e", "o"],
  k: ["ka", "ki", "ku", "ke", "ko"],
  s: ["sa", "shi", "su", "se", "so"],
  t: ["ta", "chi", "tsu", "te", "to"],
  n: ["na", "ni", "nu", "ne", "no"],
  h: ["ha", "hi", "fu", "he", "ho"],
  m: ["ma", "mi", "mu", "me", "mo"],
  y: ["ya", "yu", "yo"],
  r: ["ra", "ri", "ru", "re", "ro"],
  w: ["wa", "wo", "n"]
};

const romajiRows = new Map(
  rowIds.flatMap((rowId) => rowRomaji[rowId].map((romaji) => [romaji, rowId]))
);
const difficultySeconds = {
  easy: 10,
  normal: 6,
  hard: 3
};

const difficultyScoreMultiplier = {
  easy: 0.5,
  normal: 1,
  hard: 1.5
};

const dailyGoal = 10;
const dailyStorageKey = "kanaDashDaily";
const memoryStorageKey = "kanaDashMemory";
const shortReviewDelayMs = 90 * 1000;
const answerQualityDelay = {
  again: 0,
  hard: 6 * 60 * 60 * 1000,
  good: 24 * 60 * 60 * 1000,
  easy: 3 * 24 * 60 * 60 * 1000
};

const state = {
  script: "hiragana",
  flow: "kana-to-romaji",
  difficulty: "easy",
  rows: new Set(rowIds),
  current: null,
  recentPrompts: [],
  score: 0,
  lives: 3,
  answered: 0,
  correct: 0,
  timeLeft: 10,
  timerId: null,
  misses: new Map(),
  roundActive: false,
  accepting: false,
  questionStartedAt: 0
};

const el = {
  score: document.querySelector("#score"),
  lives: document.querySelector("#lives"),
  timeLeft: document.querySelector("#timeLeft"),
  timerRing: document.querySelector("#timerRing"),
  themeToggle: document.querySelector("#themeToggle"),
  promptLabel: document.querySelector("#promptLabel"),
  prompt: document.querySelector("#prompt"),
  feedback: document.querySelector("#feedback"),
  typedAnswer: document.querySelector("#typedAnswer"),
  romajiInput: document.querySelector("#romajiInput"),
  submitAnswer: document.querySelector("#submitAnswer"),
  choiceGrid: document.querySelector("#choiceGrid"),
  roundActions: document.querySelector("#roundActions"),
  forfeitGame: document.querySelector("#forfeitGame"),
  results: document.querySelector("#results"),
  resultTitle: document.querySelector("#resultTitle"),
  finalScore: document.querySelector("#finalScore"),
  accuracy: document.querySelector("#accuracy"),
  answered: document.querySelector("#answered"),
  practiceList: document.querySelector("#practiceList"),
  rowButtons: document.querySelectorAll("[data-row]"),
  dailyStatus: document.querySelector("#dailyStatus"),
  dailyProgress: document.querySelector("#dailyProgress"),
  dailyStreak: document.querySelector("#dailyStreak"),
  dailyBest: document.querySelector("#dailyBest")
};

document.querySelectorAll("[data-script]").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.roundActive) {
      flashSettingsLocked();
      return;
    }
    state.script = button.dataset.script;
    setActive("[data-script]", button);
    updateRowButtons();
    previewPrompt();
  });
});

document.querySelectorAll("[data-flow]").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.roundActive) {
      flashSettingsLocked();
      return;
    }
    state.flow = button.dataset.flow;
    setActive("[data-flow]", button);
    updateInputMode();
    updateRowButtons();
    previewPrompt();
  });
});

document.querySelectorAll("[data-difficulty]").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.roundActive) {
      flashSettingsLocked();
      return;
    }
    state.difficulty = button.dataset.difficulty;
    setActive("[data-difficulty]", button);
    if (!state.accepting) {
      state.timeLeft = difficultySeconds[state.difficulty];
      updateTimer();
    }
  });
});


document.querySelectorAll("[data-row]").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.roundActive) {
      flashSettingsLocked();
      return;
    }

    const row = button.dataset.row;

    if (row === "all") {
      state.rows = new Set(rowIds);
    } else if (state.rows.size === rowIds.length) {
      state.rows = new Set([row]);
    } else if (state.rows.has(row) && state.rows.size > 1) {
      state.rows.delete(row);
    } else {
      state.rows.add(row);
    }

    updateRowButtons();
    previewPrompt();
  });
});
el.themeToggle.addEventListener("click", toggleTheme);
el.forfeitGame.addEventListener("click", forfeitRound);
el.submitAnswer.addEventListener("click", submitTypedAnswer);
el.romajiInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitTypedAnswer();
  }
});

updateThemeButton();
updateRowButtons();
previewPrompt();
updateInputMode();
updateHud();
updateDailyPanel();
updateTimer();

function getActiveTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("kanaDashTheme", theme);
  updateThemeButton();
}

function toggleTheme() {
  setTheme(getActiveTheme() === "dark" ? "light" : "dark");
}

function updateThemeButton() {
  const isDark = getActiveTheme() === "dark";
  el.themeToggle.textContent = isDark ? "Light" : "Dark";
  el.themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}
function setActive(selector, activeButton) {
  document.querySelectorAll(selector).forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function startRound(useCurrentQuestion = false) {
  clearInterval(state.timerId);
  state.score = 0;
  state.lives = 3;
  state.answered = 0;
  state.correct = 0;
  state.misses.clear();
  state.recentPrompts = [];
  state.roundActive = true;
  state.accepting = true;
  el.results.classList.add("hidden");
  el.roundActions.classList.remove("hidden");
  updateHud();

  if (useCurrentQuestion && state.current) {
    startCurrentQuestion();
    return;
  }

  nextQuestion();
}

function forfeitRound() {
  if (!state.roundActive) {
    return;
  }

  endRound("Round forfeited.");
}

function startCurrentQuestion() {
  rememberPrompt(state.current);
  state.timeLeft = difficultySeconds[state.difficulty];
  state.questionStartedAt = Date.now();
  state.accepting = true;
  el.feedback.textContent = "Answer before the timer runs out.";
  el.feedback.className = "feedback";

  if (state.flow === "kana-to-romaji") {
    el.promptLabel.textContent = `${titleCase(state.script)} to romaji`;
    el.prompt.textContent = state.current[state.script];
    el.romajiInput.focus();
  } else {
    el.promptLabel.textContent = `Choose the ${state.script} kana`;
    el.prompt.textContent = state.current.romaji;
    buildChoices();
  }

  updateInputMode();
  updateTimer();
  state.timerId = setInterval(tick, 1000);
}

function nextQuestion() {
  clearInterval(state.timerId);
  state.current = randomKana();
  el.romajiInput.value = "";
  startCurrentQuestion();
}

function tick() {
  state.timeLeft -= 1;
  updateTimer();

  if (state.timeLeft <= 0) {
    handleAnswer(false, "Time is up.");
  }
}

function submitTypedAnswer() {
  if (state.flow !== "kana-to-romaji") {
    return;
  }

  const answer = normalizeRomaji(el.romajiInput.value);

  if (!answer) {
    el.feedback.textContent = "Type an answer first.";
    el.feedback.className = "feedback bad";
    return;
  }

  if (!state.roundActive) {
    startRound(true);
  }

  if (!state.accepting) {
    return;
  }

  handleAnswer(answer === state.current.romaji);
}

function buildChoices() {
  const choices = [state.current];
  const pool = getKanaPool().filter((item) => item.romaji !== state.current.romaji);
  const targetChoiceCount = Math.min(4, pool.length + 1);

  while (choices.length < targetChoiceCount) {
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    if (!choices.includes(candidate)) {
      choices.push(candidate);
    }
  }

  shuffle(choices);
  el.choiceGrid.innerHTML = "";

  choices.forEach((item) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = item[state.script];
    button.setAttribute("aria-label", `${item[state.script]} ${item.romaji}`);
    button.addEventListener("click", () => {
      if (!state.roundActive) {
        startRound(true);
      }

      handleAnswer(item.romaji === state.current.romaji);
    });
    el.choiceGrid.appendChild(button);
  });
}

function handleAnswer(isCorrect, emptyMessage = "") {
  if (!state.accepting) {
    return;
  }

  const quality = getAnswerQuality(isCorrect);
  state.accepting = false;
  clearInterval(state.timerId);
  state.answered += 1;

  if (isCorrect) {
    state.correct += 1;
    const basePoints = 10 + Math.max(0, state.timeLeft);
    state.score += Math.round(basePoints * difficultyScoreMultiplier[state.difficulty]);
    updateMemoryState(state.current, quality);
    el.feedback.textContent = quality === "easy" ? "Correct. Strong recall." : quality === "hard" ? "Correct, but keep it close." : "Correct.";
    el.feedback.className = "feedback good";
  } else {
    state.lives -= 1;
    addMiss(state.current);
    updateMemoryState(state.current, "again");
    el.feedback.textContent = emptyMessage ? `${emptyMessage} ${getCorrectAnswerText()}` : getCorrectAnswerText();
    el.feedback.className = "feedback bad";
  }

  recordDailyAnswer(isCorrect);
  updateHud();

  if (state.lives <= 0) {
    setTimeout(endRound, 850);
    return;
  }

  setTimeout(nextQuestion, isCorrect ? 450 : 950);
}
function getCorrectAnswerText() {
  const symbol = state.current[state.script];

  if (state.flow === "romaji-to-kana") {
    return `It was ${symbol} (${state.current.romaji}).`;
  }

  return `It was ${symbol} (${state.current.romaji}).`;
}

function addMiss(item) {
  const key = item.romaji;
  const current = state.misses.get(key) || { item, count: 0 };
  current.count += 1;
  state.misses.set(key, current);
}

function endRound(message = "Round complete.") {
  state.accepting = false;
  state.roundActive = false;
  clearInterval(state.timerId);
  el.feedback.textContent = message;
  el.feedback.className = "feedback";
  el.roundActions.classList.add("hidden");

  const accuracy = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
  el.finalScore.textContent = state.score;
  el.accuracy.textContent = `${accuracy}%`;
  el.answered.textContent = state.answered;
  el.resultTitle.textContent = accuracy >= 80 ? "Sharp work" : accuracy >= 50 ? "Good practice" : "Keep training";
  renderPracticeList();
  el.results.classList.remove("hidden");
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadDailyStats() {
  try {
    return JSON.parse(localStorage.getItem(dailyStorageKey)) || {};
  } catch {
    return {};
  }
}

function getDailyStats() {
  const today = getTodayKey();
  const stats = loadDailyStats();

  if (stats.date !== today) {
    return {
      date: today,
      answered: 0,
      correct: 0,
      bestScore: 0,
      completed: false,
      streak: stats.streak || 0,
      lastCompletedDate: stats.lastCompletedDate || ""
    };
  }

  return {
    date: today,
    answered: stats.answered || 0,
    correct: stats.correct || 0,
    bestScore: stats.bestScore || 0,
    completed: Boolean(stats.completed),
    streak: stats.streak || 0,
    lastCompletedDate: stats.lastCompletedDate || ""
  };
}

function saveDailyStats(stats) {
  localStorage.setItem(dailyStorageKey, JSON.stringify(stats));
}

function recordDailyAnswer(isCorrect) {
  const stats = getDailyStats();
  stats.answered += 1;
  stats.correct += isCorrect ? 1 : 0;
  stats.bestScore = Math.max(stats.bestScore, state.score);

  if (!stats.completed && stats.answered >= dailyGoal) {
    stats.completed = true;
    stats.streak = stats.lastCompletedDate === getYesterdayKey() ? stats.streak + 1 : 1;
    stats.lastCompletedDate = stats.date;
  }

  saveDailyStats(stats);
  updateDailyPanel(stats);
}

function updateDailyPanel(stats = getDailyStats()) {
  const progress = Math.min(stats.answered, dailyGoal);
  el.dailyProgress.textContent = `${progress}/${dailyGoal}`;
  el.dailyStreak.textContent = stats.streak;
  el.dailyBest.textContent = stats.bestScore;

  if (stats.completed) {
    el.dailyStatus.textContent = `Daily complete. ${stats.correct}/${stats.answered} correct today.`;
    return;
  }

  const remaining = dailyGoal - progress;
  el.dailyStatus.textContent = `${remaining} more ${remaining === 1 ? "answer" : "answers"} to complete today's practice.`;
}

function renderPracticeList() {
  const misses = [...state.misses.values()].sort((a, b) => b.count - a.count).slice(0, 6);
  el.practiceList.innerHTML = "";

  if (!misses.length) {
    const chip = document.createElement("span");
    chip.className = "practice-chip";
    chip.textContent = "No misses this round";
    el.practiceList.appendChild(chip);
    return;
  }

  misses.forEach(({ item, count }) => {
    const chip = document.createElement("span");
    chip.className = "practice-chip";
    chip.innerHTML = `<strong>${item[state.script]}</strong> ${item.romaji} x${count}`;
    el.practiceList.appendChild(chip);
  });
}

function previewPrompt() {
  const sample = randomKana();
  const seconds = difficultySeconds[state.difficulty];
  clearInterval(state.timerId);
  state.current = sample;
  state.timeLeft = seconds;
  state.accepting = false;
  el.promptLabel.textContent = state.flow === "kana-to-romaji"
    ? `${titleCase(state.script)} to romaji`
    : `Choose the ${state.script} kana`;
  el.prompt.textContent = state.flow === "kana-to-romaji" ? sample[state.script] : sample.romaji;
  el.feedback.textContent = state.flow === "kana-to-romaji"
    ? "Type the romaji and press Enter to begin."
    : "Choose a kana to begin.";
  el.feedback.className = "feedback";
  updateInputMode();
  if (state.flow === "romaji-to-kana") {
    buildChoices();
  }
  updateTimer();
}

function updateInputMode() {
  const typing = state.flow === "kana-to-romaji";
  el.typedAnswer.classList.toggle("hidden", !typing);
  el.choiceGrid.classList.toggle("hidden", typing);
}

function loadMemoryState() {
  try {
    return JSON.parse(localStorage.getItem(memoryStorageKey)) || {};
  } catch {
    return {};
  }
}

function saveMemoryState(memory) {
  localStorage.setItem(memoryStorageKey, JSON.stringify(memory));
}

function createMemoryItem() {
  return {
    reviews: 0,
    correct: 0,
    wrong: 0,
    stability: 1,
    difficulty: 5,
    dueAt: 0,
    lastQuality: "new"
  };
}

function getMemoryKey(item) {
  return `${state.script}:${state.flow}:${item.romaji}`;
}

function getMemoryItem(memory, item) {
  const key = getMemoryKey(item);

  if (!memory[key]) {
    memory[key] = createMemoryItem();
  }

  return memory[key];
}

function getAnswerQuality(isCorrect) {
  if (!isCorrect) {
    return "again";
  }

  const maxSeconds = difficultySeconds[state.difficulty];
  const elapsedSeconds = Math.max(0, (Date.now() - state.questionStartedAt) / 1000);
  const ratio = maxSeconds ? elapsedSeconds / maxSeconds : 1;

  if (ratio <= 0.35) {
    return "easy";
  }

  if (ratio >= 0.75) {
    return "hard";
  }

  return "good";
}

function updateMemoryState(item, quality) {
  const memory = loadMemoryState();
  const record = getMemoryItem(memory, item);
  const now = Date.now();
  record.reviews += 1;
  record.lastQuality = quality;

  if (quality === "again") {
    record.wrong += 1;
    record.stability = Math.max(0.5, record.stability * 0.55);
    record.difficulty = Math.min(10, record.difficulty + 1.1);
    record.dueAt = now + shortReviewDelayMs;
  } else {
    record.correct += 1;
    const stabilityGain = quality === "easy" ? 1.7 : quality === "good" ? 1.25 : 0.8;
    const difficultyDrop = quality === "easy" ? 0.45 : quality === "good" ? 0.25 : 0.05;
    record.stability = Math.min(60, record.stability + stabilityGain);
    record.difficulty = Math.max(1, record.difficulty - difficultyDrop);
    record.dueAt = now + Math.round(answerQualityDelay[quality] * Math.max(0.8, record.stability / 2));
  }

  memory[getMemoryKey(item)] = record;
  saveMemoryState(memory);
}

function getItemPriority(item, memory, now) {
  const record = memory[getMemoryKey(item)] || createMemoryItem();
  const isDue = record.dueAt <= now;
  const overdueMinutes = isDue ? Math.max(0, (now - record.dueAt) / 60000) : 0;
  const weakness = record.wrong * 8 + record.difficulty * 2 - record.correct * 1.2;
  const newBoost = record.reviews === 0 ? 18 : 0;
  return (isDue ? 100 : 0) + overdueMinutes + weakness + newBoost;
}

function getKanaPool() {
  return kana.filter((item) => state.rows.has(romajiRows.get(item.romaji)));
}

function randomKana() {
  const pool = getKanaPool();
  const available = pool.filter((item) => !state.recentPrompts.includes(item.romaji));
  const candidates = available.length ? available : pool;
  const memory = loadMemoryState();
  const now = Date.now();
  const ranked = candidates
    .map((item) => ({ item, priority: getItemPriority(item, memory, now) + Math.random() * 3 }))
    .sort((a, b) => b.priority - a.priority);
  return ranked[0].item;
}

function rememberPrompt(item) {
  if (!item) {
    return;
  }

  state.recentPrompts = state.recentPrompts.filter((romaji) => romaji !== item.romaji);
  state.recentPrompts.unshift(item.romaji);
  state.recentPrompts = state.recentPrompts.slice(0, 2);
}

function updateRowButtons() {
  const allSelected = state.rows.size === rowIds.length;

  el.rowButtons.forEach((button) => {
    const row = button.dataset.row;
    const isActive = row === "all" ? allSelected : state.rows.has(row);
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}
function flashSettingsLocked() {
  el.feedback.textContent = "Finish this round before changing settings.";
  el.feedback.className = "feedback bad";
}

function updateHud() {
  el.score.textContent = state.score;
  el.lives.textContent = state.lives;
}

function updateTimer() {
  const max = difficultySeconds[state.difficulty];
  const ratio = Math.max(0, state.timeLeft / max);
  const circumference = 326.7;
  el.timeLeft.textContent = Math.max(0, state.timeLeft);
  el.timerRing.style.strokeDashoffset = String(circumference * (1 - ratio));
  el.timerRing.style.stroke = ratio < 0.35 ? "var(--red)" : ratio < 0.65 ? "var(--gold)" : "var(--blue)";
}

function normalizeRomaji(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
