import React, { useState } from 'react';
import { Music, Radio, Disc, Sparkles } from 'lucide-react';
import { MathText } from '../../math/MathText';

interface Song {
  id: number;
  title: string;
  artist: string;
  energy: number; // 0..100
  danceability: number; // 0..100
}

const SONGS: Song[] = [
  // Cluster 1: Chill / Lo-Fi
  { id: 1, title: 'Night Rain Lo-Fi', artist: 'ChillBeats', energy: 25, danceability: 30 },
  { id: 2, title: 'Study Session Calm', artist: 'FocusMind', energy: 20, danceability: 25 },
  { id: 3, title: 'Midnight Coffee', artist: 'SleepyCat', energy: 35, danceability: 40 },
  // Cluster 2: Workout / Phonk
  { id: 4, title: 'Speed Drift Phonk', artist: 'GhostDrift', energy: 90, danceability: 85 },
  { id: 5, title: 'Adrenaline Rush', artist: 'GymMonster', energy: 95, danceability: 75 },
  { id: 6, title: 'Hyper Drive 200', artist: 'NitroWave', energy: 85, danceability: 90 },
  // Cluster 3: Pop Dance Party
  { id: 7, title: 'Summer Disco Hits', artist: 'StarDJ', energy: 75, danceability: 95 },
  { id: 8, title: 'Neon Lights Tonight', artist: 'PopQueen', energy: 70, danceability: 88 },
  { id: 9, title: 'Festival Anthem', artist: 'ElectroParty', energy: 80, danceability: 92 }
];

export const MusicTasteClustering: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);

  const getClusterId = (song: Song): number => {
    if (song.energy < 50 && song.danceability < 50) return 1; // Lo-Fi
    if (song.energy > 80 && song.danceability < 90) return 2; // Phonk
    return 3; // Pop Party
  };

  const clusterNames: Record<number, { name: string; color: string; desc: string }> = {
    1: { name: '🎧 Учеба & Релакс (Lo-Fi)', color: '#58a6ff', desc: 'Низкая энергия, спокойный ритм' },
    2: { name: '⚡ Тренировки & Дрифт (Phonk)', color: '#f85149', desc: 'Максимальная энергия, жесткий бит' },
    3: { name: '🪩 Танцевальная вечеринка (Pop)', color: '#3fb950', desc: 'Высокая танцевальность, веселье' }
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] space-y-4">
      <div>
        <span className="text-[11px] font-mono text-[#8b949e] uppercase">
          Эксперимент 2
        </span>
        <h3 className="text-sm font-semibold text-[#c9d1d9]">Как Spotify и TikTok собирают рекомендации</h3>
      </div>

      {/* Cluster Filter Buttons */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedCluster(null)}
          className={`px-3 py-1 rounded text-xs font-mono transition-colors border ${
            selectedCluster === null
              ? 'bg-[#21262d] text-[#f0f6fc] border-[#8b949e]'
              : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:text-[#c9d1d9]'
          }`}
        >
          Все треки ({SONGS.length})
        </button>
        {Object.entries(clusterNames).map(([id, info]) => (
          <button
            key={id}
            onClick={() => setSelectedCluster(Number(id))}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors border ${
              selectedCluster === Number(id)
                ? 'bg-[#21262d] text-[#f0f6fc] border-[#58a6ff]'
                : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:text-[#c9d1d9]'
            }`}
          >
            {info.name}
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {SONGS.filter(s => selectedCluster === null || getClusterId(s) === selectedCluster).map(song => {
          const cId = getClusterId(song);
          const cInfo = clusterNames[cId];

          return (
            <div
              key={song.id}
              className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <Music className="w-3.5 h-3.5 text-[#8b949e]" />
                <span
                  className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold"
                  style={{ color: cInfo.color, backgroundColor: `${cInfo.color}15` }}
                >
                  Кластер {cId}
                </span>
              </div>

              <div className="text-xs font-semibold text-[#f0f6fc] truncate">
                {song.title}
              </div>
              <div className="text-[11px] text-[#8b949e] truncate">
                {song.artist}
              </div>

              <div className="flex justify-between text-[10px] font-mono text-[#8b949e] pt-1 border-t border-[#21262d]">
                <span>Энергия: {song.energy}%</span>
                <span>Танцы: {song.danceability}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] leading-relaxed">
        <MathText text="Алгоритм рекомендаций не слушает слова ушами. Он переводит каждый трек в вектор чисел $(x_1, x_2)$ и собирает для тебя плейлисты из треков из одного кластера!" />
      </div>
    </div>
  );
};
