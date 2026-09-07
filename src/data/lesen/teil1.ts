import type { ReadingTask } from '@/types';

export const lesenTeil1Tasks: ReadingTask[] = [
  {
    id: 'teil1-001',
    title: 'Aufgabe 1',
    instruction:
      'Lesen Sie die Nachricht. Sind die Aussagen richtig oder falsch?',
    visualType: 'sms',
    visual: {
      sender: 'Paul',
      date: 'Heute, 17:42',
      message: `Hallo Anna,

ich komme heute nicht zum Deutschkurs. Ich bin krank.

Morgen bin ich wieder da.

Liebe Grüße
Paul`,
    },
    questions: [
      {
        id: 'teil1-001-q1',
        type: 'true-false',
        prompt: 'Paul kommt heute zum Deutschkurs.',
        correctAnswer: false,
        explanation:
          'Paul schreibt: „Ich komme heute nicht zum Deutschkurs.“',
      },
      {
        id: 'teil1-001-q2',
        type: 'true-false',
        prompt: 'Paul kommt morgen wieder zum Kurs.',
        correctAnswer: true,
        explanation:
          'Paul schreibt: „Morgen bin ich wieder da.“',
      },
    ],
  },

  {
    id: 'teil1-002',
    title: 'Aufgabe 2',
    instruction:
      'Lesen Sie die E-Mail. Sind die Aussagen richtig oder falsch?',
    visualType: 'email',
    visual: {
      sender: 'Praxis Müller',
      recipient: 'Maria',
      subject: 'Ihr Arzttermin',
      date: 'Montag, 09:15',
      body: `Hallo Maria,

Ihr Termin beim Arzt ist am Mittwoch um 10 Uhr.

Bitte kommen Sie um 9.45 Uhr.

Viele Grüße
Praxis Müller`,
    },
    questions: [
      {
        id: 'teil1-002-q1',
        type: 'true-false',
        prompt: 'Maria hat am Mittwoch einen Termin.',
        correctAnswer: true,
        explanation:
          'Der Termin ist am Mittwoch.',
      },
      {
        id: 'teil1-002-q2',
        type: 'true-false',
        prompt: 'Der Termin ist um Viertel vor zehn.',
        correctAnswer: false,
        explanation:
          'Der Termin ist um 10 Uhr. Maria soll um 9.45 Uhr kommen.',
      },
      {
        id: 'teil1-002-q3',
        type: 'true-false',
        prompt: 'Maria soll vor zehn Uhr kommen.',
        correctAnswer: true,
        explanation:
          'Maria soll um 9.45 Uhr kommen.',
      },
    ],
  },

  {
    id: 'teil1-003',
    title: 'Aufgabe 3',
    instruction:
      'Lesen Sie die Notiz. Sind die Aussagen richtig oder falsch?',
    visualType: 'note',
    visual: {
      title: 'Für Tom',
      message: `Bitte kauf Brot und Milch.

Ich bin im Supermarkt.

Ich bin um 18 Uhr wieder zu Hause.`,
      signature: 'Mama',
    },
    questions: [
      {
        id: 'teil1-003-q1',
        type: 'true-false',
        prompt: 'Tom soll Brot kaufen.',
        correctAnswer: true,
        explanation:
          'Tom soll Brot und Milch kaufen.',
      },
      {
        id: 'teil1-003-q2',
        type: 'true-false',
        prompt: 'Mama ist jetzt zu Hause.',
        correctAnswer: false,
        explanation:
          'Mama ist im Supermarkt.',
      },
      {
        id: 'teil1-003-q3',
        type: 'true-false',
        prompt: 'Mama kommt um 18 Uhr nach Hause.',
        correctAnswer: true,
        explanation:
          'Mama schreibt: „Ich bin um 18 Uhr wieder zu Hause.“',
      },
      {
        id: 'teil1-003-q4',
        type: 'true-false',
        prompt: 'Tom soll nur Milch kaufen.',
        correctAnswer: false,
        explanation:
          'Tom soll Brot und Milch kaufen.',
      },
    ],
  },

  {
    id: 'teil1-004',
    title: 'Aufgabe 4',
    instruction:
      'Lesen Sie die Postkarte. Sind die Aussagen richtig oder falsch?',
    visualType: 'postcard',
    visual: {
      title: 'Viele Grüße aus Berlin!',
      message: `Liebe Oma,

wir sind jetzt in Berlin.

Das Wetter ist schön.

Morgen besuchen wir den Zoo.

Liebe Grüße
Nina`,
    },
    questions: [
      {
        id: 'teil1-004-q1',
        type: 'true-false',
        prompt: 'Nina ist in Berlin.',
        correctAnswer: true,
        explanation:
          'Nina schreibt: „Wir sind jetzt in Berlin.“',
      },
      {
        id: 'teil1-004-q2',
        type: 'true-false',
        prompt: 'Nina besucht heute den Zoo.',
        correctAnswer: false,
        explanation:
          'Nina schreibt: „Morgen besuchen wir den Zoo.“',
      },
    ],
  },

  {
    id: 'teil1-005',
    title: 'Aufgabe 5',
    instruction:
      'Lesen Sie die Notiz am Kühlschrank. Sind die Aussagen richtig oder falsch?',
    visualType: 'fridge-note',
    visual: {
      title: 'Für Lukas',
      message: `Dein Mittagessen steht auf dem Tisch.

Im Kühlschrank ist noch Saft.

Ich komme um 17 Uhr nach Hause.`,
      signature: 'Mama',
    },
    questions: [
      {
        id: 'teil1-005-q1',
        type: 'true-false',
        prompt: 'Das Mittagessen steht auf dem Tisch.',
        correctAnswer: true,
        explanation:
          'Das Mittagessen steht auf dem Tisch.',
      },
      {
        id: 'teil1-005-q2',
        type: 'true-false',
        prompt: 'Der Saft ist auf dem Tisch.',
        correctAnswer: false,
        explanation:
          'Der Saft ist im Kühlschrank.',
      },
      {
        id: 'teil1-005-q3',
        type: 'true-false',
        prompt: 'Mama kommt um 17 Uhr nach Hause.',
        correctAnswer: true,
        explanation:
          'Mama schreibt: „Ich komme um 17 Uhr nach Hause.“',
      },
    ],
  },
];