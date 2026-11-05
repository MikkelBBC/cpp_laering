const test = require('node:test');
const assert = require('node:assert');
const C = require('./lessons.js');

function fakeStorage() {
  const data = {};
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); }
  };
}

test('alle lektioner har id, kode og 1-2 opgaver', () => {
  assert.ok(C.LESSONS.length >= 6);
  const ids = new Set();
  for (const l of C.LESSONS) {
    assert.ok(l.id && l.title && l.text && l.code);
    assert.ok(!ids.has(l.id));
    ids.add(l.id);
    assert.ok(l.exercises.length >= 1 && l.exercises.length <= 2);
    for (const ex of l.exercises) {
      if (ex.type === 'quiz') assert.ok(ex.correct >= 0 && ex.correct < ex.options.length);
      else assert.ok(ex.answers.length > 0);
    }
  }
});

test('quiz-svar tjekkes på indeks', () => {
  const ex = { type: 'quiz', options: ['a', 'b'], correct: 1 };
  assert.strictEqual(C.checkAnswer(ex, 1), true);
  assert.strictEqual(C.checkAnswer(ex, 0), false);
});

test('tekstsvar ignorerer store bogstaver og mellemrum', () => {
  const ex = { type: 'text', answers: ['int x = 5;'] };
  assert.strictEqual(C.checkAnswer(ex, '  INT x=5; '), true);
  assert.strictEqual(C.checkAnswer(ex, 'int   x =  5 ;'), true);
  assert.strictEqual(C.checkAnswer(ex, 'int y = 5;'), false);
  assert.strictEqual(C.checkAnswer(ex, ''), false);
});

test('fremskridt gemmes og indlæses', () => {
  const s = fakeStorage();
  assert.deepStrictEqual(C.loadProgress(s), []);
  let done = C.markDone([], 'variabler');
  done = C.markDone(done, 'variabler');
  assert.deepStrictEqual(done, ['variabler']);
  C.saveProgress(s, done);
  assert.deepStrictEqual(C.loadProgress(s), ['variabler']);
});

test('ødelagt lagring giver tomt fremskridt', () => {
  const s = fakeStorage();
  s.setItem(C.STORAGE_KEY, '{ikke json');
  assert.deepStrictEqual(C.loadProgress(s), []);
});

test('lektion gennemført kun når alle opgaver er løst', () => {
  const l = C.LESSONS[0];
  assert.strictEqual(C.isLessonComplete(l, [true]), false);
  assert.strictEqual(C.isLessonComplete(l, [true, true]), true);
});

test('procent beregnes', () => {
  assert.strictEqual(C.progressPercent([], C.LESSONS), 0);
  assert.strictEqual(C.progressPercent(C.LESSONS.map((l) => l.id), C.LESSONS), 100);
});
