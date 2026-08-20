import React, { useState } from 'react';
import { Target, Tag, Layers, ArrowRight } from 'lucide-react';
import { MathText } from '../../math/MathText';

export const MLSuperpowersMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'regression' | 'classification' | 'clustering'>('regression');

  const data = {
    regression: {
      title: '🎯 Задача Регрессии: Предсказание Чисел',
      outputType: 'Непрерывное число (y ∈ ℝ)',
      question: '«Сколько именно?»',
      realTech: [
        { name: '🚗 Беспилотный транспорт', role: 'Расчет скорости и угла поворота руля в каждый момент времени' },
        { name: '🏥 Медицина', role: 'Прогноз уровня сахара в крови или давления по датчикам' },
        { name: '🌦️ Метеорология', role: 'Прогноз точной температуры, влажности и скорости ветра' }
      ]
    },
    classification: {
      title: '🏷️ Задача Классификации: Выбор Категории',
      outputType: 'Дискретный класс (Класс A / Класс B / Класс C)',
      question: '«К какому типу это относится?»',
      realTech: [
        { name: '👁️ Computer Vision (CV)', role: 'Распознавание дорожных знаков, пешеходов и лиц (FaceID)' },
        { name: '💬 Языковые модели (LLM)', role: 'ChatGPT выбирает самое подходящее слово из словаря' },
        { name: '🛡️ Кибербезопасность', role: 'Определение: спам/не спам, вирус/чистый файл' }
      ]
    },
    clustering: {
      title: '🌌 Задача Кластеризации: Поиск Скрытых Групп',
      outputType: 'Группы / Скопления объектов без готовых меток',
      question: '«Что на что похоже без подсказок учителя?»',
      realTech: [
        { name: '🎵 Музыка и Видео (Spotify, TikTok)', role: 'Объединение треков и роликов в кластеры по схожести вкусов' },
        { name: '💳 Банкинг (Антифрод)', role: 'Поиск необычных кластеров транзакций (выявление мошенников)' },
        { name: '🔭 Астрофизика', role: 'Поиск новых скоплений галактик и звездных систем' }
      ]
    }
  }[activeTab];

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div>
        <span className="text-[11px] font-mono text-[#8b949e] uppercase">
          Интерактивная карта
        </span>
        <h3 className="text-sm font-semibold text-[#c9d1d9]">3 Столпа Машинного Обучения в реальном мире</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#30363d] pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('regression')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'regression' ? 'bg-[#21262d] text-[#58a6ff] font-semibold border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          Регрессия
        </button>
        <button
          onClick={() => setActiveTab('classification')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'classification' ? 'bg-[#21262d] text-[#3fb950] font-semibold border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          Классификация
        </button>
        <button
          onClick={() => setActiveTab('clustering')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'clustering' ? 'bg-[#21262d] text-[#bc8cff] font-semibold border border-[#30363d]' : 'text-[#8b949e] hover:text-[#c9d1d9]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Кластеризация
        </button>
      </div>

      {/* Content */}
      <div className="p-4 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[#f0f6fc]">{data.title}</h4>
          <span className="text-xs font-mono text-[#d29922] bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">
            Главный вопрос: {data.question}
          </span>
        </div>

        <div className="text-xs font-mono text-[#8b949e]">
          Тип ответа: <span className="text-[#58a6ff]">{data.outputType}</span>
        </div>

        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-mono text-[#8b949e] uppercase block">Где это работает прямо сейчас:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {data.realTech.map((tech, idx) => (
              <div key={idx} className="p-2.5 rounded bg-[#161b22] border border-[#30363d] text-xs space-y-1">
                <span className="font-semibold text-[#f0f6fc] block">{tech.name}</span>
                <p className="text-[11px] text-[#8b949e] leading-snug">{tech.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
