import type { SchreibenTeil1Task } from '@/types';

const templates = [
  ['Sprachschule – Anmeldung','Eine Teilnehmerin aus Frankreich möchte im August einen Deutschkurs besuchen. Sie hat bereits sechs Monate Deutsch gelernt, kann nur vormittags lernen und spricht außerdem Englisch. Ergänzen Sie die fünf fehlenden Informationen.',['Geburtsort','Andere Sprache','Deutsch gelernt','Kursbeginn','Kurszeit']],
  ['Arztpraxis – Patientenkarte','Ein Patient lebt in Hamburg und arbeitet als Reiseleiter. Seit gestern hat er Fieber und ist bei einer gesetzlichen Krankenkasse versichert. Ergänzen Sie fünf fehlende Informationen.',['Wohnort','Alter','Beruf','Seit wann krank','Beschwerde']],
  ['Ferienwohnung – Reservierung','Eine Familie möchte im Sommer eine Woche am See verbringen. Sie reist am 20. Juli an, fährt am 27. Juli zurück und kommt mit vier Personen. Sie braucht zwei Schlafzimmer und kein Frühstück.',['Anreise','Abreise','Personen','Schlafzimmer','Frühstück']],
  ['Volkshochschule – Kursanmeldung','Eine berufstätige Person möchte im September Deutsch A1 lernen. Tagsüber ist sie bei der Arbeit. Sie kann montags und mittwochs ab 18 Uhr lernen und möchte die Unterlagen per E-Mail erhalten.',['Kurs','Unterrichtstage','Uhrzeit','E-Mail','Bezahlt']],
  ['Fitnessstudio – Mitgliedsantrag','Eine neue Kundin möchte ab September trainieren. Sie bevorzugt Fitness, kann montags und mittwochs kommen und möchte höchstens 30 Euro monatlich bezahlen.',['Geburtsdatum','Startdatum','Sportart','Trainingstage','Monatsbeitrag']],
  ['Hotel – Zimmerreservierung','Eine Person plant eine Reise im Oktober und möchte zwei Nächte in einem Hotel bleiben. Gewünscht ist ein Einzelzimmer mit Frühstück. Die Anreise erfolgt am Nachmittag.',['Anreisetag','Abreisetag','Zimmer','Frühstück','Ankunftszeit']],
  ['Kino – Kartenbestellung','Eine Gruppe möchte am Samstag einen Film besuchen. Es kommen drei Personen. Der gewünschte Film beginnt um 19 Uhr. Die Karten sollen an der Abendkasse abgeholt werden.',['Tag','Personen','Film','Beginn','Abholung']],
  ['Museum – Gruppenbesuch','Eine Gruppe möchte ein Stadtmuseum besuchen. Der Termin ist am Vormittag. Es kommen zehn Personen und die Gruppe möchte eine Führung auf Deutsch.',['Datum','Uhrzeit','Personen','Führung','Sprache']],
  ['Sportverein – Anmeldung','Eine Person möchte Fußball spielen. Das Training findet dienstags um 19 Uhr statt. Für die Anmeldung werden Sportart, Geburtsjahr, Trainingstag, Trainingszeit und Kleidunggröße benötigt.',['Sportart','Geburtsjahr','Trainingstag','Trainingszeit','Größe']],
  ['Café – Tischreservierung','Vier Freunde möchten am Samstagabend gemeinsam essen. Sie wünschen einen Tisch um 19 Uhr im Innenbereich. Die Reservierung erfolgt auf den Namen der anrufenden Person.',['Datum','Uhrzeit','Personen','Name','Bereich']],
];

const answers: Record<string,string[]> = {
  'Sprachschule – Anmeldung':['Lyon','Englisch','ja','1. August','vormittags'],
  'Arztpraxis – Patientenkarte':['Hamburg','30','Reiseleiter','seit gestern','Fieber'],
  'Ferienwohnung – Reservierung':['20.07.','27.07.','4','2','nein'],
  'Volkshochschule – Kursanmeldung':['Deutsch A1','Montag und Mittwoch','18:00 Uhr','per E-Mail','ja'],
  'Fitnessstudio – Mitgliedsantrag':['05.11.1990','01.09.','Fitness','Montag und Mittwoch','29 Euro'],
  'Hotel – Zimmerreservierung':['10.10.','12.10.','Einzelzimmer','ja','nachmittags'],
  'Kino – Kartenbestellung':['Samstag','3','Abendfilm','19:00 Uhr','Abendkasse'],
  'Museum – Gruppenbesuch':['14.09.','11:00 Uhr','10','ja','Deutsch'],
  'Sportverein – Anmeldung':['Fußball','1997','Dienstag','19:00 Uhr','L'],
  'Café – Tischreservierung':['Samstag','19:00 Uhr','4','Sara Ali','innen'],
};

export const schreibenTeil1Tasks: SchreibenTeil1Task[] = Array.from({ length: 30 }, (_, i) => {
  const [title, situation, labels] = templates[i % templates.length];
  const values = answers[title] || ['Angabe 1','Angabe 2','Angabe 3','Angabe 4','Angabe 5'];
  const fields = labels.map((label, j) => ({ id:`active-${j+1}`, label, type:'text' as const, value:'', answer:values[j] }));
  return {
    id:`t1-${String(i+1).padStart(2,'0')}`,
    title:`${title} · Aufgabe ${i+1}`,
    situation: `${situation} In der Prüfung stehen im Formular bereits viele Angaben. Finden Sie gezielt die fünf Informationen aus dem Text und übertragen Sie nur diese Angaben.`,
    formTitle:title,
    formSubtitle:'Prüfungsformular · Fünf fehlende Informationen',
    fields:[
      {id:'given-1',label:'Name / Vorname',type:'text' as const,value:'bereits eingetragen',answer:''},
      {id:'given-2',label:'Adresse',type:'text' as const,value:'bereits eingetragen',answer:''},
      ...fields,
      {id:'given-3',label:'Telefon / E-Mail',type:'text' as const,value:'bereits eingetragen',answer:''},
    ],
  };
});
