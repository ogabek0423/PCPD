function showResults(session) {
  stopTimer();
  const correct = session.questions.reduce((count, q, index) => count + (session.answers[index] === q.answer ? 1 : 0), 0);
  const total = session.questions.length;
  const percent = total ? Math.round(correct / total * 100) : 0;
  const used = session.duration - session.secondsLeft;
  store.clear();
  app.innerHTML = `<section class="result-page page-enter"><header class="simple-header"><a class="brand" href="#">Bilim<span>Sinov</span></a>${themeButton()}</header><div class="result-card"><div class="celebrate">${percent >= 70 ? '🎉' : '💪'}</div><p class="eyebrow">TEST YAKUNLANDI</p><h1>${session.topic}</h1><div class="score-ring" style="--score:${percent * 3.6}deg"><div><strong>${percent}%</strong><span>natija</span></div></div><p class="result-message">${percent >= 70 ? 'Ajoyib natija! Bilimlaringiz mustahkam.' : 'Yaxshi urinish! Mavzuni yana bir bor takrorlang.'}</p><div class="result-stats"><div><strong>${correct}</strong><span>To‘g‘ri javob</span></div><div><strong>${total - correct}</strong><span>Noto‘g‘ri javob</span></div><div><strong>${formatTime(used)}</strong><span>Sarflangan vaqt</span></div></div><div class="result-actions"><button class="primary-btn" id="restart">Qayta ishlash</button><button class="secondary-btn" id="backTopics">Mavzularga qaytish</button><button class="text-btn" id="backHome">Bosh sahifa</button></div></div></section>`;
  bindTheme();
  document.querySelector('#restart').onclick = () => beginTest(session.course, session.topic);
  document.querySelector('#backTopics').onclick = () => showTopics(session.course);
  document.querySelector('#backHome').onclick = showHome;
}
