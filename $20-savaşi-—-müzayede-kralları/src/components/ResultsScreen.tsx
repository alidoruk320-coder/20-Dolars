import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Sparkles,
  RotateCcw,
  Home,
  Brain,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuctionItem, Garage, GeminiAnalysisResult, Player } from '../types/game';
import { calculateItemBattleScore, calculateGarageWarsScore, ScoreReport } from '../utils/gameRules';
import { GeminiAnalysisModal } from './GeminiAnalysisModal';
import { sound } from '../utils/sound';
import { ItemIcon } from './ItemIcon';

interface ResultsScreenProps {
  gameMode: 'items' | 'garages';
  player1: Player;
  player2: Player;
  items?: AuctionItem[];
  garages?: Garage[];
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  gameMode,
  player1,
  player2,
  items = [],
  garages = [],
  onPlayAgain,
  onReturnToMenu,
}) => {
  const scoreReport: ScoreReport =
    gameMode === 'items'
      ? calculateItemBattleScore(player1, player2, items)
      : calculateGarageWarsScore(player1, player2, garages);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<GeminiAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const [showItemDetails, setShowItemDetails] = useState(true);

  useEffect(() => {
    sound.playFanfare();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#06b6d4', '#10b981', '#ffffff'],
    });
  }, []);

  const handleRequestGeminiAnalysis = async () => {
    sound.playBid();
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiError(null);

    const p1ItemsWon =
      gameMode === 'items'
        ? items
            .filter((it) => it.wonBy === 'p1')
            .map((it) => ({
              name: it.name,
              bidPrice: it.winningBid || 0,
              marketValue: it.estimatedMarketValue,
            }))
        : garages
            .filter((g) => g.wonBy === 'p1')
            .map((g) => ({
              name: `Depo 0${g.number}: ${g.title}`,
              bidPrice: g.winningBid || 0,
              marketValue: g.totalMarketValue,
            }));

    const p2ItemsWon =
      gameMode === 'items'
        ? items
            .filter((it) => it.wonBy === 'p2')
            .map((it) => ({
              name: it.name,
              bidPrice: it.winningBid || 0,
              marketValue: it.estimatedMarketValue,
            }))
        : garages
            .filter((g) => g.wonBy === 'p2')
            .map((g) => ({
              name: `Depo 0${g.number}: ${g.title}`,
              bidPrice: g.winningBid || 0,
              marketValue: g.totalMarketValue,
            }));

    try {
      const res = await fetch('/api/analyze-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameMode,
          deterministicWinner: scoreReport.winnerName,
          isTie: scoreReport.isTie,
          matchSummary: scoreReport.tiebreakerReason || 'Çekişmeli 2 kişilik açık artırma.',
          player1: {
            name: scoreReport.player1.name,
            remainingCash: scoreReport.player1.remainingCash,
            totalSpent: scoreReport.player1.totalSpent,
            totalMarketValue: scoreReport.player1.totalMarketValue,
            netProfit: scoreReport.player1.netProfit,
            itemsWon: p1ItemsWon,
          },
          player2: {
            name: scoreReport.player2.name,
            remainingCash: scoreReport.player2.remainingCash,
            totalSpent: scoreReport.player2.totalSpent,
            totalMarketValue: scoreReport.player2.totalMarketValue,
            netProfit: scoreReport.player2.netProfit,
            itemsWon: p2ItemsWon,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.available && data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        setAiError(data.error || 'Gemini analiz sunucusu yanıt vermedi.');
      }
    } catch (err: any) {
      setAiError(err?.message || 'Yapay zeka analiz servisine bağlanırken bir hata oluştu.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const isP1Winner = scoreReport.winnerId === 'p1';
  const isP2Winner = scoreReport.winnerId === 'p2';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 min-h-[calc(100vh-70px)]">
      {/* Şampiyonluk Afişi */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-black border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/20 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-3">
          <Award className="w-4 h-4" />
          <span>MÜZAYEDE SONUÇLARI RESMİLEŞTİ</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-['Chakra_Petch'] uppercase tracking-tight drop-shadow-lg">
          {scoreReport.isTie ? (
            <span className="text-zinc-300">DOSTÇA BERABERLİK!</span>
          ) : (
            <>
              <span className={isP1Winner ? 'text-amber-400' : 'text-cyan-400'}>
                {scoreReport.winnerName}
              </span>{' '}
              <span className="text-white">TACI TAKIYOR!</span>
            </>
          )}
        </h1>

        {scoreReport.tiebreakerReason && (
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-mono">
            {scoreReport.tiebreakerReason}
          </p>
        )}

        {/* GEMINI "KİM KAZANDI?" YAPAY ZEKA BUTONU */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleRequestGeminiAnalysis}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider font-['Chakra_Petch'] shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transform hover:-translate-y-0.5 transition-all flex items-center gap-3 cursor-pointer"
          >
            <Brain className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="text-base">KİM KAZANDI? • GEMINI YAPAY ZEKA DEĞERLENDİRMESİ</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </button>
        </div>
      </div>

      {/* Yan Yana Finansal Rapor Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. OYUNCU KARTI */}
        <div
          className={`p-6 rounded-2xl border-2 transition-all ${
            isP1Winner
              ? 'bg-gradient-to-b from-amber-950/40 via-zinc-900 to-black border-amber-400 shadow-2xl shadow-amber-500/20'
              : 'bg-zinc-900/80 border-zinc-800 opacity-90'
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-base">
                P1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-['Chakra_Petch']">
                  {scoreReport.player1.name}
                </h3>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  ALTIN BAYRAK
                </span>
              </div>
            </div>
            {isP1Winner && (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Trophy className="w-3.5 h-3.5" />
                <span>ŞAMPİYON</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                NET KÂR
              </span>
              <div
                className={`text-2xl font-black font-mono ${
                  scoreReport.player1.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {scoreReport.player1.netProfit >= 0
                  ? `+$${scoreReport.player1.netProfit}`
                  : `-$${Math.abs(scoreReport.player1.netProfit)}`}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                TOPLAM PİYASA DEĞERİ
              </span>
              <div className="text-2xl font-black font-mono text-white">
                ${scoreReport.player1.totalMarketValue}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                TOPLAM HARCANAN
              </span>
              <div className="text-xl font-bold font-mono text-zinc-300">
                ${scoreReport.player1.totalSpent}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                KALAN NAKİT
              </span>
              <div className="text-xl font-bold font-mono text-amber-400">
                ${scoreReport.player1.remainingCash}
              </div>
            </div>
          </div>
        </div>

        {/* 2. OYUNCU KARTI */}
        <div
          className={`p-6 rounded-2xl border-2 transition-all ${
            isP2Winner
              ? 'bg-gradient-to-b from-cyan-950/40 via-zinc-900 to-black border-cyan-400 shadow-2xl shadow-cyan-500/20'
              : 'bg-zinc-900/80 border-zinc-800 opacity-90'
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-base">
                P2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-['Chakra_Petch']">
                  {scoreReport.player2.name}
                </h3>
                <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                  TURKUAZ BAYRAK
                </span>
              </div>
            </div>
            {isP2Winner && (
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Trophy className="w-3.5 h-3.5" />
                <span>ŞAMPİYON</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                NET KÂR
              </span>
              <div
                className={`text-2xl font-black font-mono ${
                  scoreReport.player2.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {scoreReport.player2.netProfit >= 0
                  ? `+$${scoreReport.player2.netProfit}`
                  : `-$${Math.abs(scoreReport.player2.netProfit)}`}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                TOPLAM PİYASA DEĞERİ
              </span>
              <div className="text-2xl font-black font-mono text-white">
                ${scoreReport.player2.totalMarketValue}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                TOPLAM HARCANAN
              </span>
              <div className="text-xl font-bold font-mono text-zinc-300">
                ${scoreReport.player2.totalSpent}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                KALAN NAKİT
              </span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                ${scoreReport.player2.remainingCash}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detaylı Envanter ve Eksper Değerleri Tablosu */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div
          onClick={() => setShowItemDetails(!showItemDetails)}
          className="p-4 sm:p-5 bg-zinc-950 flex items-center justify-between cursor-pointer border-b border-zinc-800"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-['Chakra_Petch'] uppercase tracking-wider">
              {gameMode === 'items' ? 'Müzayede Eşyaları Detaylı Kataloğu (15 Lot)' : 'Kilitli Depolar Eksper Dökümü'}
            </h3>
          </div>
          <button className="text-zinc-400 hover:text-white cursor-pointer">
            {showItemDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showItemDetails && (
          <div className="p-4 sm:p-6 overflow-x-auto">
            {gameMode === 'items' ? (
              <table className="w-full text-left text-xs text-zinc-300 border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    <th className="py-2.5 px-3">Eşya Adı</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3 text-center">Kazanan</th>
                    <th className="py-2.5 px-3 text-right">Ödenen Teklif</th>
                    <th className="py-2.5 px-3 text-right">Gerçek Piyasa Değeri</th>
                    <th className="py-2.5 px-3 text-right">Net Kâr/Zarar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {items.map((item, idx) => {
                    const diff = item.wonBy ? item.estimatedMarketValue - (item.winningBid || 0) : 0;
                    return (
                      <tr key={item.id} className="hover:bg-zinc-850/50 transition-colors">
                        <td className="py-3 px-3 font-semibold text-white font-sans flex items-center gap-2">
                          <span className="text-zinc-500 text-[10px]">#{idx + 1}</span>
                          <span>{item.name}</span>
                        </td>
                        <td className="py-3 px-3 text-zinc-400 font-sans">{item.category}</td>
                        <td className="py-3 px-3 text-center font-sans">
                          {item.wonBy === 'p1' ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                              {player1.name}
                            </span>
                          ) : item.wonBy === 'p2' ? (
                            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                              {player2.name}
                            </span>
                          ) : (
                            <span className="text-zinc-500 text-[10px]">SATILAMADI</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right text-zinc-200">
                          {item.wonBy ? `$${item.winningBid}` : '—'}
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                          ${item.estimatedMarketValue}
                        </td>
                        <td className="py-3 px-3 text-right font-bold">
                          {item.wonBy ? (
                            <span className={diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              {diff >= 0 ? `+$${diff}` : `-$${Math.abs(diff)}`}
                            </span>
                          ) : (
                            <span className="text-zinc-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="space-y-4">
                {garages.map((g) => {
                  const profit = g.wonBy ? g.totalMarketValue - (g.winningBid || 0) : 0;
                  return (
                    <div
                      key={g.id}
                      className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold font-mono text-xs">
                            DEPO 0{g.number}
                          </span>
                          <h4 className="font-bold text-white text-sm font-sans">{g.title}</h4>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 font-sans">{g.theme}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {g.items.map((it) => (
                            <span
                              key={it.id}
                              className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-sans"
                            >
                              {it.name}: <strong className="text-emerald-400">${it.estimatedValue}</strong>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <div className="text-xs text-zinc-400">
                          Kazanan: <strong className="text-white">{g.wonBy ? (g.wonBy === 'p1' ? player1.name : player2.name) : 'SATILAMADI'}</strong>
                        </div>
                        <div className="font-mono text-sm">
                          Ödenen: <strong>${g.winningBid || 0}</strong> • Piyasa Değeri: <strong className="text-emerald-400">${g.totalMarketValue}</strong>
                        </div>
                        <div
                          className={`font-mono font-bold text-xs ${
                            profit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          Net Getiri: {profit >= 0 ? `+$${profit}` : `-$${Math.abs(profit)}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rövanş ve Menü Butonları */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 pb-8">
        <button
          onClick={() => {
            sound.playBid();
            onPlayAgain();
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase tracking-wider font-['Chakra_Petch'] transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Tekrar Oyna (Rövanş)</span>
        </button>

        <button
          onClick={() => {
            sound.playPass();
            onReturnToMenu();
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Ana Menüye Dön</span>
        </button>
      </div>

      {/* Gemini AI Modal */}
      <GeminiAnalysisModal
        isOpen={isAiModalOpen}
        isLoading={isAiLoading}
        error={aiError}
        analysis={aiAnalysis}
        winnerName={scoreReport.winnerName}
        isTie={scoreReport.isTie}
        onClose={() => setIsAiModalOpen(false)}
        onRetry={handleRequestGeminiAnalysis}
      />
    </div>
  );
};
