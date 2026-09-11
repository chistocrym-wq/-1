# OTTO — CONTENT TRANSFER PACKAGE

Purpose: перенос учебного контента тренажёра A1 в другой проект без UI/дизайна и без секретов.

## ОБЯЗАТЕЛЬНО

- LESEN НЕ ПЕРЕНОСИТЬ И НЕ ИСПОЛЬЗОВАТЬ. Текущий LESEN содержит задания, которые пользователь считает неправильными.
- Не переносить CSS, компоненты интерфейса, роутинг, layout, изображения Otto, оформление, localStorage UI-логику.
- Не переносить `.env`, API keys, Vercel secrets, токены или пароли.
- Учебный контент переносить как данные; новый проект должен самостоятельно подключить его к своему UI.
- Не исправлять и не «улучшать» исходные задания при переносе. Сохранять текущий контент как source of truth.

## 1. HÖREN

Источник данных:
`src/data/listening.ts`

Raw URL:
https://raw.githubusercontent.com/chistocrym-wq/-1/main/src/data/listening.ts

Git blob SHA:
`614eaa2f7ab64182c0ff6861fb18ce6ce189553c`

Перенести все записи и поля этого файла как данные HÖREN. Также перенести связанные аудиофайлы из `public/audio/`, только если они используются конкретными HÖREN-заданиями. Не переносить LESEN.

## 2. SCHREIBEN — TEIL 1

Основной актуальный источник:
`src/data/schreibenTeil1Imported.ts`

Raw URL:
https://raw.githubusercontent.com/chistocrym-wq/-1/main/src/data/schreibenTeil1Imported.ts

Git blob SHA:
`5e04c2eb58e1191c4bb8cff1d203ced5b669587b`

Это полный набор исходных формуляров Teil 1. Переносить тексты ситуаций, поля, варианты, правильные ответы и структуру задания.

Дополнительный упрощённый/шаблонный источник:
`src/data/schreibenTeil1.ts`

Raw URL:
https://raw.githubusercontent.com/chistocrym-wq/-1/main/src/data/schreibenTeil1.ts

Git blob SHA:
`67452a10fc9f45b11149fb265bde9396a3ad346b`

При конфликте данных source of truth для полноформатных заданий — `schreibenTeil1Imported.ts`.

## 3. SCHREIBEN — TEIL 2

Источник:
`src/data/schreiben/teil2.ts`

Raw URL:
https://raw.githubusercontent.com/chistocrym-wq/-1/main/src/data/schreiben/teil2.ts

Git blob SHA:
`399910d0be46af5b1ee273952420b94544d6b470`

Содержит ровно 80 оригинальных заданий Teil 2: ситуация + 3 обязательных пункта. Перенести все 80 без переформулировки.

Важная структура текущих данных:
- `id`
- `title`
- `situation`
- `points[]`
- `minWords = 25`
- `maxWords = 45`

Для текущей AI-проверки тренажёр дополнительно требует минимум 30 слов. Это правило проверки, а не изменение текста задания.

Русские ситуации/переводы:
`src/data/schreiben/teil2SituationRu.ts`

Raw URL:
https://raw.githubusercontent.com/chistocrym-wq/-1/main/src/data/schreiben/teil2SituationRu.ts

Git blob SHA:
`9fa67be90c45ce221076aad17b5fffe8a4b3f0a5`

Перенести как отдельное поле перевода/подсказки, не заменяя немецкий оригинал.

## 4. SCHREIBEN — AI CHECKER

Источник серверной логики/методики проверки:
`api/check-schreiben.js`

Raw URL:
https://raw.githubusercontent.com/chistocrym-wq/-1/main/api/check-schreiben.js

Git blob SHA:
`4829536fb69fef51937851968544a4d1c1fefd61`

Из этого файла переносится только методика и system prompt проверки, НЕ API key и НЕ привязка к конкретному Vercel-проекту.

Текущие правила:
- модель проверки: `gpt-5`;
- structured JSON output;
- каждый обязательный пункт: 3 / 1.5 / 0;
- communicative design: 1 / 0.5 / 0;
- итог = earned / maximum * 100;
- грамматика/артикли/окончания/порядок слов/орфография не уменьшают content score, если смысл понятен и пункт выполнен;
- минимум 30 слов для текущего trainer checker;
- принимаются естественные варианты A1, не требуется дословный model answer;
- corrections: только реальные ошибки, максимум 6;
- `original` в correction должен быть дословной цитатой ученика;
- для пропущенного пункта `original = "Не выполнено"`;
- объяснение: термин немецкой грамматики + простое объяснение на русском;
- feedback: короткий, дружелюбный, немецкий + русский.

## 5. SPRECHEN

Источник данных:
`src/data/speaking.ts`

Raw URL:
https://raw.githubusercontent.com/chistocrym-wq/-1/main/src/data/speaking.ts

Git blob SHA:
`ca303494dffc0d7a6850dcab16cb2d175ed5c703`

Актуальная логика Teil 1 содержит взрослый вариант пунктов:
- Name?
- Alter?
- Land?
- Wohnort?
- Beruf?
- Sprachen?
- Hobby?

Не использовать старый вариант `Schule?`.

## 6. SPRECHEN — AI CHECKER

Источник:
`api/check-sprechen.js`

Raw URL:
https://raw.githubusercontent.com/chistocrym-wq/-1/main/api/check-sprechen.js

Git blob SHA:
`cde53f1a924254eee5ebbcfc6784e42124f8a52b`

Переносится методика и system prompt, без секретов и deployment-specific кода.

Архитектура:
1. браузер записывает речь;
2. аудио отправляется после завершения записи;
3. speech-to-text получает техническую транскрипцию;
4. дешёвая модель проверяет каждый обязательный пункт отдельно;
5. результат содержит `full / partial / missing`;
6. content score считается по покрытию пунктов;
7. отдельно показывается ориентир понятности речи.

Модели текущей реализации:
- STT: `gpt-4o-mini-transcribe`;
- fallback STT: `whisper-1`;
- evaluation: `gpt-4o-mini`.

Важно: это не настоящий фонетический phoneme score. Понятность/произношение оцениваются отдельно по сигналу распознавания речи. Не исправлять «орфографию» транскрипта и не выдавать письменную оценку.

## 7. ТИПЫ ДАННЫХ

Целевой переносимый формат может быть адаптирован под новый проект, но смысл должен сохраниться.

Рекомендуемая структура:
```ts
{
  id: string,
  module: 'hoeren' | 'schreiben' | 'sprechen',
  teil?: 1 | 2,
  type?: string,
  difficulty?: string,
  title?: string,
  situation?: string,
  instruction?: string,
  question?: string,
  points?: string[],
  fields?: unknown[],
  options?: string[],
  correctAnswer?: unknown,
  explanation?: string,
  translationRu?: string,
  audio?: string,
  topic?: string,
  grammarFocus?: string,
  vocabulary?: string[]
}
```

Не нужно сохранять этот TypeScript-тип буквально, если в новом проекте другая схема. Нужно сделать адаптер данных.

## 8. ЧТО ИМЕННО НЕЛЬЗЯ ПЕРЕНОСИТЬ

- `src/data/lesen/**`
- `src/data/reading.ts`
- LESEN-компоненты и задания
- CSS и визуальную тему
- Dashboard/Home UI
- изображения Otto
- routing/layout
- `.env`
- `OPENAI_API_KEY`
- Vercel secrets
- любые токены/пароли

## 9. ИНТЕГРАЦИОННЫЙ КОНТРАК ДЛЯ ДРУГОГО ПРОЕКТА

1. Сначала импортировать HÖREN, SCHREIBEN Teil 1, SCHREIBEN Teil 2 и SPRECHEN.
2. Не менять тексты заданий.
3. Не добавлять LESEN из этого пакета.
4. Для объективных заданий использовать детерминированную проверку по answer/correctAnswer.
5. Для свободного Schreiben использовать AI checker по правилам раздела 4.
6. Для Sprechen использовать STT + point-by-point coverage evaluation по разделу 6.
7. API key хранить только на сервере в environment variable нового проекта.
8. Не вставлять API key в клиентский код, JSON, данные или Git.
9. Все AI-запросы должны иметь возможность заменить модель через server-side configuration.
10. UI нового проекта должен быть независимым от этого пакета.

## 10. SOURCE OF TRUTH

Этот пакет создан на основе состояния репозитория `chistocrym-wq/-1` на commit:
`d4a756b3b7be2b812564106d863ed3aca6f2bd0e`

Дата состояния: 2026-09-10.

При переносе сначала брать перечисленные выше файлы. Если новый проект уже имеет собственную схему, создавать адаптер, а не переписывать учебный контент.
