import type { SpeakingTask } from '../types';

export const speakingTasks: SpeakingTask[] = [
  {
    id: 'sprechen-1',
    title: 'Teil 1: Sich vorstellen',
    instruction: 'Stellen Sie sich vor. Sprechen Sie über sich selbst.',
    type: 'introduction',
    prompts: [
      'Wie heißen Sie?',
      'Woher kommen Sie?',
      'Was sind Sie von Beruf?',
      'Was machen Sie in Ihrer Freizeit?',
      'Welche Sprachen sprechen Sie?',
    ],
    sampleAnswer: 'Hallo, ich heiße Maria. Ich komme aus Russland. Ich bin Studentin. In meiner Freizeit lese ich gerne und treibe Sport. Ich spreche Russisch, Englisch und ein bisschen Deutsch.',
    keywords: ['Name', 'Herkunft', 'Beruf', 'Freizeit', 'Sprachen'],
  },
  {
    id: 'sprechen-2',
    title: 'Teil 2: Thema wählen und sprechen',
    instruction: 'Wählen Sie ein Thema und sprechen Sie etwa 2-3 Minuten darüber.',
    type: 'topic-card',
    prompts: [
      'Mein Wohnort — Wo wohnen Sie? Wie ist Ihre Wohnung? Was gibt es in der Nähe?',
      'Meine Familie — Wie groß ist Ihre Familie? Was machen Ihre Familienmitglieder? Was machen Sie gerne zusammen?',
      'Meine Arbeit / Mein Studium — Was machen Sie? Wie gefällt Ihnen Ihre Arbeit? Was möchten Sie in Zukunft machen?',
      'Meine Hobbys — Was machen Sie in der Freizeit? Wie oft? Mit wem?',
    ],
    sampleAnswer: 'Ich wohne in Berlin in einer kleinen Wohnung. Die Wohnung hat zwei Zimmer und eine Küche. In der Nähe gibt es einen Supermarkt, eine Apotheke und einen Park. Ich mag meinen Wohnort, weil alles in der Nähe ist.',
    keywords: ['Wohnort', 'Familie', 'Arbeit', 'Hobbys'],
  },
  {
    id: 'sprechen-3',
    title: 'Teil 3: Um etwas bitten',
    instruction: 'Bitten Sie Ihren Partner um etwas. Verwenden Sie höfliche Formen.',
    type: 'request',
    prompts: [
      'Bitten Sie im Restaurant um die Speisekarte.',
      'Bitten Sie einen Kollegen, Ihnen bei einer Aufgabe zu helfen.',
      'Fragen Sie an der Information nach dem Weg zum Bahnhof.',
      'Bitten Sie im Hotel um ein anderes Zimmer.',
    ],
    sampleAnswer: 'Entschuldigung, könnten Sie mir bitte die Speisekarte bringen? Ich möchte gerne etwas bestellen.',
    keywords: [' höflich', 'bitte', 'könnten Sie', 'Entschuldigung'],
  },
];
