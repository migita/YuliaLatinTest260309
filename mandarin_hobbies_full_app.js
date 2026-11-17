"use strict";
// Original practice questions based on the three Jinbu 1 Chapter 3 revision sheets.
// No persistence, analytics, network calls, dependencies or source photographs.
const QUESTIONS = [];
function choice(category, prompt, answer, distractors, explanation) {
  QUESTIONS.push({ category, type: "choice", prompt, answer, options: [answer, ...distractors], explanation });
}
function typing(category, chinese, pinyin, answers) {
  QUESTIONS.push({ category, type: "typing", prompt: "Translate into English: " + chinese, answer: answers[0], answers,
    explanation: chinese + " (" + pinyin + ") = " + answers[0] + "." });
}
function build(prompt, tokens, answers, explanation) {
  QUESTIONS.push({ category: "Grammar", type: "build", prompt, tokens, answers, answer: answers[0], explanation });
}
[
  ["爱好", "ài hào", ["hobby", "hobbies", "interest", "interests"]],
  ["看书", "kàn shū", ["read books", "read a book", "reading", "reading books", "read"]],
  ["看电影", "kàn diàn yǐng", ["watch films", "watch movies", "watch a film", "watch a movie", "watching films", "watching movies"]],
  ["看电视", "kàn diàn shì", ["watch TV", "watch television", "watching TV", "watching television"]],
  ["上网", "shàng wǎng", ["surf the internet", "go online", "use the internet", "browse the internet", "surf the web", "surfing the internet"]],
  ["买东西", "mǎi dōng xi", ["go shopping", "buy things", "shopping", "buy stuff", "buying things"]],
  ["听音乐", "tīng yīn yuè", ["listen to music", "listening to music"]],
  ["玩儿滑板", "wánr huá bǎn", ["skateboard", "skateboarding", "ride a skateboard", "go skateboarding"]],
  ["玩儿电脑游戏", "wánr diàn nǎo yóu xì", ["play computer games", "play video games", "playing computer games", "playing video games"]],
].forEach(row => typing("Hobbies", ...row));
choice("Hobbies", "Choose the Chinese for ‘I like reading books’.", "我喜欢看书。", ["我不喜欢看书。", "我喜欢看电视。", "我喜欢听音乐。"], "喜欢 (xǐ huan) means ‘like’; 看书 means ‘read books’.");
choice("Hobbies", "What does 我不喜欢上网 mean?", "I don't like surfing the internet.", ["I like surfing the internet.", "I don't like shopping.", "I also surf the internet."], "不喜欢 (bù xǐ huan) means ‘do not like’.");
choice("Hobbies", "Choose the word meaning ‘love’.", "爱", ["也", "是", "不"], "爱 (ài) means ‘love’; 喜欢 means ‘like’.");
choice("Hobbies", "Complete ‘I also like music’: 我___喜欢音乐。", "也", ["不", "但是", "什么"], "也 (yě), ‘also’, goes before 喜欢 here.");
choice("Hobbies", "Which word joins two contrasting ideas (‘but’)?", "但是", ["你的", "今天", "也"], "但是 (dàn shì) means ‘but’.");
choice("Hobbies", "What does 你的爱好是什么？ ask?", "What is your hobby?", ["Who likes your hobby?", "What day is it today?", "Do you like my hobby?"], "你的 = your; 爱好 = hobby; 是什么 = is what.");
choice("Hobbies", "What does 你呢？ mean?", "How about you?", ["Who are you?", "What is this?", "What day is it?"], "你呢？ (nǐ ne?) asks ‘How about you?’");
choice("Hobbies", "Which describes music that is nice to listen to?", "好听", ["好看", "好玩儿", "不喜欢"], "好听 (hǎo tīng) = nice to listen to; 好看 = nice to look at; 好玩儿 = fun.");
choice("Hobbies", "What does 好玩儿 mean?", "Fun / enjoyable to play", ["Nice to listen to", "Nice to look at", "Unable to play"], "好玩儿 (hǎo wánr) describes something fun.");
choice("Hobbies", "Choose the meaning of 好看.", "Nice to look at", ["Nice to listen to", "Can play well", "Every day"], "好看 (hǎo kàn) means nice to look at / good-looking.");
[
  ["打网球", "dǎ wǎng qiú", ["play tennis", "playing tennis", "tennis"]],
  ["打篮球", "dǎ lán qiú", ["play basketball", "playing basketball", "basketball"]],
  ["打乒乓球", "dǎ pīng pāng qiú", ["play table tennis", "play ping pong", "table tennis", "ping pong", "playing table tennis"]],
  ["游泳", "yóu yǒng", ["swim", "swimming", "go swimming"]],
  ["跑步", "pǎo bù", ["run", "running", "go running", "jog", "jogging"]],
  ["踢足球", "tī zú qiú", ["play football", "play soccer", "playing football", "playing soccer", "football", "soccer"]],
].forEach(row => typing("Sports", ...row));
choice("Sports", "Complete ‘play football’: ___足球", "踢", ["打", "看", "听"], "踢 (tī) means ‘kick’. Use 踢足球 for playing football.");
choice("Sports", "Complete ‘play basketball’: ___篮球", "打", ["踢", "听", "买"], "打 (dǎ) is used with basketball, tennis and table tennis.");
choice("Sports", "What does 我会游泳 mean?", "I can swim.", ["I like swimming.", "I swim every day.", "I cannot swim."], "会 (huì) expresses a learned ability: ‘can / know how to’.");
choice("Sports", "What does 他很会打网球 mean?", "He is good at playing tennis.", ["He dislikes tennis.", "He plays tennis tomorrow.", "He cannot play tennis."], "很会 (hěn huì) means being good at doing something.");
choice("Sports", "What does 谁喜欢运动？ mean?", "Who likes sport?", ["What is your sport?", "Who cannot swim?", "When do you play?"], "谁 (shéi / shuí) = who; 运动 (yùn dòng) = sport / exercise.");
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const numbers = ["一", "二", "三", "四", "五", "六"];
days.forEach((day, i) => choice("Days", "Choose the Chinese for " + day + ".", "星期" + numbers[i],
  [1, 2, 3].map(offset => "星期" + numbers[(i + offset) % 6]), "星期 (xīng qī) + " + numbers[i] + " = " + day + "."));
choice("Days", "Which pair BOTH mean Sunday?", "星期天 / 星期日", ["星期六 / 星期天", "星期一 / 星期日", "星期五 / 星期六"], "Both 星期天 (xīng qī tiān) and 星期日 (xīng qī rì) mean Sunday.");
[
  ["昨天", "zuó tiān", ["yesterday"]], ["今天", "jīn tiān", ["today"]],
  ["明天", "míng tiān", ["tomorrow"]], ["天天", "tiān tiān", ["every day", "everyday", "daily", "each day"]],
].forEach(row => typing("Days", ...row));
build("Make this negative: 我喜欢看电视。", ["我", "不", "喜欢", "看电视"], ["我不喜欢看电视"], "Put 不 before 喜欢: I do not like watching TV.");
build("Make this negative: 他看书。", ["他", "不", "看书"], ["他不看书"], "不 goes before the verb: 他不看书 = He does not read books.");
build("Build: I play tennis on Monday.", ["我", "星期一", "打网球"], ["我星期一打网球", "星期一我打网球"], "The sheet's pattern is subject + time + action. Time can also come before the subject.");
build("Build: I swim every day.", ["我", "天天", "游泳"], ["我天天游泳", "天天我游泳"], "天天 = every day. Put time before the action, not after it.");
build("Build: I will play football tomorrow.", ["我", "明天", "踢足球"], ["我明天踢足球", "明天我踢足球"], "明天 tells us the action is tomorrow; the verb itself does not change.");
build("Build: I also like listening to music.", ["我", "也", "喜欢", "听音乐"], ["我也喜欢听音乐"], "也 comes before 喜欢: 我也喜欢听音乐。");
build("Build: I cannot swim (I do not know how).", ["我", "不", "会", "游泳"], ["我不会游泳"], "不会 (bú huì) = cannot / do not know how to. 不 goes before 会.");
build("Build: I like swimming, but I don't like running.", ["我", "喜欢", "游泳", "但是", "不", "喜欢", "跑步"], ["我喜欢游泳但是不喜欢跑步"], "但是 joins contrasting ideas. The subject 我 need not be repeated in the second clause.");
build("Build: What is your hobby?", ["你的", "爱好", "是", "什么"], ["你的爱好是什么"], "你的爱好是什么？ Literally: your hobby is what?");
choice("Grammar", "Choose ‘Today is not Monday’.", "今天不是星期一。", ["今天是不星期一。", "今天不星期一是。", "今天星期一不是。"], "To negate 是, use 不是 (bú shì). The negative comes before the verb.");

const BASE = typeof module !== 'undefined' && module.exports ? require('./mandarin_hobbies_core.js') : globalThis.MandarinHobbies;
const VOCAB = BASE.CARDS.map(c=>({...c,category:c.id==='today'?'Days':'Hobbies',source:'P1'}));
const extraRows=[["nice-listen","好听","hǎo tīng","nice to listen to","Hobbies","P2"],["nice-look","好看","hǎo kàn","nice to look at","Hobbies","P2",["good looking"]],["fun","好玩儿","hǎo wánr","fun","Hobbies","P2",["enjoyable","good to play with"],["hǎo wán er"]],["who","谁","shéi","who","Sports","P2",[],["shuí"]],["sport","运动","yùn dòng","sport","Sports","P2",["sports","exercise"]],["tennis-play","打网球","dǎ wǎng qiú","play tennis","Sports","P2"],["basketball-play","打篮球","dǎ lán qiú","play basketball","Sports","P2"],["table-tennis-play","打乒乓球","dǎ pīng pāng qiú","play table tennis","Sports","P2",["play ping pong"]],["swim","游泳","yóu yǒng","swim","Sports","P2",["swimming"]],["run","跑步","pǎo bù","run","Sports","P2",["running"]],["football-play","踢足球","tī zú qiú","play football","Sports","P2",["play soccer"]],["ball-games","打球","dǎ qiú","play ball games","Sports","P2",["play ball"]],["can","会","huì","can","Sports","P2",["know how to"]],["hit","打","dǎ","hit","Sports","P2",["play with your hands"]],["kick","踢","tī","kick","Sports","P2"],["ball","球","qiú","ball","Sports","P2"],["tennis","网球","wǎng qiú","tennis","Sports","P2"],["basketball","篮球","lán qiú","basketball","Sports","P2"],["table-tennis","乒乓球","pīng pāng qiú","table tennis","Sports","P2",["ping pong"]],["good-at","很会","hěn huì","good at doing something","Sports","P2",["be good at doing something","good at","very skilled"]],["week","星期","xīng qī","week","Days","P2"],["day-0","星期一","xīng qī yī","Monday","Days","P2"],["day-1","星期二","xīng qī èr","Tuesday","Days","P2"],["day-2","星期三","xīng qī sān","Wednesday","Days","P2"],["day-3","星期四","xīng qī sì","Thursday","Days","P3"],["day-4","星期五","xīng qī wǔ","Friday","Days","P3"],["day-5","星期六","xīng qī liù","Saturday","Days","P3"],["day-6","星期天","xīng qī tiān","Sunday","Days","P3"],["day-7","星期日","xīng qī rì","Sunday","Days","P3"],["yesterday","昨天","zuó tiān","yesterday","Days","P3"],["tomorrow","明天","míng tiān","tomorrow","Days","P3"],["daily","天天","tiān tiān","every day","Days","P3",["daily","each day","everyday"]]];
extraRows.forEach(([id,hanzi,pinyin,english,category,source,aliases=[],pinyinAliases=[]])=>VOCAB.push({id,hanzi,pinyin,english,category,source,englishAnswers:[english,...aliases],pinyinAnswers:[pinyin,...pinyinAliases]}));
VOCAB.forEach(c=>{ for(const skill of ['english','pinyin']) QUESTIONS.push({id:'v-'+c.id+'-'+skill,category:c.category,type:'typing',skill,card:c,prompt:(skill==='english'?'Give the English meaning: ':'Give the pinyin: ')+c.hanzi,answer:c[skill],answers:c[skill+'Answers'],explanation:c.hanzi+' ('+c.pinyin+') = '+c.english+'.'+(skill==='pinyin'?' Tone marks or numbers are accepted; tones are optional.':'')}); });
build('Make this negative: 我上网。',['我','不','上网'],['我不上网'],'不 goes before 上网: I do not surf the internet. This is the example in photo 3.');
choice('Grammar','When the subject changes from 我 to 他, what happens to 看书?','The verb stays the same.',['Add an English-style -s.','Move 不 after the verb.','Change 看书 to 是.'],'The sheet explicitly says the verb is the same whether I or he is the subject.');
build('Build the question: Who likes sport?',['谁','喜欢','运动'],['谁喜欢运动'],'谁 replaces the person being asked about; it stays in the subject position.');
choice('Days','Which Sunday form is labelled formal on the sheet?','星期日',['星期天','星期六','星期一'],'The sheet labels 星期日 formal and 星期天 informal. Both mean Sunday.');
choice('Grammar','Read: 我星期二看书。我也喜欢听音乐，但是我不喜欢跑步。 What do I do on Tuesday?','Read books',['Listen to music','Run','Play tennis'],'星期二 gives the time of 看书. The later sentences say what I like, not what I do on Tuesday.');
choice('Grammar','Read: 我星期二看书。我也喜欢听音乐，但是我不喜欢跑步。 Which activity do I dislike?','Running',['Reading books','Listening to music','Swimming'],'不喜欢跑步 means do not like running. 也 adds an idea; 但是 introduces a contrast.');
QUESTIONS.forEach((q,i)=>{if(!q.id)q.id='sentence-'+(i+1);});


function normalize(value) {
  return String(value).normalize("NFKC").toLowerCase().replace(/[’']/g, "").replace(/[.,!?;:。！？，；：-]/g, " ").trim().replace(/\s+/g, " ").replace(/^to /, "");
}
function isCorrect(q, answer) {
 if(q.card) return BASE.checkAnswer(q.card,q.skill,answer,false);
  const key = value => q.type === "build" ? normalize(value).replace(/\s/g, "") : normalize(value);
  return (q.answers || [q.answer]).some(expected => key(expected) === key(answer));
}
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
if (typeof module !== "undefined" && module.exports) module.exports = { QUESTIONS, VOCAB, normalize, isCorrect, shuffle };
if (typeof document !== "undefined") initQuiz();
function initQuiz() {
  const $ = id => document.getElementById(id);
  let original = [], round = [], index = 0, correct = 0, mistakes = [], locked = false, selected = [], tokenOrder = [], retry = false;
  const filtered = () => QUESTIONS.filter(q => $("topic").value === "all" || q.category === $("topic").value);
  const count = () => { $("questionCount").textContent = filtered().length + " questions · one mark each · no time limit"; };
  function start(items, isRetry = false) {
    round = shuffle(items); index = 0; correct = 0; mistakes = []; retry = isRetry;
    $("setup").hidden = true; $("results").hidden = true; $("quiz").hidden = false; render();
  }
  function render() {
    const q = round[index]; locked = false; selected = [];
    $("category").textContent = q.category;
    $("mode").textContent = {choice: "Multiple choice", typing: "English translation", build: "Sentence builder"}[q.type];
    $("progressText").textContent = (retry ? "Retry · " : "") + "Question " + (index + 1) + " of " + round.length + " · Score: " + correct;
    $("progress").max = round.length; $("progress").value = index;
    $("prompt").textContent = q.prompt;
    $("hint").textContent = q.type === "build" ? "Use every tile. Tap a chosen tile to remove it. No punctuation needed." : q.type === "typing" ? "Type the English meaning. Capital letters and punctuation do not matter." : "Tap one answer to check it.";
    $("choices").replaceChildren(); $("choices").hidden = q.type !== "choice";
    $("typing").hidden = q.type !== "typing"; $("building").hidden = q.type !== "build";
    $("answerInput").previousElementSibling.textContent=q.skill==='pinyin'?'Your answer in pinyin':'Your answer in English';
 if(q.skill==='pinyin'){ $('mode').textContent='Pinyin recall'; $('hint').textContent='Type pinyin with tone marks, numbers, or without tones. Spaces do not matter.'; }
 $("answerInput").value = ""; $("answerInput").disabled = false;
    $("checkBtn").hidden = q.type === "choice"; $("checkBtn").disabled = false; $("skipBtn").disabled = false; $("clearBtn").disabled = false;
    $("notice").textContent = ""; $("feedback").hidden = true; $("nextBtn").hidden = true;
    if (q.type === "choice") shuffle(q.options).forEach(option => {
      const b = button(option, "option-btn", () => submit(option)); $("choices").append(b);
    });
    if (q.type === "build") { tokenOrder = shuffle(q.tokens.map((text, id) => ({text, id}))); renderTokens(); }
    $("prompt").focus();
  }
  function button(label, className, handler) {
    const b = document.createElement("button"); b.type = "button"; b.className = className; b.textContent = label; b.addEventListener("click", handler); return b;
  }
  function renderTokens() {
    $("sentence").replaceChildren(); $("tokens").replaceChildren();
    selected.forEach(id => {
      const t = tokenOrder.find(token => token.id === id);
      const b = button(t.text, "ghost-btn", () => { if (!locked) { selected = selected.filter(value => value !== id); renderTokens(); } });
      b.lang = "zh-Hans"; b.setAttribute("aria-label", "Remove " + t.text); b.disabled = locked; $("sentence").append(b);
    });
    tokenOrder.forEach(t => {
      const b = button(t.text, "ghost-btn", () => { if (!locked && !selected.includes(t.id)) { selected.push(t.id); renderTokens(); } });
      b.lang = "zh-Hans"; b.disabled = locked || selected.includes(t.id); $("tokens").append(b);
    });
  }
  function submit(answer, skipped = false) {
    if (locked) return;
    const q = round[index];
    if (!skipped && (!normalize(answer) || (q.type === "build" && selected.length !== q.tokens.length))) {
      $("notice").textContent = q.type === "build" ? "Use all the tiles before checking." : "Type an answer, or choose Show answer / skip."; return;
    }
    locked = true; $("notice").textContent = "";
    const good = !skipped && isCorrect(q, answer);
    if (good) correct++; else mistakes.push({q, answer: skipped ? "Skipped" : answer});
    $("feedback").hidden = false; $("feedback").className = "feedback " + (good ? "good" : "bad");
    $("feedbackTitle").textContent = good ? "Correct!" : skipped ? "Answer revealed — 0 marks" : "Not quite — let's review";
    $("feedbackAnswer").textContent = "Answer: " + q.answer;
    $("explanation").textContent = q.explanation;
    $("answerInput").disabled = true; $("checkBtn").disabled = true; $("skipBtn").disabled = true; $("clearBtn").disabled = true;
    $("choices").querySelectorAll("button").forEach(b => { b.disabled = true; if (isCorrect(q, b.textContent)) b.classList.add("correct"); else if (b.textContent === answer) b.classList.add("wrong"); });
    if (q.type === "build") renderTokens();
    $("progress").value = index + 1;
    $("nextBtn").hidden = false; $("nextBtn").textContent = index + 1 === round.length ? "See results" : "Next question"; $("nextBtn").focus();
  }
  function finish() {
    $("quiz").hidden = true; $("results").hidden = false;
    $("resultTitle").textContent = retry ? "Retry round complete" : "Test complete";
    $("score").textContent = correct + " / " + round.length + " · " + Math.round(correct / round.length * 100) + "%";
    $("resultMessage").textContent = mistakes.length ? "Good practice! Review the explanations, then try just the questions you missed. Each retry has its own score." : "Excellent — every answer in this round was correct!";
    $("retryBtn").hidden = mistakes.length === 0; $("reviewHeading").hidden = mistakes.length === 0; $("review").replaceChildren();
    mistakes.forEach(({q, answer}) => {
      const li = document.createElement("li"); li.className = "review-item";
      const title = document.createElement("strong"); title.textContent = q.prompt;
      const detail = document.createElement("div"); detail.textContent = "Your answer: " + answer + " · Answer: " + q.answer + ". " + q.explanation;
      li.append(title, detail); $("review").append(li);
    });
    $("resultTitle").focus();
  }
  $("topic").addEventListener("change", count);
  $("startBtn").addEventListener("click", () => { original = filtered(); start(original); });
  $("answerForm").addEventListener("submit", event => {
    event.preventDefault(); const q = round[index];
    if (q.type !== "choice") submit(q.type === "typing" ? $("answerInput").value : selected.map(id => q.tokens[id]).join(""));
  });
  $("clearBtn").addEventListener("click", () => { if (!locked) { selected = []; renderTokens(); } });
  $("skipBtn").addEventListener("click", () => submit("", true));
  $("nextBtn").addEventListener("click", () => { if (!locked) return; index++; if (index === round.length) finish(); else render(); });
  $("retryBtn").addEventListener("click", () => { if (mistakes.length) start(mistakes.map(m => m.q), true); });
  $("restartBtn").addEventListener("click", () => start(original));
  $("setupBtn").addEventListener("click", () => { $("results").hidden = true; $("setup").hidden = false; $("topic").focus(); });
  count();
}
