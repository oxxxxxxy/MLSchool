import React, { useState } from 'react';
import { Mail, ShieldCheck, AlertTriangle } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface EmailItem {
  id: number;
  subject: string;
  spamProbability: number;
  isRealSpam: boolean;
}

const EMAILS: EmailItem[] = [
  { id: 1, subject: 'Вам начислен выигрыш 1 000 000 $! Срочно забери!', spamProbability: 95, isRealSpam: true },
  { id: 2, subject: 'Домашнее задание по геометрии к понедельнику', spamProbability: 5, isRealSpam: false },
  { id: 3, subject: 'Скидки 90% только сегодня на все кроссовки!', spamProbability: 75, isRealSpam: true },
  { id: 4, subject: 'Привет! Пойдешь сегодня кататься на великах?', spamProbability: 12, isRealSpam: false },
  { id: 5, subject: 'Подтверждение регистрации на турнире по шахматам', spamProbability: 25, isRealSpam: false },
  { id: 6, subject: 'Подозрительный вход в ваш аккаунт из другой страны', spamProbability: 55, isRealSpam: false }
];

export const SpamFilterSimulator: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(50); // %

  const stats = EMAILS.reduce(
    (acc, email) => {
      const isMarkedSpam = email.spamProbability >= threshold;
      if (isMarkedSpam && email.isRealSpam) acc.truePositive++;
      else if (!isMarkedSpam && !email.isRealSpam) acc.trueNegative++;
      else if (isMarkedSpam && !email.isRealSpam) acc.falsePositive++; // Blocked real email!
      else if (!isMarkedSpam && email.isRealSpam) acc.falseNegative++; // Missed spam!
      return acc;
    },
    { truePositive: 0, trueNegative: 0, falsePositive: 0, falseNegative: 0 }
  );

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono text-[#8b949e] uppercase">
            Эксперимент 2
          </span>
          <h3 className="text-sm font-semibold text-[#c9d1d9]">Порог классификации: Настройка спам-фильтра</h3>
        </div>
        <span className="text-xs font-mono font-bold text-[#58a6ff] bg-[#0d1117] px-2.5 py-1 rounded border border-[#30363d]">
          Порог: {threshold}%
        </span>
      </div>

      <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[#8b949e]">Порог срабатывания спам-фильтра:</span>
          <span className="text-[#58a6ff] font-semibold">{threshold}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="90"
          step="5"
          value={threshold}
          onChange={e => setThreshold(Number(e.target.value))}
          className="w-full accent-[#58a6ff] cursor-pointer"
        />
      </div>

      {/* Email Inbox Preview */}
      <div className="space-y-1.5">
        {EMAILS.map(mail => {
          const isClassifiedSpam = mail.spamProbability >= threshold;
          const isError = isClassifiedSpam !== mail.isRealSpam;

          return (
            <div
              key={mail.id}
              className={`p-2.5 rounded border text-xs flex items-center justify-between gap-3 ${
                isClassifiedSpam
                  ? 'bg-[#da3633]/10 border-[#f85149]/40 text-[#f85149]'
                  : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-[#8b949e]" />
                <span className="leading-snug">{mail.subject}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px]">
                <span className="text-[#8b949e]">Вероятность: {mail.spamProbability}%</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isClassifiedSpam ? 'bg-[#da3633]/20 text-[#f85149]' : 'bg-[#238636]/20 text-[#3fb950]'
                }`}>
                  {isClassifiedSpam ? '⛔ СПАМ' : '📥 ВО ВХОДЯЩИХ'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
        <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
          <span className="text-[10px] text-[#8b949e] block">Спам пойман</span>
          <span className="text-sm font-bold text-[#3fb950]">{stats.truePositive}</span>
        </div>
        <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
          <span className="text-[10px] text-[#8b949e] block">Чистые письма</span>
          <span className="text-sm font-bold text-[#3fb950]">{stats.trueNegative}</span>
        </div>
        <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
          <span className="text-[10px] text-[#8b949e] block">Ложные тревоги</span>
          <span className={`text-sm font-bold ${stats.falsePositive > 0 ? 'text-[#f85149]' : 'text-[#8b949e]'}`}>
            {stats.falsePositive}
          </span>
        </div>
        <div className="p-2 rounded bg-[#0d1117] border border-[#30363d]">
          <span className="text-[10px] text-[#8b949e] block">Пропущен спам</span>
          <span className={`text-sm font-bold ${stats.falseNegative > 0 ? 'text-[#f85149]' : 'text-[#8b949e]'}`}>
            {stats.falseNegative}
          </span>
        </div>
      </div>
    </div>
  );
};
