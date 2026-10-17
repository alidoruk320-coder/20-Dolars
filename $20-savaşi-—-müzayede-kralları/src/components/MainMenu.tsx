import React from 'react';
import { Trophy, Warehouse, Play, HelpCircle, Volume2, VolumeX, Sparkles, Zap, DollarSign, Award } from 'lucide-react';
import { sound } from '../utils/sound';

interface MainMenuProps {
  onSelectMode: (mode: 'items' | 'garages') => void;
  onOpenHowToPlay: () => void;
  muted: boolean;
  onToggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectMode,
  onOpenHowToPlay,
  muted,
  onToggleSound,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Sinematik arka plan ışıkları ve endüstriyel ızgara */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-zinc-950 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Spot ışığı efektleri */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full mx-auto flex flex-col items-center text-center space-y-8 my-auto py-8">
        {/* Başlık Alanı */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase shadow-lg shadow-amber-500/10">
            <Zap className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>2 OYUNCULU REKABETÇİ MÜZAYEDE DÜELLOSU</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white font-['Chakra_Petch'] tracking-tighter uppercase drop-shadow-[0_4px_24px_rgba(245,158,11,0.25)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              $20 SAVAŞI
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-bold tracking-widest text-zinc-300 uppercase font-['Chakra_Petch'] flex items-center justify-center gap-3">
            <span className="text-amber-400">AKILLI TEKLİF VER.</span>
            <span className="text-zinc-500">•</span>
            <span className="text-rose-400">SAĞLAM BLÖF YAP.</span>
            <span className="text-zinc-500">•</span>
            <span className="text-emerald-400">HEPSİNİ KAZAN.</span>
          </p>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-400">
            Her iki oyuncu da sadece $20 bütçeyle başlar. Rakibinizi alt edin, gerçek piyasa değerlerini sezin ve maç sonunda Gemini Yapay Zeka Eksperinin değerlendirmesine çıkın!
          </p>
        </div>

        {/* İki Oyun Modu Kartı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-2">
          {/* Mod 1: $20 Eşya Savaşı */}
          <div
            onClick={() => {
              sound.playBid();
              onSelectMode('items');
            }}
            className="group relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800 hover:border-amber-500/70 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 text-left flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Üst Rozet */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-[11px] font-extrabold text-amber-400 uppercase tracking-widest">
                MOD 01
              </span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>$20 Başlangıç Bütçesi</span>
              </div>
            </div>

            {/* İkon & Açıklama */}
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                <Trophy className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white font-['Chakra_Petch'] group-hover:text-amber-400 transition-colors uppercase">
                  $20 EŞYA SAVAŞI
                </h3>
                <p className="text-xs font-semibold text-amber-400/90 tracking-wide mt-0.5">
                  15 Günlük Obje • Gizli Piyasa Değerleri
                </p>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                İki oyuncu sırayla 15 seçilmiş nesne için yarışır. Teklif verin, blöf yapın, rakibinizin parasını tükettirin ve bütçeniz bitmeden en kârlı koleksiyonu toplayın.
              </p>

              {/* Özellikler */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-[10px] text-zinc-300 font-medium">
                  • 15 Özel Eşya
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-[10px] text-zinc-300 font-medium">
                  • Tur Süreli Teklifler
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-[10px] text-zinc-300 font-medium">
                  • Gemini AI Eksper Raporu
                </span>
              </div>
            </div>

            {/* Buton */}
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Modu Seç & Başla</span>
                <span>→</span>
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
              </div>
            </div>
          </div>

          {/* Mod 2: Garaj Savaşları */}
          <div
            onClick={() => {
              sound.playBid();
              onSelectMode('garages');
            }}
            className="group relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800 hover:border-cyan-500/70 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 text-left flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Üst Rozet */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-[11px] font-extrabold text-cyan-400 uppercase tracking-widest">
                MOD 02
              </span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Warehouse className="w-3.5 h-3.5 text-cyan-400" />
                <span>3 Kilitli Depo</span>
              </div>
            </div>

            {/* İkon & Açıklama */}
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                <Warehouse className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white font-['Chakra_Petch'] group-hover:text-cyan-400 transition-colors uppercase">
                  GARAJ SAVAŞLARI
                </h3>
                <p className="text-xs font-semibold text-cyan-400/90 tracking-wide mt-0.5">
                  Kör Depo Müzayedeleri • Yüksek Heyecan
                </p>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Kepengi kilitli 3 gizemli depo. İpuçlarını okuyun, içerideki sesleri dinleyin, depolara körü körüne teklif verin ve kepenk motorunun açılışını izleyin!
              </p>

              {/* Özellikler */}
              <div className="pt-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-[10px] text-zinc-300 font-medium">
                  • 3 Endüstriyel Depo
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-[10px] text-zinc-300 font-medium">
                  • Motorlu Kepenk Açılışı
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-[10px] text-zinc-300 font-medium">
                  • Hazine mi Hurda mı?
                </span>
              </div>
            </div>

            {/* Buton */}
            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Modu Seç & Başla</span>
                <span>→</span>
              </span>
              <div className="w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Hızlı Eylemler */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => {
              sound.playBid();
              onOpenHowToPlay();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-amber-500/60 text-zinc-300 hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-lg"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Nasıl Oynanır & Puanlama Kuralları</span>
          </button>

          <button
            onClick={onToggleSound}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-lg"
          >
            {muted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span>Ses Kapalı (Açmak İçin Tıkla)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Ses Aktif (Tüm Efektler)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
