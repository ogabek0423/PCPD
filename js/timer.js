let timerId;
function startTimer(session, onTick, onFinish) {
  clearInterval(timerId);
  timerId = setInterval(() => {
    session.secondsLeft--;
    onTick(session.secondsLeft);
    store.set(session);
    if (session.secondsLeft <= 0) { clearInterval(timerId); onFinish(); }
  }, 1000);
}
function stopTimer() { clearInterval(timerId); }
function formatTime(seconds) { return `${String(Math.max(0, Math.floor(seconds / 60))).padStart(2,'0')}:${String(Math.max(0, seconds % 60)).padStart(2,'0')}`; }
