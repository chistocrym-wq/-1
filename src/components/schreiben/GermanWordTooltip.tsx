import { useState } from 'react';

const WORDS: Record<string,string> = {
  sie:'Вы / они', sie:'Вы / они', möchten:'хотеть', einen:'один / какой-то', eine:'одна / какую-то', ein:'один / какой-то', der:'артикль', die:'артикль', das:'артикль', den:'артикль', dem:'артикль',
  ihr:'ваш / вашa', ihre:'ваша / их', ihrer:'вашей / их', Ihnen:'вам', ihnen:'им', ich:'я', wir:'мы', Sie:'Вы', mein:'мой', mein:'мой',
  kurs:'курс', kurse:'курсы', besuchen:'посещать', besucht:'посещает', tennis:'теннис', tenniskurs:'курс тенниса', schreiben:'писать', schreibt:'пишет', an:'в / к', nach:'после / в', von:'от / из', aus:'из', bei:'у / при', für:'для / на', mit:'с', ohne:'без', über:'о / через', auf:'на', in:'в / на', im:'в', am:'в / на', zum:'к / для', zur:'к / в',
  sportverein:'спортивный клуб', warum:'почему', welchen:'какой / который', welchem:'какому', welcher:'какая / которая', welchen:'какие / которых', tagen:'дни', tage:'дни', preis:'цена',
  freund:'друг', freundin:'подруга', freunde:'друзья', freunden:'друзьям', karte:'открытка', wann:'когда', kommen:'приходить / приезжать', kommt:'приходит / приезжает', wie:'как', reisen:'путешествовать / ехать', zusammen:'вместе', machen:'делать', was:'что', möchten:'хотеть', machen:'делать',
  tochter:'дочь', sohn:'сын', kinder:'дети', kind:'ребёнок', emma:'Эмма', leon:'Леон', marie:'Мари', tim:'Тим', krank:'больной', schule:'школа', fehlt:'отсутствует', fehlen:'отсутствовать', vom:'с / от', bis:'до', märz:'март', januar:'январь', fragen:'спрашивать', hausaufgaben:'домашние задания', nach:'о / по',
  september:'сентябрь', hamburg:'Гамбург', touristeninformation:'туристическая информация', informationen:'информация', museum:'музей', museen:'музеи', konzerte:'концерты', konzert:'концерт', hoteladressen:'адреса отелей', hotel:'отель', adressen:'адреса',
  computer:'компьютер', kaufen:'покупать', gekauft:'купленный', markus:'Маркус', bitten:'просить', hilfe:'помощь', zeit:'время', treffen:'встречаться', wo:'где', frau:'госпожа / женщина', herr:'господин / мужчина', eingeladen:'пригласил(а)', geburtstagsfeier:'празднование дня рождения', geburtstag:'день рождения', danken:'благодарить', danke:'спасибо', leider:'к сожалению', können:'мочь', konnte:'мог(ла)', nicht:'не', wochenende:'выходные',
  notiz:'записка', kollegin:'коллега', kollege:'коллега', morgen:'завтра', später:'позже', heute:'сегодня', arbeiten:'работать', arbeitet:'работает', länger:'дольше',
  juni:'июнь', nürnberg:'Нюрнберг', party:'вечеринка', freitag:'пятница', kleine:'маленькая', laden:'приглашать', einladen:'приглашать', beginnt:'начинается', beginnen:'начинаться', gäste:'гости', mitbringen:'приносить с собой',
  fotokurs:'фотокурс', volkshochschule:'народный университет', viel:'много / сколько', kostet:'стоит', kosten:'стоить', juli:'июль', dienstlich:'по работе', köln:'Кёльн', neuer:'новый', termin:'встреча / назначенный срок', august:'август', fernseher:'телевизор', internet:'интернет', verkäufer:'продавец', heißt:'зовут', abholen:'забирать',
  anna:'Анна', tobias:'Тобиас', feiern:'праздновать', sommer:'лето', ferienjob:'работа на каникулах', café:'кафе', lohn:'зарплата', sonntag:'воскресенье', nachbar:'сосед', nachbarn:'соседи', entschuldigung:'извинение', entschuldigen:'извиняться', kaffee:'кофе', trinken:'пить', auto:'автомобиль', mieten:'арендовать', autovermietung:'прокат автомобилей', viele:'много',
  mittwoch:'среда', helfen:'помогать', montag:'понедельник', schnell:'быстро', antworten:'отвечать', november:'ноябрь', münchen:'Мюнхен', theater:'театр', kino:'кино', wollten:'хотели', schwimmkurs:'курс плавания', schwimmen:'плавать', sportzentrum:'спортивный центр', anmelden:'регистрироваться', muss:'должен / нужно', müssen:'должны / нужно', man:'кто-то / человек', gehen:'идти', gehen:'идти', lehrerin:'учительница', hannover:'Ганновер', ankunft:'прибытие', uhr:'час', handy:'мобильный телефон', funktioniert:'работает', weg:'дорога / прочь',
  grillparty:'вечеринка с барбекю', wagner:'Вагнер', adresse:'адрес', uhrzeit:'время', malkurs:'курс рисования', malen:'рисовать', findet:'проходит', familie:'семья', schulz:'Шульц', allen:'всем', geht:'идёт / дела', dortmund:'Дортмунд', hotelpreisen:'ценах на отели', sehenswürdigkeiten:'достопримечательности', dresden:'Дрезден', oktober:'октябрь', stadtplan:'карта города', schlüssel:'ключ', geben:'давать', laptop:'ноутбук', garantie:'гарантия', picknick:'пикник', wer:'кто', mehr:'больше', kursleiter:'руководитель курса', mai:'май', kulturprogramm:'культурная программа', stuttgart:'Штутгарт', april:'апрель', ausstellungen:'выставки', ausstellung:'выставка', probleme:'проблемы', problem:'проблема', englischkurs:'курс английского', englisch:'английский', anmeldung:'регистрация', erfurt:'Эрфурт', schreibtisch:'письменный стол', fischer:'Фишер', computergeschäft:'компьютерный магазин', krüger:'Крюгер', abendessen:'ужин', friseur:'парикмахер', friseursalon:'парикмахерский салон', haarschnitt:'стрижка', dienstag:'вторник', becker:'Беккер', oliver:'Оливер', bonn:'Бонн', nina:'Нина', gitarrenkurs:'курс игры на гитаре', gitarre:'гитара', hund:'собака', sehen:'видеть / посмотреть', mutter:'мама', deutschlehrer:'учитель немецкого', deutsch:'немецкий', vier:'четыре', fahren:'ехать', fahren:'ехать', kleiderschrank:'шкаф для одежды', schrank:'шкаф',
  heute:'сегодня', abends:'вечером', abend:'вечер', später:'позже', wieder:'снова / обратно', bald:'скоро', schon:'уже', leider:'к сожалению', denn:'потому что / ведь', aber:'но', und:'и', oder:'или', auch:'также', noch:'ещё', sehr:'очень', nur:'только', eine:'одна / какую-то', einen:'один / какой-то', zu:'к / слишком', dann:'тогда', jetzt:'сейчас', morgen:'завтра', heute:'сегодня',
};

function normalize(word:string){return word.toLowerCase().replace(/[.,!?;:()„“\"']/g,'').trim();}

export function GermanWordTooltip({text}:{text:string}){
  const [open,setOpen]=useState<string|null>(null);
  return <span className="inline leading-7">{text.split(/(\s+)/).map((token,i)=>{
    if(/^\s+$/.test(token)) return <span key={i}>{token}</span>;
    const clean=normalize(token), translation=WORDS[clean];
    if(!translation) return <span key={i}>{token}</span>;
    const id=`${i}-${clean}`, active=open===id;
    return <span key={i} className="relative inline-block">
      <button type="button" aria-label={`Перевод: ${clean}`} onClick={()=>setOpen(active?null:id)} onMouseEnter={()=>setOpen(id)} onMouseLeave={()=>setOpen(null)} className="cursor-help rounded px-0.5 underline decoration-dotted decoration-slate-400 underline-offset-2 hover:bg-amber-50">{token}</button>
      {active&&<span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-30 w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium leading-4 text-white shadow-lg">{translation}</span>}
    </span>;
  })}</span>;
}
