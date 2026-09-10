import { useState } from 'react';
import { BarChart3, ChevronRight, Eye, FileText, Lightbulb, PenLine } from 'lucide-react';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import { SchreibenSecrets } from '@/components/schreiben/SchreibenSecrets';

interface Props { onStartTeil1: () => void; onStartTeil2: () => void; }

function Card({ title, text, total, progress, today, average, onStart, icon: Icon, onSecrets }: {
  title: string; text: string; total: number; progress: number; today: number; average: number | null;
  onStart: () => void; icon: typeof FileText; onSecrets?: () => void;
}) {
  const percent = Math.min((progress / total) * 100, 100);
  return (
    <section className="schreiben-part-card">
      <div className="schreiben-part-icon"><Icon className="h-5 w-5" /></div>
      <h2>{title}</h2>
      <p className="schreiben-part-text">{text}</p>
      <div className="schreiben-stat-grid">
        <div><span>Сегодня</span><strong>{today}</strong><small>выполнено</small></div>
        <div><span>Средний балл</span><strong>{average === null ? '—' : `${average}%`}</strong><small>за сегодня</small></div>
        <div><span>Всего выполнено</span><strong>{progress}</strong><small>из {total}</small></div>
        <div><span>Прогресс</span><strong>{Math.round(percent)}%</strong><small>по разделу</small></div>
      </div>
      <div className="schreiben-progress-line"><div style={{ width: `${percent}%` }} /></div>
      <div className="schreiben-part-actions">
        <button type="button" onClick={onStart} className="schreiben-main-button"><Icon className="h-4 w-4" /> Тренироваться <ChevronRight className="h-4 w-4" /></button>
        {onSecrets && <button type="button" onClick={onSecrets} className="schreiben-secondary-button"><Lightbulb className="h-4 w-4" /> Секреты успеха написания писем</button>}
      </div>
    </section>
  );
}

export function SchreibenHomeV2({ onStartTeil1, onStartTeil2 }: Props) {
  const [secretsOpen, setSecretsOpen] = useState(false);
  const [showRussian, setShowRussian] = useState(false);
  const p1 = useSchreibenProgress(1, 30);
  const p2 = useSchreibenProgress(2, 80);

  return (
    <div className="schreiben-home animate-fade-in">
      <div className="schreiben-heading">
        <div className="schreiben-heading-icon"><PenLine className="h-5 w-5" /></div>
        <div><span>Goethe-Zertifikat A1</span><h1>Schreiben</h1></div>
        <button
          type="button"
          onClick={() => setShowRussian(!showRussian)}
          className="schreiben-translate-button"
          aria-label={showRussian ? 'Скрыть перевод' : 'Показать перевод'}
          title={showRussian ? 'Скрыть перевод' : 'Показать перевод'}
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      <section className="schreiben-intro">
        <div className="schreiben-intro-top">
          <h2>Schreiben — письменная часть</h2>
          <button
            type="button"
            onClick={() => setShowRussian(!showRussian)}
            className="schreiben-translate-button schreiben-inline-translate"
            aria-label={showRussian ? 'Скрыть перевод' : 'Показать перевод'}
            title={showRussian ? 'Скрыть перевод' : 'Показать перевод'}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
        <p>Модуль состоит из двух частей: в Teil 1 вы заполняете формуляры, в Teil 2 пишете короткие письма и сообщения. В обоих разделах важно внимательно понять ситуацию и выполнить все требуемые пункты.</p>
        {showRussian && <div className="schreiben-russian-box">Письменная часть экзамена состоит из двух частей. Сначала вы переносите нужные сведения в формуляр, затем пишете короткое сообщение или письмо. Здесь можно тренироваться, видеть результат и сохранять статистику.</div>}
      </section>

      <Card title="Formulare" text="Прочитайте ситуацию и перенесите пять важных сведений в формуляр. После каждого задания Отто покажет результат." total={30} progress={Math.min(p1.progress.totalCompleted, 30)} today={p1.progress.dailyCompleted} average={p1.averageToday} onStart={onStartTeil1} icon={FileText} />
      <Card title="Briefe" text="Выполните задание из трёх пунктов и напишите короткое сообщение или письмо примерно на 30 слов." total={80} progress={Math.min(p2.progress.totalCompleted, 80)} today={p2.progress.dailyCompleted} average={p2.averageToday} onStart={onStartTeil2} icon={PenLine} onSecrets={() => setSecretsOpen(true)} />

      <section className="schreiben-stat-info">
        <BarChart3 className="h-5 w-5" />
        <div><strong>Статистика сохраняется автоматически</strong><p>Для Teil 1 и Teil 2 сохраняются: общее количество выполненных заданий, количество выполненных сегодня, средний балл за сегодня и общий прогресс. После перезагрузки данные остаются на устройстве.</p></div>
      </section>

      <SchreibenSecrets open={secretsOpen} onClose={() => setSecretsOpen(false)} />
    </div>
  );
}
