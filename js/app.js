function showHome() {
  stopTimer();
  const cards = courseData.map(course => {
    const count = questions.filter(q => q.course === course.name).length;
    return `<button class="course-card" data-course="${course.name}"><span class="course-icon">${course.icon}</span><div><h2>${course.name}</h2><p>${course.description}</p></div><footer><span>${course.topics.length} ta mavzu</span><span>${count || '20+'} ta savol</span></footer><i>→</i></button>`;
  }).join('');
  app.innerHTML = `<section class="home page-enter"><header class="simple-header"><a class="brand" href="#">Bilim<span>Sinov</span></a>${themeButton()}</header><div class="home-intro"><p class="eyebrow">ONLAYN TA’LIM PLATFORMASI</p><h1>Bilimingizni sinang,<br><em>mahoratingizni oshiring.</em></h1><p>Yo‘nalishni tanlang va o‘zingizga qulay mavzu bo‘yicha testni boshlang.</p></div><div class="course-grid">${cards}</div></section>`;
  document.querySelectorAll('[data-course]').forEach(button => button.onclick = () => showTopics(button.dataset.course));
  bindTheme();
}

function showTopics(courseName) {
  const course = courseData.find(item => item.name === courseName);
  const topicCards = course.topics.map((topic, i) => {
    const count = questions.filter(q => q.course === courseName && q.topic === topic).length;
    const available = count > 0;
    return `<button class="topic-card ${available ? '' : 'locked'}" data-topic="${topic}" ${available ? '' : 'disabled'}><span class="topic-number">${String(i + 1).padStart(2, '0')}</span><div><h2>${topic}</h2><p>${available ? `${count} ta savol` : 'Tez kunda qo‘shiladi'}</p></div><span class="difficulty">${i % 3 === 0 ? 'Boshlang‘ich' : i % 3 === 1 ? 'O‘rta' : 'Yuqori'}</span><i>${available ? '→' : '🔒'}</i></button>`;
  }).join('');
  app.innerHTML = `<section class="topics page-enter"><header class="simple-header"><button class="back-btn" id="homeBack">← Bosh sahifa</button><a class="brand" href="#">Bilim<span>Sinov</span></a>${themeButton()}</header><div class="topic-heading"><span class="course-badge">${course.icon} ${course.name}</span><h1>Qaysi mavzuni tanlaysiz?</h1><p>Mavzuni tanlang. Test keyingi sahifada boshlanadi.</p></div><div class="topic-grid">${topicCards}</div></section>`;
  document.querySelector('#homeBack').onclick = showHome;
  document.querySelectorAll('[data-topic]').forEach(button => button.onclick = () => beginTest(courseName, button.dataset.topic));
  bindTheme();
}

function beginTest(course, topic) {
  const source = questions.filter(q => q.course === course && q.topic === topic);
  const session = { course, topic, questions: shuffle(source).map(q => ({ ...q, options: shuffle(q.options), answerText: q.options[q.answer] })), answers: [], current: 0, duration: Math.max(source.length * 75, 300), secondsLeft: Math.max(source.length * 75, 300) };
  session.questions.forEach(q => q.answer = q.options.indexOf(q.answerText));
  store.set(session); renderTest(session);
}

function renderTest(session) {
  const q = session.questions[session.current];
  const progress = (session.current + 1) / session.questions.length * 100;
  const nav = session.questions.map((_, i) => `<button class="nav-dot ${i === session.current ? 'current' : ''} ${session.answers[i] !== undefined ? 'answered' : ''}" data-index="${i}">${i + 1}</button>`).join('');
  const choices = q.options.map((option, i) => `<button class="answer-option ${session.answers[session.current] === i ? 'selected' : ''}" data-answer="${i}"><b>${i + 1}</b><span>${esc(option)}</span></button>`).join('');
  app.innerHTML = `<section class="test-page"><header class="test-header"><div><a class="brand" href="#">Bilim<span>Sinov</span></a><span class="crumb">${session.course} / ${session.topic}</span></div><div class="test-meta"><span id="timer">⏱ ${formatTime(session.secondsLeft)}</span>${themeButton()}</div><div class="progress-track"><i style="width:${progress}%"></i></div></header><div class="test-layout"><aside class="navigator"><h3>Savollar</h3><div class="nav-grid">${nav}</div><p><i></i> Javob berilgan</p></aside><article class="question-panel page-enter"><div class="question-top"><span>${session.current + 1}-savol / ${session.questions.length}</span><span>${q.difficulty}</span></div><h1>${esc(q.question)}</h1>${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ''}<div class="answers">${choices}</div><div class="test-actions"><button class="secondary-btn" id="prev" ${session.current === 0 ? 'disabled' : ''}>← Oldingi</button>${session.current === session.questions.length - 1 ? '<button class="primary-btn" id="finish">Testni yakunlash</button>' : '<button class="primary-btn" id="next">Keyingi →</button>'}</div><p class="key-help">Tezkor tanlash: <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd></p></article></div></section>`;
  const update = () => { store.set(session); renderTest(session); };
  document.querySelectorAll('[data-answer]').forEach(el => el.onclick = () => { session.answers[session.current] = Number(el.dataset.answer); update(); });
  document.querySelectorAll('[data-index]').forEach(el => el.onclick = () => { session.current = Number(el.dataset.index); update(); });
  document.querySelector('#prev').onclick = () => { session.current--; update(); };
  document.querySelector('#next')?.addEventListener('click', () => { session.current++; update(); });
  document.querySelector('#finish')?.addEventListener('click', () => showResults(session));
  document.onkeydown = event => { if (/^[1-4]$/.test(event.key)) document.querySelector(`[data-answer="${Number(event.key) - 1}"]`)?.click(); };
  bindTheme();
  startTimer(session, value => { const el = document.querySelector('#timer'); if (el) el.textContent = `⏱ ${formatTime(value)}`; }, () => showResults(session));
}

setupTheme();
const previous = store.get();
if (previous?.questions?.length && confirm('Sizda yakunlanmagan test bor. Davom ettirasizmi?')) renderTest(previous); else { store.clear(); showHome(); }
