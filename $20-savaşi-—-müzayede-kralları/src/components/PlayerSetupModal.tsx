import React, { useState } from 'react';
import { Users, Timer, Sparkles, X } from 'lucide-react';
import { sound } from '../utils/sound';

interface PlayerSetupModalProps {
  isOpen: boolean;
  gameMode: 'items' | 'garages';
  onClose: () => void;
  onStartMatch: (p1Name: string, p2Name: string, timerSeconds: number) => void;
}

export const PlayerSetupModal: React.FC<PlayerSetupModalProps> = ({
  isOpen,
  gameMode,
  onClose,
  onStartMatch,
}) => {
  const [p1Name, setP1Name] = useState('Oyuncu 1');
  const [p2Name, setP2Name] = useState('Oyuncu 2');
  const [timerDuration, setTimerDuration] = useState<number>(20); // 20s varsayılan

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playBid();
    onStartMatch(
      p1Name.trim() || 'Oyuncu 1',
      p2Name.trim() || 'Oyuncu 2',
      timerDuration
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black overflow-hidden">
        {/* Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Chakra_Petch'] uppercase tracking-wider">
                MÜZAYEDE SALONU KAYIT MASASI
              </h3>
              <p className="text-[11px] text-zinc-400">
                {gameMode === 'items' ? '$20 Eşya Savaşı (15 Obje)' : 'Garaj Savaşları (3 Kilitli Depo)'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPass();
              onClose();
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Oyuncu Kartı */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-zinc-900 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                1. MÜZAYEDECİ (ALTIN BAYRAK)
              </span>
              <span className="text-[11px] font-mono text-zinc-400">BAŞLANGIÇ: $20.00</span>
            </div>
            <input
              type="text"
              maxLength={16}
              value={p1Name}
              onChange={(e) => setP1Name(e.target.value)}
              placeholder="Oyuncu 1"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white font-semibold text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              required
            />
          </div>

          {/* 2. Oyuncu Kartı */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-zinc-900 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                2. MÜZAYEDECİ (TURKUAZ BAYRAK)
              </span>
              <span className="text-[11px] font-mono text-zinc-400">BAŞLANGIÇ: $20.00</span>
            </div>
            <input
              type="text"
              maxLength={16}
              value={p2Name}
              onChange={(e) => setP2Name(e.target.value)}
              placeholder="Oyuncu 2"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white font-semibold text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Tur Saati Seçici */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Tur Başına Düşünme Süresi</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '15sn (Hızlı)', val: 15 },
                { label: '20sn (Önerilen)', val: 20 },
                { label: '30sn (Rahat)', val: 30 },
                { label: 'Süresiz', val: 0 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => {
                    sound.playBid();
                    setTimerDuration(opt.val);
                  }}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    timerDuration === opt.val
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Başlat Butonu */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-sm tracking-wider uppercase font-['Chakra_Petch'] transition-all transform hover:-translate-y-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Müzayede Salonuna Gir</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
