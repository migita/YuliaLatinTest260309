const test = require("node:test");
const assert = require("node:assert/strict");
const quiz = require("./mandarin_hobbies_core.js");
const card = id => quiz.CARDS.find(item => item.id === id);

test("all 25 photographed entries appear once in each skill", () => {
  assert.equal(quiz.CARDS.length, 25);
  assert.equal(new Set(quiz.CARDS.map(c => c.hanzi)).size, 25);
  const questions = quiz.newRound("both");
  assert.equal(questions.length, 50);
  assert.equal(new Set(questions.map(q => q.key)).size, 50);
  for (const skill of ["pinyin", "english"]) {
    assert.equal(questions.filter(q => q.skill === skill).length, 25);
    for (const c of quiz.CARDS) assert.ok(quiz.checkAnswer(c, skill, c[skill]), c.id);
  }
});

test("pinyin accepts marks, tone numbers, compact syllables, case and Unicode variants", () => {
  for (const answer of ["kàn shū", "KAN4 SHU1", "kan4shu1", "kànshū", "  kàn shū! ", "kàn shū".normalize("NFD")]) {
    assert.ok(quiz.checkAnswer(card("read-books"), "pinyin", answer), answer);
  }
  assert.ok(quiz.checkAnswer(card("your-hobby"), "pinyin", "ni3 de5 ai4 hao4 shi4 shen2 me0"));
  assert.ok(quiz.checkAnswer(card("your-hobby"), "pinyin", "ni3deai4hao4shi4shen2me"));
});

test("erhua and the sheet's neutral-tone variants are accepted", () => {
  for (const answer of ["wánr", "wan2r", "wanr2", "wan2 er5", "wan2 er"]) {
    assert.ok(quiz.checkAnswer(card("play"), "pinyin", answer), answer);
  }
  for (const answer of ["xi3 huan1", "xi3 huan", "xi3huan5", "xǐ huan"]) {
    assert.ok(quiz.checkAnswer(card("like"), "pinyin", answer), answer);
  }
  assert.ok(quiz.checkAnswer(card("computer-games"), "pinyin", "wan2r dian4 nao3 you2 xi4"));
  assert.ok(quiz.checkAnswer(card("shopping"), "pinyin", "mai3 dong1 xi5"));
});

test("wrong or missing tones fail by default, including buy/sell and hobby hao", () => {
  for (const answer of ["kan shu", "kan3 shu1", "kan4 shu4", "kan6 shu1"]) {
    assert.equal(quiz.checkAnswer(card("read-books"), "pinyin", answer), false, answer);
  }
  assert.equal(quiz.checkAnswer(card("shopping"), "pinyin", "mai4 dong1 xi"), false);
  assert.equal(quiz.checkAnswer(card("hobby"), "pinyin", "ai4 hao3"), false);
  assert.equal(quiz.checkAnswer(card("music"), "pinyin", "ting1 yin1 le4"), false);
});

test("spelling mode ignores tones but still rejects a different word", () => {
  assert.ok(quiz.checkAnswer(card("read-books"), "pinyin", "kan shu", false));
  assert.ok(quiz.checkAnswer(card("read-books"), "pinyin", "kan3 shu4", false));
  assert.equal(quiz.checkAnswer(card("read-books"), "pinyin", "kan shuai", false), false);
  assert.notEqual(quiz.normalizePinyin("lǜ", false), quiz.normalizePinyin("lu", false));
});

test("English synonyms, infinitives, punctuation and contractions work", () => {
  for (const answer of ["watch films", "TO WATCH MOVIES!", "watching films"]) {
    assert.ok(quiz.checkAnswer(card("watch-films"), "english", answer), answer);
  }
  assert.ok(quiz.checkAnswer(card("dislike"), "english", "don’t like"));
  assert.ok(quiz.checkAnswer(card("dislike"), "english", "do not like"));
  assert.ok(quiz.checkAnswer(card("your-hobby"), "english", "What's your hobby?"));
  assert.ok(quiz.checkAnswer(card("be"), "english", "to be"));
  assert.ok(quiz.checkAnswer(card("not"), "english", "no"));
});

test("wrong answers, empty answers and the other skill cannot pass", () => {
  assert.equal(quiz.checkAnswer(card("like"), "english", "don't like"), false);
  assert.equal(quiz.checkAnswer(card("dislike"), "english", "like"), false);
  assert.equal(quiz.checkAnswer(card("watch-films"), "english", "watch TV"), false);
  for (const c of quiz.CARDS) {
    assert.equal(quiz.checkAnswer(c, "english", c.pinyin), false);
    assert.equal(quiz.checkAnswer(c, "pinyin", c.english), false);
    assert.equal(quiz.checkAnswer(c, "pinyin", ""), false);
    assert.equal(quiz.checkAnswer(c, "english", "!?"), false);
  }
});

test("review rounds track missed pinyin independently from English", () => {
  const stats = { "hobby::pinyin": { needsReview: true }, "hobby::english": { needsReview: false }, "today::english": { needsReview: true } };
  assert.equal(quiz.newRound("both", stats, true).length, 2);
  assert.deepEqual(quiz.newRound("pinyin", stats, true).map(q => q.key), ["hobby::pinyin"]);
  assert.deepEqual(quiz.newRound("english", {}, true), []);
});

test("next prompt avoids recently seen Hanzi when other words remain", () => {
  const queue = [
    { id: "hobby", key: "hobby::english" },
    { id: "today", key: "today::pinyin" },
    { id: "computer", key: "computer::pinyin" },
  ];
  assert.equal(quiz.takeNext(queue, ["hobby", "today"]).id, "computer");
  assert.equal(queue.length, 2);
  assert.equal(quiz.takeNext([], []), null);
});

test("a missed skill returns later once, without an infinite retry loop", () => {
  const q = { key: "hobby::pinyin", id: "hobby", skill: "pinyin", retry: false };
  const queue = quiz.newRound("english");
  quiz.scheduleRetry(queue, q);
  assert.equal(queue[3].key, q.key);
  assert.equal(queue[3].retry, true);
  quiz.scheduleRetry(queue, q);
  assert.equal(queue.filter(item => item.key === q.key).length, 1);
  const retry = queue.splice(3, 1)[0];
  quiz.scheduleRetry(queue, retry);
  assert.equal(queue.some(item => item.key === q.key), false);
  const empty = [];
  quiz.scheduleRetry(empty, q);
  assert.equal(empty[0].key, q.key);
});
