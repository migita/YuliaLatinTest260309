const STORAGE_KEY = "latin-checklists-9-10-quiz-v1";
const RECENT_CARD_WINDOW = 4;
const RECENT_KEY_WINDOW = 8;
const MAX_MISTAKES = 8;
const RETRY_DELAY_MIN = 2;
const RETRY_DELAY_MAX = 3;
const CHOICE_COUNT = 4;

const CARDS = [
  pairWord("checklist-9", "agnoscit", "agnovit", "recognises"),
  word("checklist-9", "celeriter", "quickly"),
  pairWord("checklist-9", "cupit", "cupivit", "wants"),
  pairWord("checklist-9", "dat", "dedit", "gives"),
  word("checklist-9", "dies", "day"),
  pairWord("checklist-9", "emittit", "emisit", "throws / sends out", {
    englishAnswers: ["throws", "sends out", "throws sends out"],
  }),
  pairWord("checklist-9", "fert", "tulit", "brings / carries", {
    englishAnswers: ["brings", "carries", "brings carries"],
  }),
  word("checklist-9", "homo", "human being / man", {
    englishAnswers: ["human being", "man", "human being man"],
  }),
  word("checklist-9", "hospes", "guest"),
  word("checklist-9", "ille", "that"),
  pairWord("checklist-9", "inspicit", "inspexit", "examines / inspects", {
    englishAnswers: ["examines", "inspects", "examines inspects"],
  }),
  word("checklist-9", "iterum", "again"),
  pairWord("checklist-9", "manet", "mansit", "remains / stays", {
    englishAnswers: ["remains", "stays", "remains stays"],
  }),
  word("checklist-9", "medius", "middle"),
  word("checklist-9", "mox", "soon"),
  pairWord("checklist-9", "offert", "obtulit", "offers"),
  pairWord("checklist-9", "ostendit", "ostendit", "shows"),
  word("checklist-9", "post", "after / behind", {
    englishAnswers: ["after", "behind", "after behind"],
  }),
  pairWord("checklist-9", "procedit", "processit", "proceeds / advances", {
    englishAnswers: ["proceeds", "advances", "proceeds advances"],
  }),
  word("checklist-9", "pulcher", "beautiful"),
  pairWord("checklist-9", "revenit", "revenit", "comes back / returns", {
    englishAnswers: ["comes back", "returns", "comes back returns"],
  }),
  pairWord("checklist-9", "tradit", "tradidit", "hands over"),
  pairWord("checklist-10", "abit", "abiit", "goes away"),
  pairWord("checklist-10", "accipit", "accepit", "accepts"),
  word("checklist-10", "calidus", "warm"),
  pairWord("checklist-10", "capit", "cepit", "captures / takes", {
    englishAnswers: ["captures", "takes", "captures takes"],
  }),
  word("checklist-10", "contentus", "satisfied"),
  pairWord("checklist-10", "exclamat", "exclamavit", "exclaims"),
  word("checklist-10", "frater", "brother"),
  pairWord("checklist-10", "habitat", "habitavit", "lives"),
  word("checklist-10", "imperium", "empire"),
  pairWord("checklist-10", "invenit", "invenit", "finds"),
  word("checklist-10", "liber", "book"),
  word("checklist-10", "nos", "we"),
  pairWord("checklist-10", "nuntiat", "nuntiavit", "announces"),
  word("checklist-10", "pax", "peace"),
  word("checklist-10", "portus", "harbour"),
  word("checklist-10", "quam", "than / how", {
    englishAnswers: ["than", "how", "than how"],
  }),
  word("checklist-10", "semper", "always"),
  pairWord("checklist-10", "servat", "servavit", "saves / keeps safe", {
    englishAnswers: ["saves", "keeps safe", "saves keeps safe"],
  }),
  word("checklist-10", "solus", "alone / lonely", {
    englishAnswers: ["alone", "lonely", "alone lonely"],
  }),
  word("checklist-10", "suus", "his / her / their", {
    englishAnswers: ["his", "her", "their", "his her their"],
  }),
  pairWord("checklist-10", "tacet", "tacuit", "is silent / is quiet", {
    englishAnswers: ["is silent", "is quiet", "silent", "quiet", "is silent is quiet"],
  }),
  word("checklist-10", "uxor", "wife"),
  word("checklist-10", "vehementer", "loudly / energetically", {
    englishAnswers: ["loudly", "energetically", "loudly energetically"],
  }),
  word("checklist-10", "vos", "you (plural)", {
    englishAnswers: ["you", "you plural"],
  }),
];

const state = loadState();
let currentQuestion = null;
let quizStarted = false;

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindControls();
  syncControlsFromState();
  refreshDashboard();
  renderStartState();
});

function word(set, latinDisplay, englishDisplay, overrides = {}) {
  return {
    id: `${set}-${slug(latinDisplay)}`,
    set,
    kind: overrides.kind || "single",
    latinDisplay,
    englishDisplay,
    latinAnswers: unique(overrides.latinAnswers || buildLatinAnswers(latinDisplay)),
    englishAnswers: unique(overrides.englishAnswers || buildEnglishAnswers(englishDisplay)),
  };
}

function pairWord(set, firstForm, secondForm, englishDisplay, overrides = {}) {
  const latinDisplay = `${firstForm}: ${secondForm}`;

  return word(set, latinDisplay, englishDisplay, {
    ...overrides,
    kind: "verb-pair",
    latinAnswers: unique([
      latinDisplay,
      `${firstForm} ${secondForm}`,
      firstForm,
    ]),
  });
}

function buildLatinAnswers(display) {
  return unique([
    display,
    display.replace(/:\s*/g, " "),
  ]);
}

function buildEnglishAnswers(display) {
  const parts = display
    .split("/")
    .map((item) => item.trim())
    .filter(Boolean);

  return unique([
    display,
    display.replace(/\s*\/\s*/g, " "),
    ...parts,
  ]);
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function loadState() {
  const fallback = {
    settings: {
      direction: "mixed",
      answerMode: "mixed",
      setMode: "all",
    },
    stats: {},
    retryQueue: [],
    recentCards: [],
    recentKeys: [],
    recentMistakes: [],
    session: {
      currentStreak: 0,
      promptCount: 0,
    },
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      settings: { ...fallback.settings, ...(parsed.settings || {}) },
      session: { ...fallback.session, ...(parsed.session || {}) },
      stats: parsed.stats || {},
      retryQueue: Array.isArray(parsed.retryQueue) ? parsed.retryQueue : [],
      recentCards: Array.isArray(parsed.recentCards) ? parsed.recentCards : [],
      recentKeys: Array.isArray(parsed.recentKeys) ? parsed.recentKeys : [],
      recentMistakes: Array.isArray(parsed.recentMistakes) ? parsed.recentMistakes : [],
    };
  } catch (_error) {
    return fallback;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_error) {
    // Ignore storage failures so the quiz still works in-memory.
  }
}

function cacheElements() {
  els.directionButtons = [...document.querySelectorAll('[data-setting="direction"]')];
  els.answerButtons = [...document.querySelectorAll('[data-setting="answerMode"]')];
  els.setButtons = [...document.querySelectorAll('[data-setting="setMode"]')];
  els.startPanel = document.getElementById("startPanel");
  els.startSummary = document.getElementById("startSummary");
  els.startBtn = document.getElementById("startBtn");
  els.quizContent = document.getElementById("quizContent");
  els.resetProgressBtn = document.getElementById("resetProgressBtn");
  els.answeredValue = document.getElementById("answeredValue");
  els.accuracyValue = document.getElementById("accuracyValue");
  els.accuracyDetail = document.getElementById("accuracyDetail");
  els.streakValue = document.getElementById("streakValue");
  els.reviewValue = document.getElementById("reviewValue");
  els.setBadge = document.getElementById("setBadge");
  els.directionBadge = document.getElementById("directionBadge");
  els.answerBadge = document.getElementById("answerBadge");
  els.promptText = document.getElementById("promptText");
  els.promptHint = document.getElementById("promptHint");
  els.typingPanel = document.getElementById("typingPanel");
  els.multipleChoicePanel = document.getElementById("multipleChoicePanel");
  els.typingForm = document.getElementById("typingForm");
  els.answerInput = document.getElementById("answerInput");
  els.checkBtn = document.getElementById("checkBtn");
  els.giveUpBtn = document.getElementById("giveUpBtn");
  els.giveUpMcBtn = document.getElementById("giveUpMcBtn");
  els.optionsGrid = document.getElementById("optionsGrid");
  els.feedbackPanel = document.getElementById("feedbackPanel");
  els.feedbackTitle = document.getElementById("feedbackTitle");
  els.feedbackBody = document.getElementById("feedbackBody");
  els.feedbackMeta = document.getElementById("feedbackMeta");
  els.skipBtn = document.getElementById("skipBtn");
  els.nextBtn = document.getElementById("nextBtn");
  els.hardList = document.getElementById("hardList");
  els.mistakeList = document.getElementById("mistakeList");
}

function bindControls() {
  [...els.directionButtons, ...els.answerButtons, ...els.setButtons].forEach((button) => {
    button.addEventListener("click", () => {
      const { setting, value } = button.dataset;
      state.settings[setting] = value;
      saveState();
      syncControlsFromState();

      if (quizStarted) {
        nextQuestion();
      } else {
        renderStartState();
      }
    });
  });

  els.startBtn.addEventListener("click", startQuiz);

  els.typingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!currentQuestion || currentQuestion.answered) {
      return;
    }

    submitTypedAnswer(els.answerInput.value);
  });

  els.giveUpBtn.addEventListener("click", revealAnswer);
  els.giveUpMcBtn.addEventListener("click", revealAnswer);
  els.skipBtn.addEventListener("click", nextQuestion);
  els.nextBtn.addEventListener("click", nextQuestion);

  els.resetProgressBtn.addEventListener("click", () => {
    if (!window.confirm("Reset all saved quiz progress for this page?")) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });

  document.addEventListener("keydown", (event) => {
    if (!currentQuestion || currentQuestion.answered) {
      return;
    }

    if (currentQuestion.answerMode !== "multiple-choice") {
      return;
    }

    const optionIndex = Number(event.key) - 1;
    if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= currentQuestion.choices.length) {
      return;
    }

    const option = currentQuestion.choices[optionIndex];
    if (option) {
      submitChoice(option.value);
    }
  });
}

function renderStartState() {
  const answered = sum(Object.values(state.stats), (entry) => entry.seen || 0);
  const correct = sum(Object.values(state.stats), (entry) => entry.correct || 0);
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;

  els.startSummary.textContent = [
    `Setup: ${labelForDirection(state.settings.direction)} | ${labelForAnswerMode(state.settings.answerMode)} | ${labelForSet(state.settings.setMode)}.`,
    answered ? `Saved progress: ${answered} answers, ${accuracy}% accuracy.` : "Saved progress: none yet.",
  ].join(" ");

  els.startPanel.classList.remove("hidden");
  els.quizContent.classList.add("hidden");
}

function startQuiz() {
  quizStarted = true;
  els.startPanel.classList.add("hidden");
  els.quizContent.classList.remove("hidden");
  nextQuestion();
}

function syncControlsFromState() {
  els.directionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.value === state.settings.direction);
  });

  els.answerButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.value === state.settings.answerMode);
  });

  els.setButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.value === state.settings.setMode);
  });
}

function labelForDirection(value) {
  return {
    "en-la": "English -> Latin",
    "la-en": "Latin -> English",
    mixed: "Mixed direction",
  }[value] || value;
}

function labelForAnswerMode(value) {
  return {
    typing: "Typing",
    "multiple-choice": "Multiple choice",
    mixed: "Mixed answers",
  }[value] || value;
}

function labelForSet(value) {
  return {
    all: "All words",
    "checklist-9": "Checklist 9",
    "checklist-10": "Checklist 10",
  }[value] || value;
}

function refreshDashboard() {
  const statsEntries = Object.values(state.stats);
  const answered = sum(statsEntries, (entry) => entry.seen || 0);
  const correct = sum(statsEntries, (entry) => entry.correct || 0);
  const incorrect = sum(statsEntries, (entry) => entry.incorrect || 0);
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;
  const reviewCount = statsEntries.filter((entry) => difficultyScore(entry) >= 3.4).length;

  els.answeredValue.textContent = String(answered);
  els.accuracyValue.textContent = `${accuracy}%`;
  els.accuracyDetail.textContent = answered
    ? `${correct} correct, ${incorrect} incorrect`
    : "No answers yet";
  els.streakValue.textContent = String(state.session.currentStreak || 0);
  els.reviewValue.textContent = String(reviewCount);

  renderHardList();
  renderMistakeList();
}

function renderHardList() {
  const items = CARDS
    .map((card) => {
      const directions = ["en-la", "la-en"].map((direction) => getStats(`${card.id}::${direction}`));
      const aggregate = {
        seen: sum(directions, (entry) => entry.seen),
        correct: sum(directions, (entry) => entry.correct),
        incorrect: sum(directions, (entry) => entry.incorrect),
        revealed: sum(directions, (entry) => entry.revealed),
        mastery: directions.length ? sum(directions, (entry) => entry.mastery) / directions.length : 0,
        wrongStreak: Math.max(...directions.map((entry) => entry.wrongStreak), 0),
        correctStreak: Math.max(...directions.map((entry) => entry.correctStreak), 0),
      };

      return { card, score: difficultyScore(aggregate) };
    })
    .filter((item) => item.score > 0.6)
    .sort((left, right) => right.score - left.score)
    .slice(0, 6);

  if (!items.length) {
    els.hardList.innerHTML = "<li>Nothing stands out yet. Keep going.</li>";
    return;
  }

  els.hardList.innerHTML = items
    .map((item) => `<li><strong>${escapeHtml(item.card.englishDisplay)}</strong> <span>-> ${escapeHtml(item.card.latinDisplay)}</span></li>`)
    .join("");
}

function renderMistakeList() {
  if (!state.recentMistakes.length) {
    els.mistakeList.innerHTML = "<li>No misses logged yet.</li>";
    return;
  }

  els.mistakeList.innerHTML = state.recentMistakes
    .map((item) => `<li><strong>${escapeHtml(item.prompt)}</strong> -> ${escapeHtml(item.answer)}</li>`)
    .join("");
}

function nextQuestion() {
  if (!quizStarted) {
    return;
  }

  const pool = buildCandidatePool();
  if (!pool.length) {
    return;
  }

  const candidate = chooseCandidate(pool);
  if (!candidate) {
    return;
  }

  state.session.promptCount = (state.session.promptCount || 0) + 1;
  rememberServedCandidate(candidate);

  const answerMode = chooseAnswerMode(candidate);
  currentQuestion = {
    ...candidate,
    answerMode,
    answered: false,
    choices: answerMode === "multiple-choice" ? buildChoices(candidate) : [],
  };

  saveState();
  renderQuestion();
}

function buildCandidatePool() {
  const directions = state.settings.direction === "mixed"
    ? ["en-la", "la-en"]
    : [state.settings.direction];

  const cards = state.settings.setMode === "all"
    ? CARDS
    : CARDS.filter((card) => card.set === state.settings.setMode);

  return cards.flatMap((card) => directions.map((direction) => ({
    card,
    direction,
    key: `${card.id}::${direction}`,
  })));
}

function chooseCandidate(pool) {
  const retryCandidate = chooseRetryCandidate(pool);
  if (retryCandidate) {
    return retryCandidate;
  }

  let weighted = pool
    .map((candidate) => ({ candidate, weight: samplingWeight(candidate) }))
    .filter((entry) => entry.weight > 0);

  if (!weighted.length) {
    weighted = pool.map((candidate) => ({ candidate, weight: 1 }));
  }

  const totalWeight = sum(weighted, (entry) => entry.weight);
  let roll = Math.random() * totalWeight;

  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.candidate;
    }
  }

  return weighted[weighted.length - 1].candidate;
}

function chooseRetryCandidate(pool) {
  const byKey = new Map(pool.map((candidate) => [candidate.key, candidate]));
  const lastKey = state.recentKeys[state.recentKeys.length - 1];
  const lastCardId = state.recentCards[state.recentCards.length - 1];
  const promptCount = state.session.promptCount || 0;

  const dueEntries = state.retryQueue
    .map((entry) => ({
      entry,
      candidate: byKey.get(entry.key),
    }))
    .filter((item) => item.candidate)
    .filter((item) => item.entry.dueAt <= promptCount)
    .filter((item) => item.entry.key !== lastKey)
    .filter((item) => item.candidate.card.id !== lastCardId);

  if (!dueEntries.length) {
    return null;
  }

  const weighted = dueEntries.map((item) => ({
    candidate: item.candidate,
    weight: 7 + (promptCount - item.entry.dueAt) + (getStats(item.entry.key).wrongStreak * 2),
  }));

  const totalWeight = sum(weighted, (entry) => entry.weight);
  let roll = Math.random() * totalWeight;

  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) {
      return { ...entry.candidate, retryPrompt: true };
    }
  }

  return { ...weighted[weighted.length - 1].candidate, retryPrompt: true };
}

function samplingWeight(candidate) {
  const stats = getStats(candidate.key);
  const recentKeyIndex = state.recentKeys.lastIndexOf(candidate.key);
  const recentCardIndex = state.recentCards.lastIndexOf(candidate.card.id);
  let weight = 1.1;

  if (stats.seen === 0) {
    weight += 0.85;
  }

  weight += stats.incorrect * 2.1;
  weight += stats.revealed * 1.1;
  weight += stats.wrongStreak * 1.9;
  weight += Math.max(0, 2.6 - stats.mastery) * 0.35;

  if (recentCardIndex >= 0) {
    if (recentCardIndex === state.recentCards.length - 1) {
      return 0;
    }

    weight *= 0.24;
  }

  if (recentKeyIndex >= 0) {
    weight *= 0.18;
  }

  if (stats.correctStreak >= 4 && stats.incorrect === 0) {
    weight *= 0.4;
  }

  return Math.max(weight, 0);
}

function chooseAnswerMode(candidate) {
  if (state.settings.answerMode !== "mixed") {
    return state.settings.answerMode;
  }

  const stats = getStats(candidate.key);
  let typingChance = candidate.direction === "en-la" ? 0.62 : 0.48;

  if (stats.seen === 0) {
    typingChance -= 0.25;
  }

  if (stats.correctStreak >= 2) {
    typingChance += 0.1;
  }

  if (stats.wrongStreak >= 1) {
    typingChance -= 0.12;
  }

  typingChance = clamp(typingChance, 0.3, 0.82);
  return Math.random() < typingChance ? "typing" : "multiple-choice";
}

function buildChoices(candidate) {
  const correctValue = displayAnswer(candidate);
  const distractors = buildDistractorCards(candidate)
    .map((card) => candidate.direction === "en-la" ? card.latinDisplay : card.englishDisplay)
    .filter((value, index, list) => list.findIndex((item) => normalize(item) === normalize(value)) === index)
    .filter((value) => normalize(value) !== normalize(correctValue))
    .slice(0, CHOICE_COUNT - 1);

  return shuffle([correctValue, ...distractors]).map((value) => ({
    value,
    correct: normalize(value) === normalize(correctValue),
  }));
}

function buildDistractorCards(candidate) {
  const others = CARDS.filter((card) => card.id !== candidate.card.id);
  const sameSetSameKind = others.filter((card) => card.set === candidate.card.set && card.kind === candidate.card.kind);
  const sameSet = others.filter((card) => card.set === candidate.card.set && card.kind !== candidate.card.kind);
  const sameKind = others.filter((card) => card.set !== candidate.card.set && card.kind === candidate.card.kind);
  const rest = others.filter((card) => card.set !== candidate.card.set && card.kind !== candidate.card.kind);

  return [
    ...shuffle(sameSetSameKind),
    ...shuffle(sameSet),
    ...shuffle(sameKind),
    ...shuffle(rest),
  ];
}

function renderQuestion() {
  els.setBadge.textContent = labelForSet(currentQuestion.card.set);
  els.directionBadge.textContent = labelForDirection(currentQuestion.direction);
  els.answerBadge.textContent = labelForAnswerMode(currentQuestion.answerMode);
  els.promptText.textContent = promptValue(currentQuestion);
  els.promptHint.textContent = hintForQuestion(currentQuestion);

  els.feedbackPanel.classList.add("hidden");
  els.feedbackPanel.classList.remove("good", "bad");
  els.feedbackTitle.textContent = "";
  els.feedbackBody.textContent = "";
  els.feedbackMeta.textContent = "";
  els.skipBtn.classList.remove("hidden");
  els.nextBtn.classList.add("hidden");

  if (currentQuestion.answerMode === "typing") {
    els.typingPanel.classList.remove("hidden");
    els.multipleChoicePanel.classList.add("hidden");
    els.answerInput.value = "";
    els.answerInput.disabled = false;
    els.checkBtn.disabled = false;
    els.giveUpBtn.disabled = false;
    els.answerInput.focus();
    return;
  }

  els.typingPanel.classList.add("hidden");
  els.multipleChoicePanel.classList.remove("hidden");
  els.optionsGrid.innerHTML = "";

  currentQuestion.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.dataset.value = choice.value;
    button.innerHTML = `<strong>${index + 1}.</strong> ${escapeHtml(choice.value)}`;
    button.addEventListener("click", () => submitChoice(choice.value));
    els.optionsGrid.appendChild(button);
  });

  els.giveUpMcBtn.disabled = false;
}

function promptValue(question) {
  return question.direction === "en-la" ? question.card.englishDisplay : question.card.latinDisplay;
}

function displayAnswer(question) {
  return question.direction === "en-la" ? question.card.latinDisplay : question.card.englishDisplay;
}

function acceptedAnswers(question) {
  return question.direction === "en-la" ? question.card.latinAnswers : question.card.englishAnswers;
}

function hintForQuestion(question) {
  const hints = [];

  if (question.direction === "en-la") {
    hints.push("Macrons and most punctuation are ignored.");
  }

  if (question.direction === "en-la" && question.card.kind === "verb-pair") {
    hints.push("For verb pairs, the first Latin form on its own is accepted.");
  }

  if (question.direction === "la-en" && question.card.englishAnswers.length > 1) {
    hints.push("One English meaning is enough.");
  }

  return hints.join(" ");
}

function submitTypedAnswer(rawValue) {
  const answer = rawValue.trim();
  if (!answer) {
    return;
  }

  const correct = acceptedAnswers(currentQuestion)
    .some((expected) => normalize(expected) === normalize(answer));

  finalizeAnswer(correct, {
    userAnswer: answer,
    revealed: false,
  });
}

function submitChoice(value) {
  const correct = normalize(value) === normalize(displayAnswer(currentQuestion));

  finalizeAnswer(correct, {
    userAnswer: value,
    revealed: false,
    selectedChoice: value,
  });
}

function revealAnswer() {
  finalizeAnswer(false, {
    userAnswer: "I gave up",
    revealed: true,
  });
}

function finalizeAnswer(correct, meta) {
  if (!currentQuestion || currentQuestion.answered) {
    return;
  }

  currentQuestion.answered = true;
  updateStatsForAnswer(currentQuestion.key, correct, meta.revealed);

  if (currentQuestion.answerMode === "typing") {
    els.answerInput.disabled = true;
    els.checkBtn.disabled = true;
    els.giveUpBtn.disabled = true;
  } else {
    els.giveUpMcBtn.disabled = true;
    lockChoiceButtons(meta.selectedChoice);
  }

  if (!correct) {
    logMistake(promptValue(currentQuestion), displayAnswer(currentQuestion));
  }

  renderFeedback(correct, meta);
  refreshDashboard();
  saveState();

  els.skipBtn.classList.add("hidden");
  els.nextBtn.classList.remove("hidden");
}

function updateStatsForAnswer(key, correct, revealed) {
  const stats = getMutableStats(key);
  stats.seen += 1;
  stats.lastSeenAt = Date.now();

  if (correct) {
    stats.correct += 1;
    stats.correctStreak += 1;
    stats.wrongStreak = 0;
    stats.mastery = clamp(stats.mastery + 0.75, 0, 6);
    state.session.currentStreak = (state.session.currentStreak || 0) + 1;
    removeRetry(key);
    return;
  }

  stats.incorrect += 1;
  stats.correctStreak = 0;
  stats.wrongStreak += 1;
  stats.mastery = clamp(stats.mastery - 0.7, 0, 6);

  if (revealed) {
    stats.revealed += 1;
  }

  state.session.currentStreak = 0;
  enqueueRetry(key);
}

function renderFeedback(correct, meta) {
  const answer = displayAnswer(currentQuestion);
  const retryLine = currentQuestion.retryPrompt
    ? "This was a retry card."
    : "";

  els.feedbackPanel.classList.remove("hidden");
  els.feedbackPanel.classList.toggle("good", correct);
  els.feedbackPanel.classList.toggle("bad", !correct);

  if (correct) {
    els.feedbackTitle.textContent = "Correct";
    els.feedbackBody.textContent = `Answer: ${answer}`;
    els.feedbackMeta.textContent = retryLine || "Keep going.";
    return;
  }

  if (meta.revealed) {
    els.feedbackTitle.textContent = "Answer shown";
    els.feedbackBody.textContent = `Correct answer: ${answer}`;
    els.feedbackMeta.textContent = "Marked as a miss. This word will come back soon.";
    return;
  }

  els.feedbackTitle.textContent = "Not quite";
  els.feedbackBody.textContent = `Correct answer: ${answer}`;
  els.feedbackMeta.textContent = meta.userAnswer
    ? `You wrote "${meta.userAnswer}". This word will come back soon.`
    : "This word will come back soon.";
}

function lockChoiceButtons(selectedChoice) {
  const correctValue = displayAnswer(currentQuestion);
  const buttons = [...els.optionsGrid.querySelectorAll(".option-btn")];

  buttons.forEach((button) => {
    const value = button.dataset.value || "";
    button.disabled = true;

    if (normalize(value) === normalize(correctValue)) {
      button.classList.add("correct");
    } else if (selectedChoice && normalize(value) === normalize(selectedChoice)) {
      button.classList.add("wrong");
    }
  });
}

function enqueueRetry(key) {
  const dueAt = (state.session.promptCount || 0) + randomInt(RETRY_DELAY_MIN, RETRY_DELAY_MAX);
  const existing = state.retryQueue.find((entry) => entry.key === key);

  if (existing) {
    existing.dueAt = dueAt;
    return;
  }

  state.retryQueue.push({ key, dueAt });
}

function removeRetry(key) {
  state.retryQueue = state.retryQueue.filter((entry) => entry.key !== key);
}

function rememberServedCandidate(candidate) {
  state.recentCards.push(candidate.card.id);
  state.recentKeys.push(candidate.key);

  while (state.recentCards.length > RECENT_CARD_WINDOW) {
    state.recentCards.shift();
  }

  while (state.recentKeys.length > RECENT_KEY_WINDOW) {
    state.recentKeys.shift();
  }
}

function logMistake(prompt, answer) {
  state.recentMistakes.unshift({ prompt, answer });
  state.recentMistakes = state.recentMistakes.slice(0, MAX_MISTAKES);
}

function getStats(key) {
  return {
    seen: 0,
    correct: 0,
    incorrect: 0,
    revealed: 0,
    mastery: 0,
    wrongStreak: 0,
    correctStreak: 0,
    lastSeenAt: 0,
    ...(state.stats[key] || {}),
  };
}

function getMutableStats(key) {
  if (!state.stats[key]) {
    state.stats[key] = getStats(key);
  }

  return state.stats[key];
}

function difficultyScore(entry) {
  let score = 0;
  score += entry.incorrect * 2.2;
  score += entry.revealed * 1.1;
  score += entry.wrongStreak * 1.8;
  score += Math.max(0, 2.6 - entry.mastery) * 0.45;
  score -= entry.correctStreak * 0.16;
  return Math.max(score, 0);
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sum(items, iteratee) {
  return items.reduce((total, item) => total + iteratee(item), 0);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function unique(items) {
  return items.filter((item, index) => items.findIndex((value) => normalize(value) === normalize(item)) === index);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
