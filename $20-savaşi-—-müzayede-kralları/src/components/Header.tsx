import React, { useState } from 'react';
import { Volume2, VolumeX, HelpCircle, ArrowLeft, Trophy, Warehouse } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  currentView: 'menu' | 'setup' | 'item-battle' | 'garage-wars' | 'results';
  gameMode?: 'items' | 'garages';
  onReturnToMenu?: () => void;
  onOpenHowToPlay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  gameMode,
  onReturnToMenu,
  onOpenHowToPlay,
}) => {
  const [muted, setMuted] = useState(sound.getMuted());

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setMuted(next);
    if (!next) {
      sound.playBid();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Sol: Logo & Menüye Dön Butonu */}
        <div className="flex items-center gap-3">
          {currentView !== 'menu' && onReturnToMenu && (
            <button
              onClick={() => {
                sound.playPass();
                if (currentView === 'item-battle' || currentView === 'garage-wars') {
                  if (window.confirm('Açık artırma maçından çıkıp Ana Menüye dönmek istiyor musunuz? İlerlemeniz sıfırlanacaktır.')) {
                    onReturnToMenu();
                  }
                } else {
                  onReturnToMenu();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-500 transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer"
              title="Menüye Dön"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Menü</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-black text-sm tracking-tighter">
              $20
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-white text-base md:text-lg font-['Chakra_Petch']">
                  $20 SAVAŞI
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  MÜZAYEDE KRALLARI
                </span>
              </div>
              {gameMode && (
                <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                  {gameMode === 'items' ? (
                    <>
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>$20 Eşya Savaşı (15 Obje)</span>
                    </>
                  ) : (
                    <>
                      <Warehouse className="w-3 h-3 text-amber-400" />
                      <span>Garaj Savaşları (3 Kilitli Depo)</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sağ: Ses Aç/Kapat & Kurallar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/60 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 hover:bg-zinc-850 transition-all text-xs font-medium cursor-pointer"
            title="Nasıl Oynanır"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Kurallar & Taktikler</span>
          </button>

          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium cursor-pointer ${
              muted
                ? 'bg-red-950/40 border-red-800/50 text-red-400 hover:bg-red-900/50'
                : 'bg-zinc-900/90 border-zinc-700/60 text-zinc-200 hover:border-amber-500/40 hover:text-amber-300'
            }`}
            title={muted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {muted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="hidden sm:inline">Sessiz</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Ses Açık</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
