const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

// ======== ТАНЗИМОТ ========
const ADMIN_USERNAME = "YOUR_ADMIN_USERNAME"; // барои пардохти VIP (бе @)
const PLANS = [
  { id: "m1",  name: "1 моҳ",  price: "29 сомонӣ",  note: "" },
  { id: "m6",  name: "6 моҳ",  price: "129 сомонӣ", note: "Фоидаовар · 25% тахфиф", best: true },
  { id: "m12", name: "12 моҳ", price: "219 сомонӣ", note: "Тамоми сол" },
];

// ======== МАЪЛУМОТ ========
// калима: [иероглиф, пиньин, тарҷумаи тоҷикӣ, талаффуз бо ҳарфҳои тоҷикӣ]
const LESSONS = [
  { id: 1, hsk: 1, title: "Салом ва шиносоӣ", vip: false, words: [
    ["你好","nǐ hǎo","салом","ни хао"],["谢谢","xièxie","ташаккур","сйе-сйе"],
    ["再见","zàijiàn","то дидор","дзай-ҷйен"],["我","wǒ","ман","во"],
    ["你","nǐ","ту","ни"],["他","tā","ӯ (мард)","та"]]},
  { id: 2, hsk: 1, title: "Одамон ва ҷой", vip: false, words: [
    ["老师","lǎoshī","муаллим","лао-шы"],["学生","xuésheng","хонанда","сйуе-шэн"],
    ["朋友","péngyou","дӯст","пэн-йоу"],["家","jiā","хона, оила","ҷйа"],
    ["学校","xuéxiào","мактаб","сйуе-сйао"]]},
  { id: 3, hsk: 1, title: "Хӯрок ва сифатҳо", vip: false, words: [
    ["水","shuǐ","об","шуэй"],["茶","chá","чой","ча"],["米饭","mǐfàn","биринҷ","ми-фан"],
    ["爱","ài","дӯст доштан","ай"],["大","dà","калон","да"],["小","xiǎo","хурд","сйао"],["好","hǎo","хуб","хао"]]},
  { id: 4, hsk: 2, title: "Рӯзгори ҳаррӯза", vip: false, words: [
    ["咖啡","kāfēi","қаҳва","ка-фэй"],["药","yào","дору","йао"],["便宜","piányi","арзон","пйен-йи"],
    ["贵","guì","гарон","гуэй"],["非常","fēicháng","хеле","фэй-чан"]]},
  { id: 5, hsk: 2, title: "Феълҳои муҳим", vip: true, words: [
    ["到","dào","расидан","дао"],["说","shuō","гуфтан","шуо"],["找","zhǎo","ҷустан","жао"],
    ["觉得","juéde","фикр кардан","ҷюэ-дэ"],["告诉","gàosu","хабар додан","гао-су"]]},
  { id: 6, hsk: 3, title: "Ҷаҳон ва ҷомеа", vip: true, words: [
    ["世界","shìjiè","ҷаҳон","шы-ҷйе"],["国家","guójiā","кишвар","гуо-ҷйа"],["历史","lìshǐ","таърих","ли-шы"],
    ["会议","huìyì","маҷлис","хуэй-йи"],["附近","fùjìn","наздик","фу-ҷин"]]},
  { id: 7, hsk: 3, title: "Ҳиссиёт ва қарор", vip: true, words: [
    ["担心","dānxīn","ташвиш кашидан","дан-сйин"],["同意","tóngyì","розӣ шудан","тун-йи"],
    ["注意","zhùyì","диққат додан","жу-йи"],["经常","jīngcháng","аксар вақт","ҷин-чан"],["一定","yídìng","ҳатман","йи-динг"]]},
];
const INITIALS = [["b","八","bā"],["p","爬","pá"],["m","妈","mā"],["f","发","fā"],["d","大","dà"],["t","他","tā"],
  ["n","你","nǐ"],["l","来","lái"],["g","个","gè"],["k","看","kàn"],["h","好","hǎo"],["j","家","jiā"],["q","去","qù"],
  ["x","小","xiǎo"],["zh","中","zhōng"],["ch","吃","chī"],["sh","水","shuǐ"],["r","人","rén"],["z","在","zài"],
  ["c","菜","cài"],["s","三","sān"]];
const TONES = [["mā","妈","Тони 1 — баланд ва ҳамвор"],["má","麻","Тони 2 — аз миёна ба боло, мисли саволи «Чӣ?»"],
  ["mǎ","马","Тони 3 — паст мешавад, баъд боло меравад"],["mà","骂","Тони 4 — якбора аз боло ба поин"],
  ["ma","吗","Тони сабук — кӯтоҳ ва бесадо"]];

// ======== ҲОЛАТ ========
let S = { tab: "home", vip: false, done: {}, best: 0 };
try { Object.assign(S, JSON.parse(localStorage.getItem("hsk-tj") || "{}")); } catch (e) {}
// ЭЪТИБОР: дар истеҳсолот статуси VIP-ро аз сервер санҷед, на аз localStorage!
const save = () => { try { localStorage.setItem("hsk-tj", JSON.stringify(S)); } catch (e) {} };
const $ = s => document.querySelector(s), view = $("#view");
const user = tg?.initDataUnsafe?.user;
const unlocked = () => LESSONS.filter(l => !l.vip || S.vip);
const allWords = () => LESSONS.flatMap(l => l.words.map(w => ({ w, l })));
const speak = t => { try { const u = new SpeechSynthesisUtterance(t); u.lang = "zh-CN"; u.rate = .8;
  speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} };
window.speak = speak;
const go = (tab, extra = {}) => { Object.assign(S, { tab }, extra); render(); window.scrollTo(0, 0); };
window.go = go;

// ======== САҲИФАҲО ========
function home() {
  const done = Object.keys(S.done).length, pct = Math.round(done / LESSONS.length * 100);
  return `<section class="hero"><div class="big hz">学</div>
    <p style="opacity:.85">Салом${user ? ", " + user.first_name : ""}! 👋</p>
    <h1 style="margin:2px 0 0">Хитоӣ омӯзед — қадам ба қадам</h1>
    <div class="bar"><b style="width:${pct}%"></b></div>
    <p style="font-size:13px;margin-top:6px;opacity:.9">${done} аз ${LESSONS.length} дарс омӯхта шуд</p></section>
    <h2>Бахшҳо</h2><div class="grid">
    <button class="tile" onclick="go('lessons')"><i>📖</i>Дарсҳои HSK<small>HSK 1 · 2 · 3</small></button>
    <button class="tile" onclick="go('pinyin')"><i>🔤</i>Роҳнамои пиньин<small>Овозҳо ва тонҳо</small></button>
    <button class="tile" onclick="go('test')"><i>✅</i>Тестҳои интерактивӣ<small>Рекорд: ${S.best}/5</small></button>
    <button class="tile" onclick="go('vocab')"><i>🗂️</i>Луғат<small>${allWords().length} калима</small></button></div>
    <button class="vip-banner" onclick="go('vip')">💎 Дарсҳои VIP — HSK 2 ва HSK 3-и пурра
    <small>Обунаро интихоб кунед</small></button>`;
}
function lessons() {
  return `<h1>Дарсҳои HSK</h1><p class="sub">Барои талаффуз тугмаи 🔊-ро пахш кунед.</p><br>` +
    LESSONS.map(l => `<button class="lesson" onclick="openLesson(${l.id})">
      <div class="cover c${l.hsk} hz">${l.words[0][0][0]}</div>
      <div><b>${l.title}</b><small>HSK ${l.hsk} · ${l.words.length} калима</small></div>
      <span class="tag ${l.vip && !S.vip ? "vip" : S.done[l.id] ? "ok" : ""}">${l.vip && !S.vip ? "💎 VIP" : S.done[l.id] ? "✓" : "Ройгон"}</span></button>`).join("");
}
window.openLesson = id => {
  const l = LESSONS.find(x => x.id === id);
  if (l.vip && !S.vip) return go("vip");
  go("lesson", { cur: id });
};
function lesson() {
  const l = LESSONS.find(x => x.id === S.cur);
  return `<button class="back" onclick="go('lessons')">← Дарсҳо</button>
    <h1>${l.title}</h1><p class="sub">HSK ${l.hsk} · Дарси ${l.id}</p><br>` +
    l.words.map(w => `<div class="word"><div class="hz">${w[0]}</div>
      <div><div class="py">${w[1]}</div><div>${w[2]}</div><div class="say">Талаффуз: ${w[3]}</div></div>
      <button class="spk" aria-label="Шунидан" onclick="speak('${w[0]}')">🔊</button></div>`).join("") +
    `<button class="btn" onclick="S.done[${l.id}]=true;save();go('lessons')">Омӯхтам ✓</button>`;
}
function pinyin() {
  return `<h1>Роҳнамои пиньин</h1><p class="sub">Пиньин — ҳарфҳои лотинӣ барои навиштани талаффузи хитоӣ.</p>
    <h2>Ҳамсадоҳои оғозӣ (声母)</h2><div class="chips">` +
    INITIALS.map(i => `<button class="chip" onclick="speak('${i[1]}')"><b>${i[0]}</b><small>${i[1]} ${i[2]}</small></button>`).join("") +
    `</div><h2>Чор тон ва тони сабук</h2>` +
    TONES.map(t => `<div class="tone"><div class="hz">${t[1]}</div><div><b>${t[0]}</b><div class="sub">${t[2]}</div></div>
      <button class="spk" aria-label="Шунидан" onclick="speak('${t[1]}')">🔊</button></div>`).join("") +
    `<p class="sub" style="margin-top:10px">Маслиҳат: тонро бо дасти худ «кашед» ва якчанд бор такрор кунед.</p>`;
}
function vocab() {
  const q = (S.q || "").toLowerCase(), ok = new Set(unlocked().map(l => l.id));
  const rows = allWords().filter(({ w, l }) => ok.has(l.id) && (w.join(" ").toLowerCase().includes(q)));
  return `<h1>Луғат</h1><input class="search" placeholder="Ҷустуҷӯ: иероглиф, пиньин ё тоҷикӣ…" value="${S.q || ""}"
    oninput="S.q=this.value;renderKeep(this)">` + (rows.map(({ w, l }) => `<div class="word"><div class="hz">${w[0]}</div>
    <div><div class="py">${w[1]}</div><div>${w[2]}</div><div class="say">HSK ${l.hsk} · ${w[3]}</div></div>
    <button class="spk" aria-label="Шунидан" onclick="speak('${w[0]}')">🔊</button></div>`).join("") ||
    `<p class="sub">Чизе ёфт нашуд. Калимаи дигар ҷустуҷӯ кунед.</p>`);
}
window.renderKeep = el => { const p = el.selectionStart; render(); const n = $(".search"); n.focus(); n.setSelectionRange(p, p); };

// Тест
let quiz = null;
const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
window.startQuiz = () => {
  const pool = unlocked().flatMap(l => l.words), qs = shuffle(pool).slice(0, 5);
  quiz = { i: 0, score: 0, ans: null, qs: qs.map(w => ({ w, opts: shuffle([w, ...shuffle(pool.filter(x => x !== w)).slice(0, 3)]) })) };
  render();
};
window.answer = k => {
  const q = quiz.qs[quiz.i]; if (quiz.ans !== null) return;
  quiz.ans = k; if (q.opts[k] === q.w) quiz.score++; render();
  setTimeout(() => { quiz.i++; quiz.ans = null;
    if (quiz.i >= quiz.qs.length) { S.best = Math.max(S.best, quiz.score); save(); }
    render(); }, 900);
};
function test() {
  if (!quiz) return `<h1>Тестҳои интерактивӣ</h1><p class="sub">5 савол аз калимаҳои дарсҳои кушодашуда.</p>
    <br><button class="btn" onclick="startQuiz()">Оғози тест</button>`;
  if (quiz.i >= quiz.qs.length) { const s = quiz.score;
    return `<h1>Натиҷа: ${s} аз ${quiz.qs.length}</h1><p class="sub">${s >= 4 ? "Офарин! 🎉" : "Боз такрор кунед — шумо метавонед!"}</p><br>
    <button class="btn" onclick="startQuiz()">Тести нав</button><button class="btn alt" onclick="quiz=null;render()">Баромадан</button>`; }
  const q = quiz.qs[quiz.i];
  return `<p class="sub" style="margin-top:20px">Савол ${quiz.i + 1} / ${quiz.qs.length}</p>
    <div class="q hz">${q.w[0]}</div><p class="sub" style="text-align:center">${q.w[1]} · Маънояш чист?</p>` +
    q.opts.map((o, k) => { let c = ""; if (quiz.ans !== null) c = o === q.w ? "good" : k === quiz.ans ? "bad" : "";
      return `<button class="opt ${c}" onclick="answer(${k})">${o[2]}</button>`; }).join("");
}
function vip() {
  return `<button class="back" onclick="go('home')">← Бозгашт</button><h1>💎 Бахши VIP</h1>
    <p class="sub">Тамоми дарсҳои HSK 2 ва HSK 3, луғати васеъ ва тестҳои иловагӣ.</p><br>` +
    PLANS.map(p => `<div class="plan ${p.best ? "best" : ""}"><b>${p.name}</b><div class="price">${p.price}</div>
      ${p.note ? `<div class="sub">${p.note}</div>` : ""}
      <ul><li>Ҳамаи дарсҳои VIP</li><li>Луғати пурра бо талаффуз</li><li>Тестҳои бемаҳдуд</li></ul>
      <button class="btn" onclick="buy('${p.id}')">Харидан</button></div>`).join("") +
    `<p class="sub">Пас аз пардохт, админ VIP-ро барои акаунти шумо фаъол мекунад.</p>`;
}
window.buy = id => {
  const p = PLANS.find(x => x.id === id);
  const text = encodeURIComponent(`Салом! Мехоҳам VIP-и ${p.name} (${p.price}) харам. ID: ${user?.id || "-"}`);
  const url = `https://t.me/${ADMIN_USERNAME}?text=${text}`;
  tg ? tg.openTelegramLink(url) : window.open(url, "_blank");
};
function profile() {
  const name = user ? [user.first_name, user.last_name].filter(Boolean).join(" ") : "Меҳмон";
  return `<h1>Профил</h1><div class="word"><div class="hz" style="min-width:auto">👤</div>
    <div><b>${name}</b><div class="sub">${user?.username ? "@" + user.username : "ID: " + (user?.id || "—")}</div></div>
    <span class="tag ${S.vip ? "vip" : ""}">${S.vip ? "💎 VIP" : "Ройгон"}</span></div>
    <div class="grid"><div class="tile"><b>${Object.keys(S.done).length}</b><small>Дарсҳои хондашуда</small></div>
    <div class="tile"><b>${S.best}/5</b><small>Беҳтарин натиҷа</small></div></div>
    ${S.vip ? "" : `<button class="vip-banner" onclick="go('vip')">💎 VIP-ро фаъол кунед<small>Тамоми дарсҳоро кушоед</small></button>`}`;
}

const PAGES = { home, lessons, lesson, pinyin, vocab, test, vip, profile };
function render() {
  view.innerHTML = PAGES[S.tab]();
  const nav = { lesson: "lessons", vip: "profile" }[S.tab] || S.tab;
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.tab === nav));
}
document.querySelectorAll("nav button").forEach(b => b.onclick = () => go(b.dataset.tab));
render();
