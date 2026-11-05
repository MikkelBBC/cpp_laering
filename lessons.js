// Lektionsdata og logik for C++-læringsappen. Virker både i browser og i Node (til tests).
(function (root) {
  'use strict';

  var LESSONS = [
    {
      id: 'variabler',
      title: 'Variabler',
      text: 'En variabel er en navngivet plads i hukommelsen, hvor du kan gemme en værdi. I C++ skal du angive typen, når du opretter variablen. Du kan senere give den en ny værdi med =.',
      code: '#include <iostream>\n\nint main() {\n    int alder = 25;\n    alder = 26;\n    std::cout << "Alder: " << alder << std::endl;\n    return 0;\n}',
      exercises: [
        {
          type: 'quiz',
          question: 'Hvad udskriver programmet ovenfor?',
          options: ['Alder: 25', 'Alder: 26', 'Alder: alder', 'Fejl'],
          correct: 1
        },
        {
          type: 'text',
          question: 'Skriv den linje, der opretter en int-variabel ved navn x med værdien 5.',
          answers: ['int x = 5;', 'int x=5;', 'int x{5};', 'int x(5);']
        }
      ]
    },
    {
      id: 'datatyper',
      title: 'Datatyper',
      text: 'De mest brugte grundtyper er int (heltal), double (kommatal), char (ét tegn), bool (true/false) og std::string (tekst, kræver #include <string>).',
      code: 'int antal = 3;\ndouble pris = 19.95;\nchar bogstav = \'A\';\nbool klar = true;\nstd::string navn = "Ida";',
      exercises: [
        {
          type: 'quiz',
          question: 'Hvilken type passer bedst til værdien 3.14?',
          options: ['int', 'char', 'double', 'bool'],
          correct: 2
        },
        {
          type: 'text',
          question: 'Hvilken type bruges til værdierne true og false?',
          answers: ['bool']
        }
      ]
    },
    {
      id: 'if-else',
      title: 'if / else',
      text: 'Med if kan programmet vælge, hvad der skal ske. Betingelsen i parentesen er enten sand eller falsk. else kører, hvis betingelsen er falsk. Sammenlign med ==, !=, <, >, <= og >=.',
      code: 'int tal = 7;\nif (tal > 10) {\n    std::cout << "Stort";\n} else if (tal > 5) {\n    std::cout << "Mellem";\n} else {\n    std::cout << "Lille";\n}',
      exercises: [
        {
          type: 'quiz',
          question: 'Hvad udskriver koden ovenfor?',
          options: ['Stort', 'Mellem', 'Lille', 'Ingenting'],
          correct: 1
        },
        {
          type: 'text',
          question: 'Hvilken operator tester om to værdier er ens?',
          answers: ['==']
        }
      ]
    },
    {
      id: 'loekker',
      title: 'Løkker',
      text: 'En løkke gentager kode. En for-løkke har en start, en betingelse og et skridt. En while-løkke kører, så længe betingelsen er sand.',
      code: 'for (int i = 0; i < 3; i++) {\n    std::cout << i << " ";\n}\n// Udskriver: 0 1 2\n\nint n = 3;\nwhile (n > 0) {\n    n--;\n}',
      exercises: [
        {
          type: 'quiz',
          question: 'Hvor mange gange kører for (int i = 0; i < 5; i++)?',
          options: ['4', '5', '6', 'Uendeligt'],
          correct: 1
        },
        {
          type: 'text',
          question: 'Hvilket nøgleord starter en løkke, der kører så længe en betingelse er sand (ud over for)?',
          answers: ['while']
        }
      ]
    },
    {
      id: 'funktioner',
      title: 'Funktioner',
      text: 'En funktion samler kode, du kan genbruge. Den har en returtype, et navn og parametre. return sender en værdi tilbage. Brug void, hvis funktionen ikke returnerer noget.',
      code: 'int laegSammen(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int sum = laegSammen(2, 3);\n    std::cout << sum; // 5\n    return 0;\n}',
      exercises: [
        {
          type: 'quiz',
          question: 'Hvilken returtype bruges, når en funktion ikke returnerer noget?',
          options: ['int', 'null', 'void', 'empty'],
          correct: 2
        },
        {
          type: 'text',
          question: 'Hvad returnerer laegSammen(4, 6)?',
          answers: ['10']
        }
      ]
    },
    {
      id: 'arrays',
      title: 'Arrays',
      text: 'Et array gemmer flere værdier af samme type efter hinanden. Elementerne tilgås med et indeks, der starter ved 0. Størrelsen er fast.',
      code: 'int tal[4] = {10, 20, 30, 40};\nstd::cout << tal[0]; // 10\nstd::cout << tal[3]; // 40\n\nfor (int i = 0; i < 4; i++) {\n    std::cout << tal[i] << " ";\n}',
      exercises: [
        {
          type: 'quiz',
          question: 'Hvilket indeks har det første element i et array?',
          options: ['0', '1', '-1', 'Det afhænger af typen'],
          correct: 0
        },
        {
          type: 'text',
          question: 'Hvad er værdien af tal[2] i eksemplet?',
          answers: ['30']
        }
      ]
    }
  ];

  // Gør svar sammenlignelige: små bogstaver, ingen ekstra mellemrum.
  function normalize(s) {
    return String(s).trim().toLowerCase().replace(/\s+/g, ' ').replace(/\s*([=;(){}])\s*/g, '$1');
  }

  function checkAnswer(exercise, answer) {
    if (exercise.type === 'quiz') return Number(answer) === exercise.correct;
    var a = normalize(answer);
    if (a === '') return false;
    return exercise.answers.some(function (x) { return normalize(x) === a; });
  }

  var STORAGE_KEY = 'cpp_laering_progress';

  function loadProgress(storage) {
    try {
      var data = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function saveProgress(storage, done) {
    try { storage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch (e) { /* ignorer */ }
  }

  function markDone(done, lessonId) {
    return done.indexOf(lessonId) === -1 ? done.concat([lessonId]) : done;
  }

  // En lektion er gennemført, når alle opgaver er besvaret rigtigt.
  function isLessonComplete(lesson, solved) {
    return lesson.exercises.every(function (_, i) { return !!solved[i]; });
  }

  function progressPercent(done, lessons) {
    var count = lessons.filter(function (l) { return done.indexOf(l.id) !== -1; }).length;
    return Math.round((count / lessons.length) * 100);
  }

  var api = {
    LESSONS: LESSONS,
    STORAGE_KEY: STORAGE_KEY,
    normalize: normalize,
    checkAnswer: checkAnswer,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    markDone: markDone,
    isLessonComplete: isLessonComplete,
    progressPercent: progressPercent
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CppLaering = api;
})(this);
