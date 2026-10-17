import React from 'react';
import {
  Brain,
  Sparkles,
  Trophy,
  Award,
  AlertTriangle,
  Flame,
  ThumbsDown,
  TrendingUp,
  X,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { GeminiAnalysisResult } from '../types/game';
import { sound } from '../utils/sound';

interface GeminiAnalysisModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error?: string | null;
  analysis: GeminiAnalysisResult | null;
  winnerName: string;
  isTie: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export const GeminiAnalysisModal: React.FC<GeminiAnalysisModalProps> = ({
  isOpen,
  isLoading,
  error,
  analysis,
  winnerName,
  isTie,
  onClose,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[92vh]">
        {/* Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-gradient-to-r from-zinc-950 via-purple-950/40 to-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Brain className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Chakra_Petch'] tracking-wide uppercase flex items-center gap-2">
                <span>GEMINI BAŞ EKSPER KARARI</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-[10px] text-purple-300 font-mono">
                  gemini-3.1-flash-lite
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Resmi Maç Sonu Stratejik Analiz & Canlı Yorum
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

        {/* Gövde */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Yükleniyor Ekranı */}
          {isLoading && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <Sparkles className="w-8 h-8 text-amber-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white font-['Chakra_Petch']">
                  MÜZAYEDE USTASI DEFTERLERİ İNCELİYOR...
                </h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Teklif marjları, blöf hamleleri ve Gemini AI piyasa değerlemeleri çapraz kontrol ediliyor.
                </p>
              </div>
            </div>
          )}

          {/* Hata / Çevrimdışı Durum */}
          {!isLoading && error && (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="text-base font-bold text-white font-['Chakra_Petch']">
                  YAPAY ZEKA YORUMU GEÇİCİ OLARAK ALINAMADI
                </h4>
                <p className="text-xs text-zinc-400">{error}</p>
                <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-left">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    RESMİ MATEMATİKSEL KAZANAN
                  </span>
                  <div className="text-2xl font-black text-white font-['Chakra_Petch']">
                    {isTie ? 'SONUÇ: DOSTÇA BERABERLİK' : `${winnerName} KAZANDI!`}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Deterministik puanlama kuralları eksiksiz şekilde hesaplanmıştır.
                  </p>
                </div>
              </div>
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yapay Zekayı Tekrar Dene</span>
              </button>
            </div>
          )}

          {/* Analiz Raporu */}
          {!isLoading && analysis && (
            <div className="space-y-5 animate-fadeIn">
              {/* Manşet Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-zinc-900 to-amber-950/60 border border-purple-500/40 text-center shadow-lg">
                <span className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] uppercase tracking-widest mb-2 border border-amber-500/40">
                  {isTie ? 'RESMİ BERABERLİK' : 'RESMİ ŞAMPİYON'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Chakra_Petch'] uppercase tracking-tight">
                  {analysis.winnerHeadline}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-2xl mx-auto italic leading-relaxed">
                  "{analysis.dramaticRecap}"
                </p>
              </div>

              {/* En İyi Kelepir & En Kötü Alım */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* En İyi Kelepir */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400">
                    <Flame className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      GÜNÜN KELEPİRİ (EN İYİ VURGUN)
                    </span>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">{analysis.bestBargain.itemName}</div>
                    <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                      {analysis.bestBargain.playerName} sadece ${analysis.bestBargain.paid} ödedi (Piyasa Değeri: ${analysis.bestBargain.marketValue})
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 italic">
                      "{analysis.bestBargain.commentary}"
                    </p>
                  </div>
                </div>

                {/* Hatalı Aşırı Teklif */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2 text-rose-400">
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      HATALI AŞIRI TEKLİF
                    </span>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">{analysis.worstPurchase.itemName}</div>
                    <div className="text-xs font-semibold text-rose-400 mt-0.5">
                      {analysis.worstPurchase.playerName} tam ${analysis.worstPurchase.paid} ödedi (Piyasa Değeri: ${analysis.worstPurchase.marketValue})
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 italic">
                      "{analysis.worstPurchase.commentary}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Strateji Eleştirisi */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span>Taktiksel Eleştiri & Oyun Tarzları</span>
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-amber-400 font-bold block mb-1">1. Oyuncu Analizi</span>
                    <p className="text-zinc-300 leading-relaxed">
                      {analysis.strategyBreakdown.player1Critique}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-cyan-400 font-bold block mb-1">2. Oyuncu Analizi</span>
                    <p className="text-zinc-300 leading-relaxed">
                      {analysis.strategyBreakdown.player2Critique}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dönüm Noktası & Son Karar */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Maçın Dönüm Noktası:</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{analysis.turningPoint}</p>

                <div className="pt-3 border-t border-zinc-800 text-xs">
                  <span className="text-purple-400 font-bold uppercase tracking-wider block mb-1">
                    Müzayede Ustasının Son Kararı:
                  </span>
                  <p className="text-zinc-200 italic font-medium leading-relaxed">
                    "{analysis.auctionMasterVerdict}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alt Kısım */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono">
            VERİLERE DAYALI • MATEMATİKSEL KAZANAN KURALI KORUNDU
          </span>
          <button
            onClick={() => {
              sound.playPass();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Raporu Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
