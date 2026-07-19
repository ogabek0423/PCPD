function showResults(session) {
  stopTimer();
  const incorrect = session.questions.map((question, index) => ({ question, selected: session.answers[index], index })).filter(item => item.selected !== item.question.answer);
  const correct = session.questions.length - incorrect.length;
  const total = session.questions.length;
  const percent = total ? Math.round(correct / total * 100) : 0;
  const used = session.duration - session.secondsLeft;
  const review = incorrect.length ? `<section class="answer-review"><h2>Xatolar tahlili</h2><p>Quyidagi savollarda javobingiz noto‘g‘ri bo‘lgan. To‘g‘ri variant yashil rangda ko‘rsatilgan.</p>${incorrect.map(({ question, selected, index }) => {
    const selectedText = selected === undefined ? 'Javob berilmagan' : question.options[selected];
    return `<article class="review-item"><div class="review-title"><span>${index + 1}-savol</span><strong>✕ Xato</strong></div><h3>${esc(question.question)}</h3><div class="review-answer wrong"><small>Sizning javobingiz</small><span>${esc(selectedText)}</span></div><div class="review-answer right"><small>To‘g‘ri javob</small><span>${esc(question.options[question.answer])}</span></div></article>`;
  }).join('')}</section>` : `<section class="answer-review all-correct"><h2>Hammasi to‘g‘ri!</h2><p>Siz barcha savollarga to‘g‘ri javob berdingiz.</p></section>`;
  store.clear();
  app.innerHTML = `<section class="result-page page-enter"><header class="simple-header"><a class="brand" href="#">Bilim<span>Sinov</span></a>${themeButton()}</header><div class="result-card"><div class="celebrate">${percent >= 70 ? '🎉' : '💪'}</div><p class="eyebrow">TEST YAKUNLANDI</p><h1>${esc(session.topic)}</h1><div class="score-ring" style="--score:${percent * 3.6}deg"><div><strong>${percent}%</strong><span>natija</span></div></div><p class="result-message">${percent >= 70 ? 'Ajoyib natija! Bilimlaringiz mustahkam.' : 'Yaxshi urinish! Mavzuni yana bir bor takrorlang.'}</p><div class="result-stats"><div><strong>${correct}</strong><span>To‘g‘ri javob</span></div><div><strong>${incorrect.length}</strong><span>Noto‘g‘ri javob</span></div><div><strong>${formatTime(used)}</strong><span>Sarflangan vaqt</span></div></div><div class="result-actions"><button class="primary-btn" id="restart">Qayta ishlash</button><button class="secondary-btn" id="backTopics">Mavzularga qaytish</button><button class="text-btn" id="backHome">Bosh sahifa</button></div></div>${review}</section>`;
  bindTheme();
  document.querySelector('#restart').onclick = () => beginTest(session.course, session.topic);
  document.querySelector('#backTopics').onclick = () => showTopics(session.course);
  document.querySelector('#backHome').onclick = showHome;
}
