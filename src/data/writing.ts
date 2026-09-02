import type { WritingTask } from '../types';

export const writingTasks: WritingTask[] = [
  {
    id: 'schreiben-1',
    title: 'Teil 1: Eine E-Mail schreiben',
    instruction: 'Sie haben eine E-Mail von Ihrer Freundin Julia bekommen. Schreiben Sie eine E-Mail an Julia.',
    type: 'email',
    situation: 'Julia schreibt Ihnen, dass sie bald Geburtstag hat und eine Party macht. Sie fragt, ob Sie kommen können und was Sie mitbringen sollen.',
    points: [
      'Bedanken Sie sich für die E-Mail.',
      'Sagen Sie, ob Sie zur Party kommen.',
      'Sagen Sie, was Sie mitbringen möchten.',
      'Fragen Sie, wann die Party beginnt.',
    ],
    sampleAnswer: `Liebe Julia,

vielen Dank für deine E-Mail! Ich komme sehr gerne zu deiner Party. Ich bringe einen Kuchen mit. Wann beginnt die Party? Ich kann dir auch beim Vorbereiten helfen, wenn du möchtest.

Bis bald!

Liebe Grüße
deine Maria`,
    minWords: 30,
    maxWords: 80,
  },
  {
    id: 'schreiben-2',
    title: 'Teil 2: Eine Nachricht schreiben',
    instruction: 'Sie sind krank und können nicht zur Arbeit kommen. Schreiben Sie eine Nachricht an Ihren Kollegen Herr Weber.',
    type: 'message',
    situation: 'Sie sind krank und können heute nicht arbeiten. Sie müssen einen Termin verschieben.',
    points: [
      'Gründen Sie sich bei Herrn Weber.',
      'Sagen Sie, dass Sie krank sind.',
      'Sagen Sie, dass Sie heute nicht arbeiten können.',
      'Bitten Sie, den Termin auf nächste Woche zu verschieben.',
    ],
    sampleAnswer: `Guten Tag Herr Weber,

ich bin heute krank und kann leider nicht arbeiten. Können wir unseren Termin auf nächste Woche verschieben? Ich melde mich, sobald es mir besser geht.

Entschuldigen Sie die Umstände.

Mit freundlichen Grüßen
Thomas Berger`,
    minWords: 30,
    maxWords: 80,
  },
  {
    id: 'schreiben-3',
    title: 'Teil 3: Ein Formular ausfüllen',
    instruction: 'Sie möchten einen Sprachkurs machen. Schreiben Sie eine E-Mail an die Sprachschule.',
    type: 'form',
    situation: 'Sie möchten einen Deutschkurs A1 besuchen. Sie schreiben an die Sprachschule.',
    points: [
      'Sagen Sie, dass Sie einen Deutschkurs A1 machen möchten.',
      'Fragen Sie, wann der nächste Kurs beginnt.',
      'Fragen Sie nach den Kosten.',
      'Sagen Sie, wie man sich anmelden kann.',
    ],
    sampleAnswer: `Sehr geehrte Damen und Herren,

ich möchte gerne einen Deutschkurs auf dem Niveau A1 bei Ihnen machen. Wann beginnt der nächste Kurs? Was kostet der Kurs? Wie kann ich mich anmelden? Ich freue mich auf Ihre Antwort.

Mit freundlichen Grüßen
Sergei Ivanov`,
    minWords: 30,
    maxWords: 80,
  },
];
