import type { ReadingTeil2Task } from '@/types';

export const lesenTeil2Tasks: ReadingTeil2Task[] = [
  {
    id: 'teil2-001',
    title: 'Aufgabe 1',
    situation: "Sie möchten am Samstagmorgen Brot und Brötchen kaufen.",
    options: {
      a: {"type": "shop", "title": "Bäckerei am Markt", "text": "Samstag: 7–12 Uhr\nBrot · Brötchen · Kuchen"},
      b: {"type": "shop", "title": "Bäckerei am Bahnhof", "text": "Montag–Freitag: 6–18 Uhr\nSamstag und Sonntag geschlossen"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-002',
    title: 'Aufgabe 2',
    situation: "Sie möchten heute Abend einen Film sehen.",
    options: {
      a: {"type": "cinema", "title": "Kino City", "text": "Heute: Filme ab 18 Uhr\nKasse bis 21 Uhr geöffnet"},
      b: {"type": "cinema", "title": "Filmclub Nord", "text": "Heute geschlossen\nNächste Vorstellung: Samstag, 15 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-003',
    title: 'Aufgabe 3',
    situation: "Sie suchen einen Deutschkurs am Abend.",
    options: {
      a: {"type": "school", "title": "Sprachschule Mitte", "text": "Deutsch A1\nMontag und Mittwoch\n18–20 Uhr"},
      b: {"type": "school", "title": "Deutsch am Vormittag", "text": "Deutsch A1\nDienstag und Donnerstag\n9–11 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-004',
    title: 'Aufgabe 4',
    situation: "Sie möchten morgen mit dem Zug nach Hamburg fahren.",
    options: {
      a: {"type": "travel", "title": "Bahn-Reiseinfo", "text": "Züge nach Hamburg\nAbfahrt: morgen 8:10, 9:05, 10:20 Uhr"},
      b: {"type": "travel", "title": "Bus-Reiseinfo", "text": "Busse nach Hamburg\nHeute: 14:00 und 16:00 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-005',
    title: 'Aufgabe 5',
    situation: "Sie suchen Informationen über das Wetter.",
    options: {
      a: {"type": "website", "title": "www.wetter-heute.de", "text": "Wetter heute\nTemperatur · Regen · Sonne\nWetter in Deutschland"},
      b: {"type": "website", "title": "www.reise-fotos.de", "text": "Fotos aus Europa\nUrlaubstipps und Hotels"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-006',
    title: 'Aufgabe 6',
    situation: "Sie möchten eine Wohnung mit zwei Zimmern mieten.",
    options: {
      a: {"type": "housing", "title": "Wohnung zu vermieten", "text": "2 Zimmer\nKüche und Bad\nZentrum\nKontakt: 0157 234567"},
      b: {"type": "housing", "title": "Zimmer frei", "text": "1 Zimmer\nWG\nNähe Universität"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-007',
    title: 'Aufgabe 7',
    situation: "Sie brauchen am Sonntag einen Arzt.",
    options: {
      a: {"type": "doctor", "title": "Praxis Dr. Klein", "text": "Sonntag: 10–13 Uhr\nNotfall-Sprechstunde"},
      b: {"type": "doctor", "title": "Praxis Dr. Wolf", "text": "Montag–Freitag: 8–17 Uhr\nSamstag und Sonntag geschlossen"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-008',
    title: 'Aufgabe 8',
    situation: "Sie möchten heute Nachmittag schwimmen.",
    options: {
      a: {"type": "leisure", "title": "Hallenbad Süd", "text": "Heute geöffnet: 14–20 Uhr\nSchwimmen für alle"},
      b: {"type": "leisure", "title": "Sporthalle West", "text": "Heute geschlossen\nFußball morgen 18 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-009',
    title: 'Aufgabe 9',
    situation: "Sie möchten am Samstag ein Geschenk kaufen.",
    options: {
      a: {"type": "shop", "title": "Geschenke & mehr", "text": "Samstag 10–18 Uhr\nGeschenke, Karten, Blumen"},
      b: {"type": "shop", "title": "Bürobedarf", "text": "Montag–Freitag 9–17 Uhr\nPapier und Stifte"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-010',
    title: 'Aufgabe 10',
    situation: "Sie suchen eine Sprachschule in Berlin.",
    options: {
      a: {"type": "website", "title": "www.sprachschule-berlin.de", "text": "Deutschkurse in Berlin\nA1–B1\nKursorte und Termine"},
      b: {"type": "website", "title": "www.deutsch-lernen.de", "text": "Online-Wörterbuch\nÜbersetzungen und Grammatik"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-011',
    title: 'Aufgabe 11',
    situation: "Sie möchten am Montagabend Pizza essen.",
    options: {
      a: {"type": "restaurant", "title": "Pizzeria Roma", "text": "Montag 17–22 Uhr\nPizza · Pasta · Salat"},
      b: {"type": "restaurant", "title": "Café Sonnenschein", "text": "Montag 8–16 Uhr\nKaffee · Kuchen · Frühstück"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-012',
    title: 'Aufgabe 12',
    situation: "Sie suchen ein Fahrrad für 150 Euro.",
    options: {
      a: {"type": "classified", "title": "Fahrrad zu verkaufen", "text": "City-Fahrrad\nSehr gut\n150 Euro\nTelefon 0172 456789"},
      b: {"type": "classified", "title": "Fahrrad zu verkaufen", "text": "Mountainbike\n250 Euro\nTelefon 0173 987654"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-013',
    title: 'Aufgabe 13',
    situation: "Sie möchten am Freitagabend tanzen.",
    options: {
      a: {"type": "leisure", "title": "Tanzclub Blau", "text": "Freitag 20 Uhr\nTanzabend\nEintritt 8 Euro"},
      b: {"type": "leisure", "title": "Kulturhaus", "text": "Freitag 18 Uhr\nFilmabend\nEintritt frei"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-014',
    title: 'Aufgabe 14',
    situation: "Sie möchten ein Hotel am See finden.",
    options: {
      a: {"type": "website", "title": "www.hotel-am-see.de", "text": "Hotels am See\nZimmer · Preise · Fotos"},
      b: {"type": "website", "title": "www.hotel-in-der-stadt.de", "text": "Hotels im Zentrum\nZimmer und Frühstück"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-015',
    title: 'Aufgabe 15',
    situation: "Sie wollen wissen, wann die Apotheke geöffnet ist.",
    options: {
      a: {"type": "website", "title": "Apotheke Adler", "text": "Öffnungszeiten:\nMo–Fr 8–19 Uhr\nSa 9–13 Uhr"},
      b: {"type": "website", "title": "Apotheke Rose", "text": "Öffnungszeiten:\nMo–Fr 9–17 Uhr\nSa/So geschlossen"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-016',
    title: 'Aufgabe 16',
    situation: "Sie möchten morgen früh einen Bus zum Bahnhof nehmen.",
    options: {
      a: {"type": "transport", "title": "Bus 12", "text": "Zum Bahnhof\nMo–Fr: 6:10, 6:40, 7:10 Uhr"},
      b: {"type": "transport", "title": "Bus 18", "text": "Zum Stadtpark\nMo–Fr: 6:10, 6:40, 7:10 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-017',
    title: 'Aufgabe 17',
    situation: "Sie suchen einen Kurs für Kinder am Samstag.",
    options: {
      a: {"type": "course", "title": "Musikschule", "text": "Kinderkurs\nSamstag 10–12 Uhr\nAlter: 6–10 Jahre"},
      b: {"type": "course", "title": "Abendkurs", "text": "Samstag 18–20 Uhr\nFür Erwachsene"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-018',
    title: 'Aufgabe 18',
    situation: "Sie möchten heute frisches Obst kaufen.",
    options: {
      a: {"type": "shop", "title": "Markt am Rathaus", "text": "Heute geöffnet bis 18 Uhr\nObst · Gemüse · Brot"},
      b: {"type": "shop", "title": "Supermarkt Klein", "text": "Heute wegen Umbau geschlossen"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-019',
    title: 'Aufgabe 19',
    situation: "Sie möchten am Sonntag ein Museum besuchen.",
    options: {
      a: {"type": "leisure", "title": "Stadtmuseum", "text": "Sonntag 11–17 Uhr\nEintritt 5 Euro"},
      b: {"type": "leisure", "title": "Kunsthaus", "text": "Montag–Samstag 10–18 Uhr\nSonntag geschlossen"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-020',
    title: 'Aufgabe 20',
    situation: "Sie suchen einen Parkplatz in der Nähe des Bahnhofs.",
    options: {
      a: {"type": "parking", "title": "Parkhaus Bahnhof", "text": "24 Stunden geöffnet\nDirekt am Bahnhof\n2 Euro pro Stunde"},
      b: {"type": "parking", "title": "Parkhaus Zentrum", "text": "Nur Montag–Freitag\nIm Zentrum\n3 Euro pro Stunde"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-021',
    title: 'Aufgabe 21',
    situation: "Sie möchten heute Ihre Post abholen.",
    options: {
      a: {"type": "service", "title": "Postfiliale 12", "text": "Heute geöffnet bis 18 Uhr\nPaketabholung möglich"},
      b: {"type": "service", "title": "Postfiliale 7", "text": "Heute geschlossen\nMorgen ab 9 Uhr geöffnet"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-022',
    title: 'Aufgabe 22',
    situation: "Sie suchen einen Friseur, der am Samstag geöffnet ist.",
    options: {
      a: {"type": "service", "title": "Friseur Stern", "text": "Samstag 9–16 Uhr\nTermine: 030 123456"},
      b: {"type": "service", "title": "Salon Lisa", "text": "Montag–Freitag 8–18 Uhr\nSamstag geschlossen"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-023',
    title: 'Aufgabe 23',
    situation: "Sie möchten am Abend mit Freunden Kaffee trinken.",
    options: {
      a: {"type": "restaurant", "title": "Café Abendrot", "text": "Täglich 14–22 Uhr\nKaffee · Tee · Kuchen"},
      b: {"type": "restaurant", "title": "Café Morgen", "text": "Täglich 7–13 Uhr\nFrühstück und Kaffee"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-024',
    title: 'Aufgabe 24',
    situation: "Sie brauchen ein Passfoto.",
    options: {
      a: {"type": "service", "title": "Foto Schnell", "text": "Passfotos\nMontag–Samstag 9–18 Uhr\nOhne Termin"},
      b: {"type": "service", "title": "Foto Studio", "text": "Hochzeitsfotos\nNur nach Termin"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-025',
    title: 'Aufgabe 25',
    situation: "Sie suchen einen Supermarkt, der bis 22 Uhr geöffnet ist.",
    options: {
      a: {"type": "shop", "title": "Supermarkt City", "text": "Montag–Samstag\n7–22 Uhr"},
      b: {"type": "shop", "title": "Supermarkt Nord", "text": "Montag–Freitag\n8–18 Uhr\nSamstag bis 14 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-026',
    title: 'Aufgabe 26',
    situation: "Sie möchten morgen um 10 Uhr einen Deutsch-Test machen.",
    options: {
      a: {"type": "course", "title": "Sprachzentrum A1", "text": "Test: Mittwoch 10 Uhr\nRaum 3"},
      b: {"type": "course", "title": "Sprachzentrum B1", "text": "Test: Mittwoch 15 Uhr\nRaum 5"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-027',
    title: 'Aufgabe 27',
    situation: "Sie möchten am Sonntag einen Blumenstrauß kaufen.",
    options: {
      a: {"type": "shop", "title": "Blumenhaus Rose", "text": "Sonntag 9–13 Uhr\nBlumen und Sträuße"},
      b: {"type": "shop", "title": "Blumen Markt", "text": "Montag–Samstag 8–18 Uhr\nSonntag geschlossen"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-028',
    title: 'Aufgabe 28',
    situation: "Sie suchen eine Bibliothek mit Öffnung am Montagabend.",
    options: {
      a: {"type": "service", "title": "Stadtbibliothek", "text": "Montag 10–20 Uhr\nBücher · Zeitungen · Internet"},
      b: {"type": "service", "title": "Bibliothek West", "text": "Montag 9–14 Uhr\nDienstag geschlossen"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-029',
    title: 'Aufgabe 29',
    situation: "Sie möchten heute Abend einen Tisch im Restaurant reservieren.",
    options: {
      a: {"type": "restaurant", "title": "Restaurant Am Markt", "text": "Heute ab 18 Uhr geöffnet\nReservierung: 030 345678"},
      b: {"type": "restaurant", "title": "Restaurant Grün", "text": "Heute geschlossen\nMorgen ab 17 Uhr geöffnet"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-030',
    title: 'Aufgabe 30',
    situation: "Sie suchen einen Job am Wochenende.",
    options: {
      a: {"type": "job", "title": "Café sucht Hilfe", "text": "Samstag und Sonntag\n10–16 Uhr\nAushilfe gesucht"},
      b: {"type": "job", "title": "Büro sucht Mitarbeiter", "text": "Montag–Freitag\n8–16 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-031',
    title: 'Aufgabe 31',
    situation: "Sie möchten im Sommer in einem Hotel arbeiten.",
    options: {
      a: {"type": "job", "title": "Hotel Seeblick", "text": "Sommer: Hilfe gesucht\nRezeption und Frühstück"},
      b: {"type": "job", "title": "Bäckerei Müller", "text": "Mitarbeiter gesucht\nArbeitszeit: Montag–Freitag"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-032',
    title: 'Aufgabe 32',
    situation: "Sie möchten im Internet eine Zugverbindung finden.",
    options: {
      a: {"type": "website", "title": "www.bahn-auskunft.de", "text": "Züge\nAbfahrten · Ankünfte · Preise"},
      b: {"type": "website", "title": "www.bus-info.de", "text": "Busfahrpläne\nStadtbusse und Tickets"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-033',
    title: 'Aufgabe 33',
    situation: "Sie suchen einen Arzt, der neue Patienten hat.",
    options: {
      a: {"type": "doctor", "title": "Praxis am Park", "text": "Neue Patienten willkommen\nTermin: 0341 778899"},
      b: {"type": "doctor", "title": "Praxis Zentrum", "text": "Keine neuen Patienten\nBitte andere Praxis wählen"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-034',
    title: 'Aufgabe 34',
    situation: "Sie möchten am Samstagabend ins Theater gehen.",
    options: {
      a: {"type": "leisure", "title": "Stadttheater", "text": "Samstag 19 Uhr\nKomödie\nKasse ab 18 Uhr"},
      b: {"type": "leisure", "title": "Theater am Park", "text": "Samstag geschlossen\nSonntag 16 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-035',
    title: 'Aufgabe 35',
    situation: "Sie möchten eine Fahrkarte für den Nahverkehr kaufen.",
    options: {
      a: {"type": "service", "title": "Fahrkarten-Zentrum", "text": "Bus und Bahn\nTickets und Monatskarten"},
      b: {"type": "service", "title": "Reisebüro", "text": "Flüge und Hotels\nKeine Busfahrkarten"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-036',
    title: 'Aufgabe 36',
    situation: "Sie suchen ein Hotel mit Frühstück.",
    options: {
      a: {"type": "hotel", "title": "Hotel Morgenstern", "text": "Zimmer mit Frühstück\nEinzelzimmer ab 55 Euro"},
      b: {"type": "hotel", "title": "Hotel Abend", "text": "Zimmer ohne Frühstück\nEinzelzimmer ab 45 Euro"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-037',
    title: 'Aufgabe 37',
    situation: "Sie möchten einen Deutschkurs am Samstagvormittag.",
    options: {
      a: {"type": "school", "title": "Deutsch am Samstag", "text": "A1-Kurs\nSamstag 9–12 Uhr"},
      b: {"type": "school", "title": "Deutsch am Abend", "text": "A1-Kurs\nMontag und Mittwoch 18–20 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-038',
    title: 'Aufgabe 38',
    situation: "Sie möchten heute ein Geschenk für ein Kind kaufen.",
    options: {
      a: {"type": "shop", "title": "Spiel & Spaß", "text": "Heute 10–19 Uhr\nSpielsachen und Kinderbücher"},
      b: {"type": "shop", "title": "Modehaus", "text": "Heute 10–19 Uhr\nKleidung für Erwachsene"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-039',
    title: 'Aufgabe 39',
    situation: "Sie suchen einen Waschsalon, der heute offen ist.",
    options: {
      a: {"type": "service", "title": "Waschsalon City", "text": "Heute 8–21 Uhr\nWaschen und Trocknen"},
      b: {"type": "service", "title": "Waschsalon Nord", "text": "Heute geschlossen\nMorgen 9–18 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-040',
    title: 'Aufgabe 40',
    situation: "Sie möchten am Sonntag mit dem Schiff fahren.",
    options: {
      a: {"type": "travel", "title": "Schiff Rhein", "text": "Sonntag: Fahrten 11, 14 und 16 Uhr\nTickets am Hafen"},
      b: {"type": "travel", "title": "Schiff See", "text": "Fahrten nur Samstag\n10 und 15 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-041',
    title: 'Aufgabe 41',
    situation: "Sie suchen Informationen über Veranstaltungen in Berlin.",
    options: {
      a: {"type": "website", "title": "www.berlin-heute.de", "text": "Veranstaltungen\nKino · Theater · Konzerte"},
      b: {"type": "website", "title": "www.berlin-wohnungen.de", "text": "Wohnungen\nPreise · Zimmer · Kontakt"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-042',
    title: 'Aufgabe 42',
    situation: "Sie möchten einen Termin beim Zahnarzt am Freitag.",
    options: {
      a: {"type": "doctor", "title": "Zahnarztpraxis Weiß", "text": "Freitag Termine\n8–12 Uhr\nTelefon 030 554433"},
      b: {"type": "doctor", "title": "Zahnarztpraxis Blau", "text": "Freitag geschlossen\nMontag Termine 9–17 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-043',
    title: 'Aufgabe 43',
    situation: "Sie möchten am Abend im Fitnessstudio trainieren.",
    options: {
      a: {"type": "leisure", "title": "Fitness 24", "text": "Heute 6–22 Uhr\nTraining für Erwachsene"},
      b: {"type": "leisure", "title": "Sportclub Mitte", "text": "Heute 9–16 Uhr\nAbends geschlossen"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-044',
    title: 'Aufgabe 44',
    situation: "Sie suchen ein Geschäft für Schuhe.",
    options: {
      a: {"type": "shop", "title": "Schuhhaus Weber", "text": "Schuhe für Damen und Herren\nMo–Sa 9–19 Uhr"},
      b: {"type": "shop", "title": "Mode Weber", "text": "Kleider und Jacken\nMo–Fr 9–18 Uhr"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-045',
    title: 'Aufgabe 45',
    situation: "Sie möchten am Sonntag mit dem Bus zum Flughafen fahren.",
    options: {
      a: {"type": "transport", "title": "Airport-Bus A1", "text": "Sonntag\nAlle 30 Minuten\nZum Flughafen"},
      b: {"type": "transport", "title": "Stadtbus B4", "text": "Sonntag\nAlle 30 Minuten\nZum Zentrum"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-046',
    title: 'Aufgabe 46',
    situation: "Sie suchen einen Ort, an dem Sie einen Brief schicken können.",
    options: {
      a: {"type": "service", "title": "Post & Paket", "text": "Briefmarken\nBriefe und Pakete\nMo–Sa geöffnet"},
      b: {"type": "service", "title": "Büroservice", "text": "Drucken und Kopieren\nKeine Briefmarken"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-047',
    title: 'Aufgabe 47',
    situation: "Sie möchten heute Abend deutsch lernen.",
    options: {
      a: {"type": "school", "title": "Abendkurs Deutsch", "text": "Heute 18–20 Uhr\nDeutsch A1"},
      b: {"type": "school", "title": "Deutsch am Morgen", "text": "Heute 8–10 Uhr\nDeutsch A2"},
    },
    correctAnswer: 'A',
  },
  {
    id: 'teil2-048',
    title: 'Aufgabe 48',
    situation: "Sie suchen einen Supermarkt mit einer Bäckerei.",
    options: {
      a: {"type": "shop", "title": "Supermarkt Markt", "text": "Supermarkt + Bäckerei\n7–21 Uhr"},
      b: {"type": "shop", "title": "Supermarkt Express", "text": "Supermarkt\n7–21 Uhr\nKeine Bäckerei"},
    },
    correctAnswer: 'A',
  },
,

  {
    id: 'teil2-049',
    title: 'Aufgabe 49',
    situation: 'Sie möchten am Sonntagmorgen in einem Café frühstücken.',
    options: {
      a: {
        type: 'restaurant',
        title: 'Café Sonntag',
        text: 'Sonntag 8–13 Uhr\nFrühstück · Kaffee · Brötchen',
      },
      b: {
        type: 'restaurant',
        title: 'Café Abend',
        text: 'Montag–Samstag 14–22 Uhr\nKaffee · Kuchen',
      },
    },
    correctAnswer: 'a',
  },
  {
    id: 'teil2-050',
    title: 'Aufgabe 50',
    situation: 'Sie suchen Informationen über einen Deutschkurs in Hamburg.',
    options: {
      a: {
        type: 'website',
        title: 'www.hamburg-kurs.de',
        text: 'Deutschkurse in Hamburg\nA1 · A2 · B1\nTermine und Preise',
      },
      b: {
        type: 'website',
        title: 'www.hamburg-reise.de',
        text: 'Reisen in Hamburg\nHotels · Ausflüge · Fotos',
      },
    },
    correctAnswer: 'a',
  },
];