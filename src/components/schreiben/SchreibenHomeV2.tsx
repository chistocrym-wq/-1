import { useState } from 'react';
import { BarChart3, ChevronRight, Eye, FileText, Lightbulb, PenLine } from 'lucide-react';
import { useSchreibenProgress } from '@/hooks/useSchreibenProgress';
import { SchreibenSecrets } from '@/components/schreiben/SchreibenSecrets';

interface Props { onStartTeil1: () => void; onStartTeil2: () => void; }

function Card({ title, text, textRu, total, progress, today, average, onStart, icon: Icon, onSecrets, showRussian }: {
  title: string; text: string; textRu: string; total: number; progress: number; today: number; average: number | null;
  onStart: () => void; icon: typeof FileText; onSecrets?: () => void; showRussian: boolean;
}) {
  const percent = Math.min((progress / total) * 100, 100);
  return (
    <section className="schreiben-part-card">
      <div className="schreiben-part-icon"><Icon className="h-5 w-5" /></div>
      <h2>{title}</h2>
      <p className="schreiben-part-text">{text}</p>
      {showRussian && <div className="schreiben-russian-box">{textRu}</div>}
      <div className="schreiben-stat-grid">
        <div><span>Heute</span><strong>{today}</strong><small>erledigt</small></div>
        <div><span>Durchschnitt</span><strong>{average === null ? '—' : `${average}%`}</strong><small>heute</small></div>
        <div><span>Insgesamt</span><strong>{progress}</strong><small>von {total}</small></div>
        <div><span>Fortschritt</span><strong>{Math.round(percent)}%</strong><small>im Teil</small></div>
      </div>
      <div className="schreiben-progress-line"><div style={{ width: `${percent}%` }} /></div>
      <div className="schreiben-part-actions">
        <button type="button" onClick={onStart} className="schreiben-main-button"><Icon className="h-4 w-4" /> Üben <ChevronRight className="h-4 w-4" /></button>
        {onSecrets && <button type="button" onClick={onSecrets} className="schreiben-secondary-button"><Lightbulb className="h-4 w-4" /> Erfolgs-Tipps</button>}
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
          onClick={() => setShowRussian((v) => !v)}
          className="schreiben-translate-button"
          aria-label={showRussian ? 'Перевод скрыть' : 'Перевод показать'}
          title={showRussian ? 'Перевод скрыть' : 'Перевод показать'}
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      <section className="schreiben-intro">
        <div className="schreiben-intro-top">
          <h2>Schreiben — schriftlicher Teil</h2>
        </div>
        <p>Der schriftliche Teil besteht aus zwei Teilen: In Teil 1 füllen Sie Formulare aus. In Teil 2 schreiben Sie kurze Nachrichten oder Briefe. Lesen Sie die Situation aufmerksam und bearbeiten Sie alle Punkte.</p>
        {showRussian && <div className="schreiben-russian-box">Письменная часть состоит из двух частей: в Teil 1 вы заполняете формуляры, а в Teil 2 пишете короткие сообщения или письма. Внимательно прочитайте ситуацию и выполните все пункты.</div>}
      </section>

      <Card
        title="Teil 1 · Formulare"
        text="Lesen Sie die Situation und übertragen Sie fünf wichtige Angaben in das Formular. Nach jeder Aufgabe zeigt Otto Ihnen das Ergebnis."
        textRu="Прочитайте ситуацию и перенесите пять важных сведений в формуляр. После каждого задания Отто покажет результат."
        total={30} progress={Math.min(p1.progress.totalCompleted, 30)} today={p1.progress.dailyCompleted} average={p1.averageToday}
        onStart={onStartTeil1} icon={FileText} showRussian={showRussian}
      />
      <Card
        title="Teil 2 · Briefe"
        text="Bearbeiten Sie eine Aufgabe mit drei Punkten und schreiben Sie eine kurze Nachricht oder einen kurzen Brief mit etwa 30 Wörtern."
        textRu="Выполните задание из трёх пунктов и напишите короткое сообщение или письмо примерно на 30 слов."
        total={80} progress={Math.min(p2.progress.totalCompleted, 80)} today={p2.progress.dailyCompleted} average={p2.averageToday}
        onStart={onStartTeil2} icon={PenLine} onSecrets={() => setSecretsOpen(true)} showRussian={showRussian}
      />

      <section className="schreiben-stat-info">
        <BarChart3 className="h-5 w-5" />
        <div>
          <strong>Statistik wird automatisch gespeichert</strong>
          <p>Für Teil 1 und Teil 2 werden erledigte Aufgaben, heutige Aufgaben, der heutige Durchschnitt und der Gesamtfortschritt gespeichert. Die Daten bleiben auch nach dem Neuladen auf diesem Gerät erhalten.</p>
          {showRussian && <div className="schreiben-russian-box">Статистика Teil 1 и Teil 2 сохраняется автоматически: выполненные задания, задания за сегодня, средний балл за сегодня и общий прогресс. После перезагрузки данные остаются на этом устройстве.</div>}
        </div>
      </section>

      <SchreibenSecrets open={secretsOpen} onClose={() => setSecretsOpen(false)} />
    </div>
  );
}
