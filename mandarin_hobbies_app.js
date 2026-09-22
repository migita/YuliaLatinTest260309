(function () {
  "use strict";
  const { CARDS, checkAnswer, questions, newRound, takeNext, scheduleRetry } = window.MandarinHobbies;
  const STORAGE_KEY = "mandarin-jinbu1-hobbies-v1";
  const defaults = { mode: "both", answerMode: "typing", checkTones: true };
  const cardById = Object.fromEntries(CARDS.map(card => [card.id, card]));
  const $ = id => document.getElementById(id);
  const show = (id, visible) => $(id).classList.toggle("hidden", !visible);
  const label = skill => skill === "pinyin" ? "Pinyin" : "English";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (_) { /* Use fresh progress. */ }
  const state = { settings: { ...defaults, ...saved.settings }, stats: saved.stats || {}, streak: saved.streak || 0 };
  if (!["both", "pinyin", "english"].includes(state.settings.mode)) state.settings.mode = "both";
  if (!["typing", "paper"].includes(state.settings.answerMode)) state.settings.answerMode = "typing";
  let round = null;
  let current = null;

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* Still usable without storage. */ }
  }

  function reviewQuestions() {
    return questions(state.settings.mode).filter(q => state.stats[q.key]?.needsReview);
  }

  function refresh() {
    document.querySelectorAll("[data-setting]").forEach(button => {
      const active = state.settings[button.dataset.setting] === button.dataset.value;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
      button.disabled = Boolean(round);
    });
    $("checkTones").checked = state.settings.checkTones;
    $("checkTones").disabled = Boolean(round) || state.settings.mode === "english";
    const entries = Object.values(state.stats);
    const attempts = entries.reduce((n, s) => n + (s.typed || 0), 0);
    const correct = entries.reduce((n, s) => n + (s.correct || 0), 0);
    $("answeredValue").textContent = attempts;
    $("accuracyValue").textContent = attempts ? Math.round(correct / attempts * 100) + "%" : "—";
    $("streakValue").textContent = state.streak;
    const misses = questions().filter(q => state.stats[q.key]?.needsReview);
    $("reviewValue").textContent = misses.length;
    $("reviewList").replaceChildren();
    if (!misses.length) $("reviewList").textContent = "No missed answers to review yet.";
    misses.slice(0, 8).forEach(q => {
      const row = document.createElement("div");
      row.className = "review-row";
      const hanzi = document.createElement("span");
      hanzi.lang = "zh-Hans";
      hanzi.textContent = cardById[q.id].hanzi;
      const skill = document.createElement("span");
      skill.textContent = label(q.skill);
      row.append(hanzi, skill);
      $("reviewList").append(row);
    });
    ["reviewBtn", "retryBtn"].forEach(id => { $(id).disabled = !reviewQuestions().length; });
    const n = questions(state.settings.mode).length;
    $("startSummary").textContent = `${n} questions · ${state.settings.answerMode === "typing" ? "Typed answers" : "Self-checked on paper"}${state.settings.mode !== "english" ? (state.settings.checkTones ? " · Tones checked" : " · Pinyin spelling only") : ""}`;
  }

  function start(reviewOnly = false) {
    const queue = newRound(state.settings.mode, state.stats, reviewOnly);
    if (!queue.length) return;
    round = { queue, total: queue.length, results: [], recent: [], settings: { ...state.settings } };
    show("startPanel", false);
    show("summaryPanel", false);
    show("quizContent", true);
    refresh();
    next();
    $("quizContent").scrollIntoView({ block: "start" });
  }

  function next() {
    if (!round) return;
    const question = takeNext(round.queue, round.recent);
    if (!question) return finish(false);
    current = { ...question, answered: false, revealed: false };
    round.recent.push(current.id);
    round.recent = round.recent.slice(-3);
    const done = round.results.filter(r => !r.retry).length;
    $("directionBadge").textContent = "Hanzi → " + label(current.skill);
    $("progressBadge").textContent = current.retry ? "Retry · " + done + "/" + round.total + " first attempts done" : "Question " + (done + 1) + " of " + round.total;
    $("roundProgress").max = round.total;
    $("roundProgress").value = done;
    $("promptLabel").textContent = current.skill === "pinyin" ? "What is the pinyin?" : "What does this mean in English?";
    $("promptText").textContent = cardById[current.id].hanzi;
    $("promptHint").textContent = current.skill === "pinyin"
      ? (round.settings.checkTones ? "Include tones: mǎ or ma3. Spaces and capitals do not matter." : "Spelling practice: tone marks are optional.")
      : "Give the English meaning. Usual equivalent phrases are accepted.";
    $("answerLabel").textContent = "Your " + label(current.skill).toLowerCase() + " answer";
    $("answerInput").value = "";
    $("answerInput").placeholder = current.skill === "pinyin" ? "Type pinyin here" : "Type the English meaning";
    $("answerInput").disabled = false;
    $("checkBtn").disabled = false;
    $("giveUpBtn").disabled = false;
    $("revealPaperBtn").disabled = false;
    show("typingForm", round.settings.answerMode === "typing");
    show("paperPanel", round.settings.answerMode === "paper");
    ["feedbackPanel", "selfMarkPanel", "nextBtn"].forEach(id => show(id, false));
    $("feedbackBody").textContent = "";
    if (round.settings.answerMode === "typing") $("answerInput").focus({ preventScroll: true });
  }

  function feedback(title, note, result = "") {
    const card = cardById[current.id];
    $("feedbackPanel").className = "feedback" + (result ? " " + result : "");
    $("feedbackTitle").textContent = title;
    $("feedbackBody").textContent = current.skill === "pinyin" ? card.pinyin : card.english;
    $("feedbackBody").lang = current.skill === "pinyin" ? "zh-Latn" : "en";
    $("feedbackNote").textContent = note;
  }

  function mark(correct, revealed = false) {
    if (!current || current.answered || !round) return;
    current.answered = true;
    const paper = round.settings.answerMode === "paper";
    const entry = { typed: 0, correct: 0, selfChecked: 0, needsReview: false, ...state.stats[current.key] };
    if (paper) entry.selfChecked += 1;
    else {
      entry.typed += 1;
      entry.correct += Number(correct);
      state.streak = correct ? state.streak + 1 : 0;
    }
    entry.needsReview = !correct;
    state.stats[current.key] = entry;
    round.results.push({ key: current.key, skill: current.skill, correct, retry: current.retry });
    if (!correct) scheduleRetry(round.queue, current);
    save();
    refresh();
    $("answerInput").disabled = true;
    $("checkBtn").disabled = true;
    $("giveUpBtn").disabled = true;
    show("selfMarkPanel", false);
    const note = correct ? (current.retry ? "Good recall on the retry." : "")
      : (current.retry ? "You can practise this again after the round." : "This question will come back later for another try.");
    feedback(correct ? (paper ? "Marked correct" : "Correct!") : (revealed ? "Here's the answer" : "Not quite — here's the answer"), note, correct ? "good" : "bad");
    show("nextBtn", true);
    $("nextBtn").focus({ preventScroll: true });
  }

  function finish(early) {
    if (!round) return;
    const first = round.results.filter(r => !r.retry);
    const correct = first.filter(r => r.correct).length;
    const retries = round.results.filter(r => r.retry);
    $("summaryTitle").textContent = early ? "Finished for now" : "Test complete";
    $("summaryScore").textContent = `${correct} / ${first.length} correct first time`;
    $("summaryDetail").textContent = `${first.length} of ${round.total} questions completed. ${retries.length ? `${retries.filter(r => r.correct).length} of ${retries.length} retries correct. ` : ""}${round.settings.answerMode === "paper" ? "Self-checked answers are separate from typed accuracy." : (round.settings.checkTones ? "" : "Pinyin was checked for spelling only.")}`;
    $("summarySkills").textContent = ["pinyin", "english"].map(skill => {
      const results = first.filter(r => r.skill === skill);
      return results.length ? `${label(skill)}: ${results.filter(r => r.correct).length}/${results.length}` : "";
    }).filter(Boolean).join(" · ");
    round = null;
    current = null;
    show("quizContent", false);
    show("summaryPanel", true);
    refresh();
    $("summaryPanel").focus({ preventScroll: true });
    $("summaryPanel").scrollIntoView({ block: "start" });
  }

  document.querySelectorAll("[data-setting]").forEach(button => button.addEventListener("click", () => {
    if (round) return;
    state.settings[button.dataset.setting] = button.dataset.value;
    save();
    refresh();
  }));
  $("checkTones").addEventListener("change", () => { state.settings.checkTones = $("checkTones").checked; save(); refresh(); });
  $("startBtn").addEventListener("click", () => start());
  $("restartBtn").addEventListener("click", () => start());
  $("reviewBtn").addEventListener("click", () => start(true));
  $("retryBtn").addEventListener("click", () => start(true));
  $("typingForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!current || current.answered) return;
    if (!$("answerInput").value.trim()) { $("answerInput").focus(); return; }
    mark(checkAnswer(cardById[current.id], current.skill, $("answerInput").value, round.settings.checkTones));
  });
  $("giveUpBtn").addEventListener("click", () => mark(false, true));
  $("revealPaperBtn").addEventListener("click", () => {
    if (!current || current.answered) return;
    current.revealed = true;
    $("revealPaperBtn").disabled = true;
    feedback("Compare with your answer", "Mark your own work below.");
    show("selfMarkPanel", true);
    $("selfRightBtn").focus({ preventScroll: true });
  });
  $("selfRightBtn").addEventListener("click", () => { if (current?.revealed) mark(true); });
  $("selfWrongBtn").addEventListener("click", () => { if (current?.revealed) mark(false); });
  $("nextBtn").addEventListener("click", () => { if (current?.answered) next(); });
  $("endBtn").addEventListener("click", () => finish(true));
  $("resetBtn").addEventListener("click", () => {
    if (!window.confirm("Reset saved progress for Mandarin Hobbies?")) return;
    state.stats = {};
    state.streak = 0;
    round = null;
    current = null;
    save();
    show("quizContent", false);
    show("summaryPanel", false);
    show("startPanel", true);
    refresh();
  });
  refresh();
})();
