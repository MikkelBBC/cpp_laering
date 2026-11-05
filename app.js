// DOM-del af appen. Logik og data ligger i lessons.js.
(function () {
  'use strict';
  var C = window.CppLaering;
  var storage = window.localStorage;
  var done = C.loadProgress(storage);
  var current = 0;
  var solved = [];

  var listEl = document.getElementById('lesson-list');
  var lessonEl = document.getElementById('lesson');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function renderProgress() {
    var count = C.LESSONS.filter(function (l) { return done.indexOf(l.id) !== -1; }).length;
    document.getElementById('bar-fill').style.width = C.progressPercent(done, C.LESSONS) + '%';
    document.getElementById('progress-text').textContent = count + ' af ' + C.LESSONS.length + ' lektioner';
  }

  function renderList() {
    listEl.innerHTML = '';
    C.LESSONS.forEach(function (lesson, i) {
      var b = el('button', '', (i + 1) + '. ' + lesson.title);
      b.type = 'button';
      if (i === current) b.classList.add('active');
      if (done.indexOf(lesson.id) !== -1) b.classList.add('done');
      b.addEventListener('click', function () { showLesson(i); });
      listEl.appendChild(b);
    });
  }

  function onSolved(i) {
    var lesson = C.LESSONS[current];
    solved[i] = true;
    if (C.isLessonComplete(lesson, solved) && done.indexOf(lesson.id) === -1) {
      done = C.markDone(done, lesson.id);
      C.saveProgress(storage, done);
      renderList();
      renderProgress();
      lessonEl.appendChild(el('div', 'complete', 'Lektionen er gennemført! 🎉'));
    }
  }

  function renderExercise(ex, i) {
    var box = el('div', 'exercise');
    box.appendChild(el('p', '', 'Opgave ' + (i + 1) + ': ' + ex.question));
    var feedback = el('div', 'feedback');

    function show(ok) {
      feedback.textContent = ok ? 'Rigtigt!' : 'Forkert – prøv igen.';
      feedback.className = 'feedback ' + (ok ? 'ok' : 'bad');
      if (ok) onSolved(i);
    }

    if (ex.type === 'quiz') {
      var opts = el('div', 'options');
      ex.options.forEach(function (text, j) {
        var b = el('button', '', text);
        b.type = 'button';
        b.addEventListener('click', function () {
          var ok = C.checkAnswer(ex, j);
          Array.prototype.forEach.call(opts.children, function (c) { c.classList.remove('wrong'); });
          b.classList.add(ok ? 'right' : 'wrong');
          show(ok);
        });
        opts.appendChild(b);
      });
      box.appendChild(opts);
    } else {
      var form = el('form', 'answer-row');
      var input = el('input');
      input.type = 'text';
      input.autocomplete = 'off';
      input.setAttribute('autocapitalize', 'off');
      input.spellcheck = false;
      input.placeholder = 'Dit svar';
      var btn = el('button', 'check', 'Tjek');
      btn.type = 'submit';
      form.appendChild(input);
      form.appendChild(btn);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        show(C.checkAnswer(ex, input.value));
      });
      box.appendChild(form);
    }
    box.appendChild(feedback);
    return box;
  }

  function showLesson(i) {
    current = i;
    solved = [];
    var lesson = C.LESSONS[i];
    lessonEl.innerHTML = '';
    lessonEl.appendChild(el('h2', '', lesson.title));
    lessonEl.appendChild(el('p', '', lesson.text));
    var pre = el('pre');
    pre.appendChild(el('code', '', lesson.code));
    lessonEl.appendChild(pre);
    lesson.exercises.forEach(function (ex, j) { lessonEl.appendChild(renderExercise(ex, j)); });
    if (done.indexOf(lesson.id) !== -1) {
      lessonEl.appendChild(el('div', 'complete', 'Du har allerede gennemført denne lektion.'));
    }
    renderList();
  }

  document.getElementById('reset').addEventListener('click', function () {
    if (!window.confirm('Vil du nulstille dit fremskridt?')) return;
    done = [];
    C.saveProgress(storage, done);
    renderProgress();
    showLesson(current);
  });

  renderProgress();
  showLesson(0);
})();
