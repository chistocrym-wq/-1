import { useState } from 'react';

const WORDS: Record<string, string> = {
  sie:'Вы / они', möchten:'хотеть', einen:'один / какой-то', eine:'одна / какую-то', ein:'один / какой-то', der:'определённый артикль', die:'определённый артикль', das:'определённый артикль', den:'определённый артикль', dem:'этому / определённый артикль',
  kurs:'курс', kurse:'курсы', besuchen:'посещать', tennis:'теннис', tenniskurs:'курс тенниса', schreiben:'писать', an:'в / к', sportverein:'спортивный клуб', warum:'почему', welchen:'какие / который', tagen:'дни', tage:'дни', preis:'цена',
  freund:'друг', freundin:'подруга', freunde:'друзья', freunden:'друзьям', karte:'открытка', wann:'когда', kommen:'приходить / приезжать', wie:'как', reisen:'путешествовать / ехать', zusammen:'вместе', machen:'делать',
  ihre:'ваша / их', ihrer:'вашей / их', tochter:'дочь', sohn:'сын', krank:'больной', schule:'школа', fehlt:'отсутствует', fehlen:'отсутствовать', vom:'с / от', bis:'до', märz:'март', januar:'январь', fragen:'спрашивать', hausaufgaben:'домашние задания',
  september:'сентябрь', hamburg:'Гамбург', touristeninformation:'туристическая информация', informationen:'информация', über:'о / через', museen:'музеи', museum:'музей', konzerte:'концерты', konzert:'концерт', hoteladressen:'адреса отелей', hotel:'отель', adressen:'адреса',
  computer:'компьютер', kaufen:'покупать', markus:'Маркус', bitten:'просить', hilfe:'помощь', zeit:'время', treffen:'встречаться', wo:'где', frau:'госпожа / женщина', herr:'господин / мужчина', eingeladen:'пригласил(а)', geburtstagsfeier:'праздничный день рождения', geburtstag:'день рождения', danken:'благодарить', danke:'спасибо', leider:'к сожалению', können:'мочь', wochenende:'выходные',
  notiz:'записка', kollegin:'коллега', kollege:'коллега', morgen:'завтра', später:'позже', heute:'сегодня', arbeiten:'работать', länger:'дольше', juni:'июнь', nürnberg:'Нюрнберг', party:'вечеринка', freitag:'пятница', kleine:'маленькая', laden:'приглашать', einladen:'приглашать', beginnt:'начинается', beginnen:'начинаться', gäste:'гости', mitbringen:'приносить с собой',
  fotokurs:'фотокурс', volkshochschule:'народный университет', viel:'много / сколько', kostet:'стоит', kosten:'стоить', juli:'июль', dienstlich:'по работе', köln:'Кёльн', neuer:'новый', termin:'встреча / назначенный срок', august:'август', fernseher:'телевизор', internet:'интернет', verkäufer:'продавец', heißt:'зовут / называется', abholen:'забирать',
  anna:'Анна', tobias:'Тобиас', feiern:'праздновать', sommer:'лето', ferienjob:'работа на каникулах', café:'кафе', hoch:'высокий', lohn:'зарплата', sonntag:'воскресенье', nachbar:'сосед', nachbarn:'соседи', entschuldigung:'извинение', entschuldigen:'извиняться', kaffee:'кофе', trinken:'пить', auto:'автомобиль', mieten:'арендовать', autovermietung:'прокат автомобилей', für:'для / на', viele:'много',
  neue:'новая', mittwoch:'среда', helfen:'помогать', montag:'понедельник', schnell:'быстро', antworten:'отвечать', november:'ноябрь', münchen:'Мюнхен', theater:'театр', schwimmkurs:'курс плавания', schwimmen:'плавать', sportzentrum:'спортивный центр', anmelden:'регистрироваться', muss:'должен / нужно', man:'человек / безличное «нужно»', gehen:'идти', lehrerin:'учительница', hannover:'Ганновер', ankunft:'прибытие', uhr:'час', handy:'мобильный телефон', funktioniert:'работает', weg:'дорога / прочь',
  grillparty:'вечеринка с барбекю', wagner:'Вагнер', adresse:'адрес', uhrzeit:'время', malkurs:'курс рисования', malen:'рисовать', findet:'проходит / происходит', familie:'семья', schulz:'Шульц', allen:'всем', geht:'идёт / дела', dortmund:'Дортмунд', hotelpreisen:'ценах на отели', sehenswürdigkeiten:'достопримечательности', dresden:'Дрезден', oktober:'октябрь', stadtplan:'карта города', schlüssel:'ключ', geben:'давать', laptop:'ноутбук', garantie:'гарантия', picknick:'пикник', wer:'кто', mehr:'больше', kursleiter:'руководитель курса', mai:'май', kulturprogramm:'культурная программа', stuttgart:'Штутгарт', april:'апрель', ausstellungen:'выставки', ausstellung:'выставка', probleme:'проблемы', problem:'проблема', englischkurs:'курс английского', englisch:'английский', anmeldung:'регистрация', erfurt:'Эрфурт', schreibtisch:'письменный стол', fischer:'Фишер', computergeschäft:'компьютерный магазин', krüger:'Крюгер', abendessen:'ужин', friseur:'парикмахер', friseursalon:'парикмахерский салон', haarschnitt:'стрижка', dienstag:'вторник', becker:'Беккер', oliver:'Оливер', bonn:'Бонн', nina:'Нина', gitarrenkurs:'курс игры на гитаре', gitarre:'гитара', hund:'собака', sehen:'видеть / посмотреть', mutter:'мама', deutschlehrer:'учитель немецкого', deutsch:'немецкий', vier:'четыре', wegfahren:'уезжать', fahren:'ехать', kleiderschrank:'шкаф для одежды', schrank:'шкаф'
};

function normalize(word: string) { return word.toLowerCase().replace(/[.,!?;:()„“\"']/g, '').trim(); }

export function GermanWordTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState<string | null>(null);
  return <span className="inline leading-7">{text.split(/(\s+)/).map((token, i) => {
    if (/^\s+$/.test(token)) return <span key={i}>{token}</span>;
    const clean = normalize(token), translation = WORDS[clean];
    if (!translation) return <span key={i}>{token}</span>;
    const id = `${i}-${clean}`, active = open === id;
    return <span key={i} className="relative inline-block">
      <button type="button" aria-label={`Перевод: ${clean}`} onClick={() => setOpen(active ? null : id)} onMouseEnter={() => setOpen(id)} onMouseLeave={() => setOpen(null)} className="cursor-help rounded px-0.5 underline decoration-dotted decoration-slate-400 underline-offset-2 hover:bg-amber-50">{token}</button>
      {active && <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-30 w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium leading-4 text-white shadow-lg">{translation}</span>}
    </span>;
  })}</span>;
}
