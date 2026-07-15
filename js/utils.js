const store = {
  get: () => JSON.parse(localStorage.getItem('bilimsinov-session') || 'null'),
  set: value => localStorage.setItem('bilimsinov-session', JSON.stringify(value)),
  clear: () => localStorage.removeItem('bilimsinov-session')
};
const shuffle = array => [...array].sort(() => Math.random() - .5);
const esc = value => String(value).replace(/[&<>]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' })[char]);
