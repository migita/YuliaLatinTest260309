const assert=require('node:assert/strict');
const {QUESTIONS:Q,VOCAB:V,isCorrect}=require('./mandarin_hobbies_full_app');
assert.equal(V.length,57);assert.equal(Q.length,171);assert.equal(new Set(Q.map(q=>q.id)).size,Q.length);
const sourceRows=[['爱好','看书','看电影','看电视','上网','买东西','听音乐','玩儿滑板','玩儿电脑游戏','玩儿','滑板','电脑','游戏','今天','喜欢','不喜欢','爱','也','你的','不','是','什么','你呢？','你的爱好是什么？','但是'],['好听','好看','好玩儿','谁','运动','打网球','打篮球','打乒乓球','游泳','跑步','踢足球','打球','会','打','踢','球','网球','篮球','乒乓球','很会','星期','星期一','星期二','星期三'],['星期四','星期五','星期六','星期天','星期日','昨天','今天','明天','是','天天']];
for(const page of sourceRows) for(const hanzi of page){const c=V.find(c=>c.hanzi===hanzi);assert.ok(c,hanzi);for(const skill of ['english','pinyin'])assert.ok(Q.find(q=>q.card===c&&q.skill===skill));}
for(const q of Q){assert.ok(q.explanation);for(const a of q.answers||[q.answer])assert.ok(isCorrect(q,a),q.id+' '+a);assert.ok(!isCorrect(q,''));assert.ok(!isCorrect(q,'wrong nonsense'));if(q.options){assert.equal(new Set(q.options).size,q.options.length);for(const a of q.options.filter(a=>a!==q.answer))assert.ok(!isCorrect(q,a));}if(q.tokens)assert.ok(isCorrect(q,q.tokens.join('')));if(q.skill==='pinyin')assert.ok(isCorrect(q,q.answer.normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase()));}
console.log('PASS all 59 photographed rows (57 distinct), 171 validators, aliases, distractors, builders and pinyin');
