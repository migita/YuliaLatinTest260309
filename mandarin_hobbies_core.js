/* Jinbu 1, Chapter 3: all 25 rows of the supplied Hobbies vocabulary sheet. */
(function (root) {
  "use strict";

  const word = (id, hanzi, pinyin, english, englishAnswers = [], pinyinAnswers = []) => ({
    id, hanzi, pinyin, english,
    englishAnswers: [english, ...englishAnswers],
    pinyinAnswers: [pinyin, ...pinyinAnswers],
  });

  const CARDS = [
    word("hobby", "爱好", "ài hào", "hobby", ["hobbies", "interest", "interests"]),
    word("read-books", "看书", "kàn shū", "read books", ["read", "reading", "reading books", "read a book"]),
    word("watch-films", "看电影", "kàn diàn yǐng", "watch films", ["watch movies", "watch a film", "watch a movie", "watching films", "watching movies"]),
    word("watch-tv", "看电视", "kàn diàn shì", "watch TV", ["watch television", "watching TV", "watching television"]),
    word("internet", "上网", "shàng wǎng", "surf the internet", ["go online", "use the internet", "browse the internet", "surf the web", "browsing the internet", "surfing the internet"]),
    word("shopping", "买东西", "mǎi dōng xi", "go shopping", ["shop", "shopping", "buy things", "buy stuff"]),
    word("music", "听音乐", "tīng yīn yuè", "listen to music", ["listening to music"]),
    word("skateboarding", "玩儿滑板", "wánr huá bǎn", "skateboard", ["skateboarding", "go skateboarding", "ride a skateboard"], ["wán er huá bǎn"]),
    word("computer-games", "玩儿电脑游戏", "wánr diàn nǎo yóu xì", "play computer games", ["play video games", "play computer game", "playing computer games", "playing video games"], ["wán er diàn nǎo yóu xì"]),
    word("play", "玩儿", "wánr", "play", ["playing"], ["wán er"]),
    word("skateboard", "滑板", "huá bǎn", "skateboard", ["a skateboard"]),
    word("computer", "电脑", "diàn nǎo", "computer", ["a computer"]),
    word("game", "游戏", "yóu xì", "game", ["a game", "games"]),
    word("today", "今天", "jīn tiān", "today"),
    // The sheet marks huān; also accept the usual neutral-tone pronunciation huan.
    word("like", "喜欢", "xǐ huān", "like", ["likes", "liking"], ["xǐ huan"]),
    word("dislike", "不喜欢", "bù xǐ huān", "don't like", ["do not like", "dislike", "doesn't like", "does not like", "not like"], ["bù xǐ huan"]),
    word("love", "爱", "ài", "love", ["loving"]),
    word("also", "也", "yě", "also", ["too", "as well"]),
    word("your", "你的", "nǐ de", "your", ["yours"]),
    word("not", "不", "bù", "not / no", ["not", "no", "not no"]),
    word("be", "是", "shì", "be (am, is, are)", ["be", "am", "is", "are", "am is are"]),
    word("what", "什么", "shénme", "what"),
    word("how-about-you", "你呢？", "nǐ ne", "How about you?", ["what about you", "and you"]),
    word("your-hobby", "你的爱好是什么？", "nǐ de ài hào shì shénme", "What is your hobby?", ["what's your hobby", "what are your hobbies", "what are your interests"]),
    word("but", "但是", "dàn shì", "but", ["however"]),
  ];

  const TONES = { a: "āáǎà", e: "ēéěè", i: "īíǐì", o: "ōóǒò", u: "ūúǔù", "ü": "ǖǘǚǜ" };

  function markTone(syllable, tone) {
    if (tone === 0 || tone === 5) return syllable;
    let i = syllable.indexOf("a");
    if (i < 0) i = syllable.indexOf("e");
    if (i < 0 && syllable.includes("ou")) i = syllable.indexOf("o");
    if (i < 0) {
      for (let j = syllable.length - 1; j >= 0; j--) {
        if (TONES[syllable[j]]) { i = j; break; }
      }
    }
    if (i < 0) return syllable + tone;
    return syllable.slice(0, i) + TONES[syllable[i]][tone - 1] + syllable.slice(i + 1);
  }

  function normalizePinyin(value, checkTones = true) {
    let result = String(value).normalize("NFC").toLowerCase()
      .replace(/u:/g, "ü").replace(/v/g, "ü")
      .replace(/([a-zü]+)([0-5])/g, (_, syllable, tone) => markTone(syllable, Number(tone)))
      .replace(/[\s'’‘.,!?？！，。\-]/g, "");
    if (!checkTones) {
      // Strip tone marks only: preserve the umlaut in ü.
      result = result.normalize("NFD").replace(/[\u0300\u0301\u0304\u030c]/g, "").normalize("NFC");
    }
    return result;
  }

  function normalizeEnglish(value) {
    return String(value).normalize("NFKC").toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/\bdon'?t\b/g, "do not")
      .replace(/\bdoesn'?t\b/g, "does not")
      .replace(/\bwhat'?s\b/g, "what is")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ").trim().replace(/^to /, "");
  }

  function checkAnswer(card, skill, answer, checkTones = true) {
    const normalize = skill === "pinyin" ? value => normalizePinyin(value, checkTones) : normalizeEnglish;
    const value = normalize(answer);
    return Boolean(value) && card[skill + "Answers"].some(expected => normalize(expected) === value);
  }

  function questions(mode = "both") {
    const skills = mode === "both" ? ["pinyin", "english"] : [mode];
    return CARDS.flatMap(card => skills.map(skill => ({ key: card.id + "::" + skill, id: card.id, skill })));
  }

  function newRound(mode, stats = {}, reviewOnly = false, random = Math.random) {
    return questions(mode)
      .filter(q => !reviewOnly || stats[q.key]?.needsReview)
      .map(q => ({ ...q, priority: random() + (stats[q.key]?.needsReview ? 1 : 0), retry: false }))
      .sort((a, b) => b.priority - a.priority)
      .map(({ priority, ...q }) => q);
  }

  function takeNext(queue, recentIds = []) {
    // Avoid showing the same Hanzi in its other skill immediately after feedback.
    let i = queue.findIndex(q => !recentIds.slice(-3).includes(q.id));
    if (i < 0) i = queue.findIndex(q => q.id !== recentIds.at(-1));
    return queue.splice(i < 0 ? 0 : i, 1)[0] || null;
  }

  function scheduleRetry(queue, question) {
    // One retry per question in a round; any remaining misses can be revised afterwards.
    if (question.retry || queue.some(q => q.key === question.key)) return;
    queue.splice(Math.min(queue.length, 3), 0, { ...question, retry: true });
  }

  const api = { CARDS, normalizePinyin, normalizeEnglish, checkAnswer, questions, newRound, takeNext, scheduleRetry };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.MandarinHobbies = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
