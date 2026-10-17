import React, { useState, useEffect } from 'react';
import {
  Warehouse,
  DollarSign,
  Gavel,
  Eye,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Clock,
  History,
  Lock,
  Unlock,
  Volume2,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BidHistoryEntry, Garage, GarageItem, Player } from '../types/game';
import { sound } from '../utils/sound';
import { ItemIcon } from './ItemIcon';

interface GarageWarsProps {
  player1: Player;
  player2: Player;
  garages: Garage[];
  timerDuration: number;
  onGaragesComplete: (p1: Player, p2: Player, updatedGarages: Garage[]) => void;
}

export const GarageWars: React.FC<GarageWarsProps> = ({
  player1: initialP1,
  player2: initialP2,
  garages: initialGarages,
  timerDuration,
  onGaragesComplete,
}) => {
  const [p1, setP1] = useState<Player>(initialP1);
  const [p2, setP2] = useState<Player>(initialP2);
  const [garages, setGarages] = useState<Garage[]>(initialGarages);

  const [garageIndex, setGarageIndex] = useState<number>(0);
  const [phase, setPhase] = useState<'bidding' | 'revealing' | 'revealed'>('bidding');

  const [currentBid, setCurrentBid] = useState<number>(0);
  const [leadingPlayerId, setLeadingPlayerId] = useState<'p1' | 'p2' | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<'p1' | 'p2'>('p1');
  const [customBidAmount, setCustomBidAmount] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);

  const [saleResult, setSaleResult] = useState<{
    status: 'sold' | 'unsold';
    winnerId: 'p1' | 'p2' | null;
    amount: number;
  } | null>(null);

  const [doorHeight, setDoorHeight] = useState<number>(100);

  const [history, setHistory] = useState<BidHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const currentGarage = garages[garageIndex];
  const activePlayer = activePlayerId === 'p1' ? p1 : p2;
  const nonActivePlayer = activePlayerId === 'p1' ? p2 : p1;

  useEffect(() => {
    const nextMin = currentBid > 0 ? currentBid + 1 : 1;
    setCustomBidAmount(Math.min(nextMin, activePlayer.budget));
  }, [currentBid, activePlayer.budget]);

  useEffect(() => {
    if (timerDuration <= 0 || phase !== 'bidding' || saleResult !== null) return;

    setTimeLeft(timerDuration);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handlePass(true);
          return timerDuration;
        }
        if (prev <= 5) {
          sound.playTick(true);
        } else if (prev <= 10) {
          sound.playTick(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [garageIndex, activePlayerId, phase, saleResult, timerDuration]);

  const addHistory = (entry: Omit<BidHistoryEntry, 'id' | 'timestamp' | 'round'>) => {
    setHistory((prev) => [
      ...prev,
      {
        ...entry,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        round: garageIndex + 1,
      },
    ]);
  };

  const handlePlaceBid = (amount: number) => {
    if (phase !== 'bidding' || saleResult !== null) return;

    if (amount <= currentBid || amount > activePlayer.budget || leadingPlayerId === activePlayerId) {
      sound.playBuzzer();
      return;
    }

    sound.playBid();
    setCurrentBid(amount);
    setLeadingPlayerId(activePlayerId);

    addHistory({
      text: `${activePlayer.name}, DEPO 0${currentGarage.number} için $${amount} teklif etti`,
      type: 'bid',
      playerId: activePlayerId,
      amount,
    });

    setTimeLeft(timerDuration);

    const nextOpponent = nonActivePlayer;
    if (nextOpponent.budget > amount) {
      setActivePlayerId(nextOpponent.id);
    } else {
      addHistory({
        text: `${nextOpponent.name} sonraki teklifi karşılayamıyor (Bütçe: $${nextOpponent.budget})`,
        type: 'info',
        playerId: nextOpponent.id,
      });
      finalizeGarageSale(activePlayerId, amount);
    }
  };

  const handlePass = (isTimeout: boolean = false) => {
    if (phase !== 'bidding' || saleResult !== null) return;

    sound.playPass();
    addHistory({
      text: `${activePlayer.name} DEPO 0${currentGarage.number} için ${isTimeout ? 'süre dolduğu için PAS geçti' : 'PAS geçti'}`,
      type: 'pass',
      playerId: activePlayerId,
    });

    if (leadingPlayerId === null) {
      const other = nonActivePlayer;
      if (other.budget >= 1 && activePlayerId === 'p1') {
        setActivePlayerId('p2');
        setTimeLeft(timerDuration);
      } else {
        finalizeGarageSale(null, 0);
      }
    } else {
      finalizeGarageSale(leadingPlayerId, currentBid);
    }
  };

  const finalizeGarageSale = (winnerId: 'p1' | 'p2' | null, finalPrice: number) => {
    sound.playGavelStrike();

    let updatedP1 = { ...p1 };
    let updatedP2 = { ...p2 };
    let updatedGarages = [...garages];

    if (winnerId !== null && finalPrice > 0) {
      if (winnerId === 'p1') {
        updatedP1.budget -= finalPrice;
        updatedP1.spent += finalPrice;
      } else {
        updatedP2.budget -= finalPrice;
        updatedP2.spent += finalPrice;
      }

      updatedGarages[garageIndex] = {
        ...updatedGarages[garageIndex],
        wonBy: winnerId,
        winningBid: finalPrice,
        isRevealed: true,
      };

      setP1(updatedP1);
      setP2(updatedP2);
      setGarages(updatedGarages);

      setSaleResult({
        status: 'sold',
        winnerId,
        amount: finalPrice,
      });

      addHistory({
        text: `DEPO 0${currentGarage.number} SATILDI! $${finalPrice} ile ${winnerId === 'p1' ? p1.name : p2.name} kazandı!`,
        type: 'sold',
        playerId: winnerId,
        amount: finalPrice,
      });
    } else {
      updatedGarages[garageIndex] = {
        ...updatedGarages[garageIndex],
        wonBy: null,
        winningBid: 0,
        isRevealed: true,
      };
      setGarages(updatedGarages);

      setSaleResult({
        status: 'unsold',
        winnerId: null,
        amount: 0,
      });

      addHistory({
        text: `DEPO 0${currentGarage.number} SATILAMADI. Her iki oyuncu da pas geçti.`,
        type: 'unsold',
      });
    }

    setPhase('revealing');
    sound.playGarageDoor();

    let height = 100;
    const doorInterval = setInterval(() => {
      height -= 10;
      if (height <= 0) {
        clearInterval(doorInterval);
        setDoorHeight(0);
        setPhase('revealed');

        if (winnerId !== null) {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
            colors: winnerId === 'p1' ? ['#f59e0b', '#fbbf24', '#ffffff'] : ['#06b6d4', '#22d3ee', '#ffffff'],
          });
          sound.playCashRegister();
        }
      } else {
        setDoorHeight(height);
      }
    }, 120);
  };

  const handleNextGarage = () => {
    sound.playBid();
    if (garageIndex + 1 >= garages.length) {
      onGaragesComplete(p1, p2, garages);
    } else {
      setGarageIndex((prev) => prev + 1);
      setPhase('bidding');
      setCurrentBid(0);
      setLeadingPlayerId(null);
      setActivePlayerId(garageIndex % 2 === 0 ? 'p2' : 'p1');
      setTimeLeft(timerDuration);
      setSaleResult(null);
      setDoorHeight(100);
    }
  };

  const winningBid = currentGarage.winningBid || 0;
  const resaleTotal = currentGarage.totalMarketValue;
  const netProfit = resaleTotal - winningBid;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col gap-5 min-h-[calc(100vh-70px)]">
      {/* Üst Başlık */}
      <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 px-4 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-orange-500/20 border border-orange-500/40 text-orange-400 font-extrabold text-xs font-['Chakra_Petch'] uppercase tracking-wider flex items-center gap-1.5">
            <Warehouse className="w-3.5 h-3.5" />
            <span>KİLİTLİ DEPO {garageIndex + 1} / 3</span>
          </span>
          <span className="hidden sm:inline-block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {currentGarage.title}
          </span>
        </div>

        {/* 3 Depo Durum Hapları */}
        <div className="flex items-center gap-2">
          {garages.map((g, idx) => (
            <div
              key={g.id}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono border transition-all ${
                idx === garageIndex
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 ring-1 ring-amber-400'
                  : g.isRevealed
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-500'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              DEPO 0{g.number} {g.wonBy ? `(${g.wonBy.toUpperCase()})` : g.isRevealed ? '(PAS)' : ''}
            </div>
          ))}
        </div>

        {/* Kayıt Defteri Butonu */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer transition-colors"
        >
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Kayıtlar</span>
          <span className="px-1.5 py-0.2 rounded bg-zinc-700 text-[10px] text-zinc-300 font-mono">
            {history.length}
          </span>
        </button>
      </div>

      {/* 3 Sütunlu Ana Saha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 1. OYUNCU PANELİ */}
        <div
          className={`lg:col-span-3 rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
            activePlayerId === 'p1' && phase === 'bidding'
              ? 'bg-gradient-to-b from-amber-950/40 via-zinc-900 to-black border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400'
              : 'bg-zinc-900/80 border-zinc-800 opacity-90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                P1
              </div>
              <div>
                <h3 className="font-bold text-white text-sm truncate max-w-[120px] font-['Chakra_Petch']">
                  {p1.name}
                </h3>
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">
                  ALTIN BAYRAK
                </span>
              </div>
            </div>
            {activePlayerId === 'p1' && phase === 'bidding' && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-[10px] font-extrabold text-amber-400 animate-pulse uppercase">
                SIRA SENDE
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 mb-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              KALAN BÜTÇE
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                ${p1.budget}
              </span>
              <span className="text-xs text-zinc-500 font-mono">/ $20.00</span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-400 flex justify-between">
              <span>Harcanan:</span>
              <span className="font-mono text-zinc-300 font-semibold">${p1.spent}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
              <span>Kazanılan Depolar ({garages.filter((g) => g.wonBy === 'p1').length})</span>
            </div>
            <div className="space-y-2">
              {garages
                .filter((g) => g.wonBy === 'p1')
                .map((g) => (
                  <div
                    key={g.id}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between font-bold text-amber-400">
                      <span>DEPO 0{g.number}</span>
                      <span className="font-mono">Ödenen: ${g.winningBid}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Piyasa Değeri:</span>
                      <span className="text-emerald-400 font-mono font-bold">${g.totalMarketValue}</span>
                    </div>
                  </div>
                ))}
              {garages.filter((g) => g.wonBy === 'p1').length === 0 && (
                <div className="p-4 text-center rounded-lg border border-dashed border-zinc-800 text-zinc-500 text-xs">
                  Henüz depo kazanılmadı
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ORTA GARAJ SAHNESİ */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative rounded-2xl bg-zinc-950 border-2 border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Üst Çubuk */}
            <div className="p-4 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded bg-black/80 border border-zinc-700 text-white font-mono font-black text-sm tracking-widest">
                  DEPO #0{currentGarage.number}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase font-['Chakra_Petch']">
                    {currentGarage.title}
                  </h2>
                  <p className="text-[11px] text-zinc-400">{currentGarage.theme}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase">
                {phase === 'revealed' ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>AÇILDI & İNCELENDİ</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>KİLİTLİ</span>
                  </>
                )}
              </div>
            </div>

            {/* KEPENK KAPISI ALANI */}
            <div className="relative w-full h-80 sm:h-96 bg-zinc-900/95 overflow-hidden flex flex-col justify-end">
              {/* İÇERİK TEŞHİR KATMANI (Kepenk yukarı kalkınca görünür) */}
              <div className="absolute inset-0 p-5 bg-gradient-to-b from-stone-900 via-zinc-900 to-black flex flex-col justify-between overflow-y-auto z-0">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>AÇILAN ENVANTER ({currentGarage.items.length} EŞYA)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    TOPLAM DEĞER: ${currentGarage.totalMarketValue}
                  </span>
                </div>

                {/* 4 Eşya Izgarası */}
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {currentGarage.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        item.rarity === 'jackpot'
                          ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/20'
                          : item.rarity === 'valuable'
                          ? 'bg-cyan-950/40 border-cyan-500/50'
                          : item.rarity === 'common'
                          ? 'bg-zinc-850 border-zinc-700/60'
                          : 'bg-zinc-950 border-red-900/30 text-zinc-500'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">
                            <ItemIcon name={item.icon} className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs leading-tight line-clamp-1">
                              {item.name}
                            </div>
                            <span className="text-[10px] text-zinc-400">{item.category}</span>
                          </div>
                        </div>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            item.rarity === 'jackpot'
                              ? 'bg-amber-500 text-black'
                              : item.rarity === 'valuable'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : item.rarity === 'common'
                              ? 'bg-zinc-700 text-zinc-300'
                              : 'bg-red-950 text-red-400'
                          }`}
                        >
                          {item.rarity === 'jackpot'
                            ? 'HAZİNE'
                            : item.rarity === 'valuable'
                            ? 'DEĞERLİ'
                            : item.rarity === 'common'
                            ? 'STANDART'
                            : 'HURDA'}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-2 mt-1">{item.description}</p>
                      <div className="mt-2 pt-1 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono font-bold">
                        <span className="text-zinc-500 text-[10px]">Eksper Değeri:</span>
                        <span className="text-emerald-400">${item.estimatedValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RULO KEPENK KAPISI KATMANI */}
              <div
                className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 border-b-8 border-yellow-500 shadow-2xl flex flex-col justify-between transition-all duration-300 pointer-events-none"
                style={{
                  height: `${doorHeight}%`,
                  display: doorHeight <= 0 ? 'none' : 'flex',
                }}
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#27272a,#27272a_12px,#18181b_12px,#18181b_24px)] opacity-90" />

                <div className="relative z-10 m-auto text-center p-6 bg-black/60 backdrop-blur-xs rounded-2xl border border-zinc-700 max-w-sm">
                  <div className="text-xs font-mono font-black text-amber-400 tracking-widest uppercase mb-1">
                    KİLİTLİ DEPO KEPENGİ
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white font-['Chakra_Petch'] tracking-widest uppercase">
                    DEPO #0{currentGarage.number}
                  </div>
                  <div className="mt-2 text-[11px] text-zinc-400 italic">
                    "{currentGarage.lore}"
                  </div>
                </div>

                <div className="relative z-10 w-full h-6 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_15px,#000_15px,#000_30px)] shadow-lg" />
              </div>

              {/* TEFTİŞ İPUÇLARI (Kepenk kapalıyken gösterilir) */}
              {phase === 'bidding' && (
                <div className="relative z-20 m-3 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-700 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ön Teftiş İpuçları & Dedikodular:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {currentGarage.clues.map((clue, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{clue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* DURUM VE İLERLEME ÇUBUĞU */}
            {phase === 'revealed' ? (
              <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      currentGarage.wonBy
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {currentGarage.wonBy ? <TrendingUp className="w-6 h-6" /> : <Warehouse className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-400 uppercase">
                      {currentGarage.wonBy
                        ? `${currentGarage.wonBy === 'p1' ? p1.name : p2.name} kazandı!`
                        : 'Satılamadı (İki Oyuncu da Pas Geçti)'}
                    </div>
                    {currentGarage.wonBy && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-white font-mono">
                          Ödenen: ${winningBid}
                        </span>
                        <span className="text-xs font-semibold text-zinc-400">→ Piyasa Değeri: ${resaleTotal}</span>
                        <span
                          className={`text-xs font-bold font-mono ${
                            netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          ({netProfit >= 0 ? `+$${netProfit}` : `-$${Math.abs(netProfit)}`} Net)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNextGarage}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-xs uppercase tracking-wider font-['Chakra_Petch'] transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>{garageIndex + 1 >= garages.length ? 'Final Sonuçlarını Gör' : 'Sonraki Depo Müzayedesi'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    MEVCUT EN YÜKSEK TEKLİF
                  </span>
                  <div className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
                    ${currentBid}
                  </div>
                </div>

                <div className="text-right">
                  {leadingPlayerId ? (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        leadingPlayerId === 'p1'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      }`}
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      <span>{leadingPlayerId === 'p1' ? p1.name : p2.name} Önde</span>
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-500 font-semibold">AÇILIŞ TEKLİFİ: $1</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* TEKLİF KONTROLLERİ */}
          {phase === 'bidding' && (
            <div
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                activePlayerId === 'p1'
                  ? 'bg-zinc-900/90 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-900/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activePlayerId === 'p1' ? 'bg-amber-400' : 'bg-cyan-400'
                    } animate-pulse`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {activePlayer.name}'in Teklif Sırası
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-zinc-400">
                  Cüzdan: <strong className="text-white">${activePlayer.budget}</strong>
                </span>
              </div>

              {/* Hızlı Teklif Butonları */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[1, 2, 5].map((increment) => {
                  const targetBid = (currentBid === 0 ? 0 : currentBid) + increment;
                  const canAfford = targetBid <= activePlayer.budget && targetBid > currentBid && leadingPlayerId !== activePlayerId;
                  return (
                    <button
                      key={increment}
                      disabled={!canAfford}
                      onClick={() => handlePlaceBid(targetBid)}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex flex-col items-center cursor-pointer border ${
                        canAfford
                          ? activePlayerId === 'p1'
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 hover:border-amber-400 shadow-md'
                            : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 shadow-md'
                          : 'bg-zinc-950/60 text-zinc-600 border-zinc-800/80 cursor-not-allowed'
                      }`}
                    >
                      <span>+${increment}</span>
                      <span className="text-[10px] font-mono opacity-80">${targetBid} Teklif Et</span>
                    </button>
                  );
                })}

                {/* Rest / Tümüyle Gir Butonu */}
                {(() => {
                  const canAllIn = activePlayer.budget > currentBid && leadingPlayerId !== activePlayerId;
                  return (
                    <button
                      disabled={!canAllIn}
                      onClick={() => handlePlaceBid(activePlayer.budget)}
                      className={`py-2.5 px-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex flex-col items-center cursor-pointer border ${
                        canAllIn
                          ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40 hover:border-rose-400'
                          : 'bg-zinc-950/60 text-zinc-600 border-zinc-800/80 cursor-not-allowed'
                      }`}
                    >
                      <span>REST (HEPSİ)</span>
                      <span className="text-[10px] font-mono opacity-80">${activePlayer.budget}</span>
                    </button>
                  );
                })()}
              </div>

              {/* Manuel Teklif ve Pas */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      min={currentBid + 1}
                      max={activePlayer.budget}
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <button
                    disabled={
                      customBidAmount <= currentBid ||
                      customBidAmount > activePlayer.budget ||
                      leadingPlayerId === activePlayerId
                    }
                    onClick={() => handlePlaceBid(customBidAmount)}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all border ${
                      customBidAmount > currentBid &&
                      customBidAmount <= activePlayer.budget &&
                      leadingPlayerId !== activePlayerId
                        ? activePlayerId === 'p1'
                          ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    Teklifi Ver
                  </button>
                </div>

                <button
                  onClick={() => handlePass(false)}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-zinc-800/90 hover:bg-rose-950/60 border border-zinc-700 hover:border-rose-500/60 text-zinc-300 hover:text-rose-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>PAS GEÇ</span>
                  {leadingPlayerId !== null && leadingPlayerId !== activePlayerId && (
                    <span className="text-[10px] text-zinc-400">(Çekil)</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. OYUNCU PANELİ */}
        <div
          className={`lg:col-span-3 rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
            activePlayerId === 'p2' && phase === 'bidding'
              ? 'bg-gradient-to-b from-cyan-950/40 via-zinc-900 to-black border-cyan-400 shadow-xl shadow-cyan-500/20 ring-1 ring-cyan-400'
              : 'bg-zinc-900/80 border-zinc-800 opacity-90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
                P2
              </div>
              <div>
                <h3 className="font-bold text-white text-sm truncate max-w-[120px] font-['Chakra_Petch']">
                  {p2.name}
                </h3>
                <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest">
                  TURKUAZ BAYRAK
                </span>
              </div>
            </div>
            {activePlayerId === 'p2' && phase === 'bidding' && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-[10px] font-extrabold text-cyan-400 animate-pulse uppercase">
                SIRA SENDE
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 mb-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              KALAN BÜTÇE
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-cyan-400 font-mono tracking-tight">
                ${p2.budget}
              </span>
              <span className="text-xs text-zinc-500 font-mono">/ $20.00</span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-400 flex justify-between">
              <span>Harcanan:</span>
              <span className="font-mono text-zinc-300 font-semibold">${p2.spent}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
              <span>Kazanılan Depolar ({garages.filter((g) => g.wonBy === 'p2').length})</span>
            </div>
            <div className="space-y-2">
              {garages
                .filter((g) => g.wonBy === 'p2')
                .map((g) => (
                  <div
                    key={g.id}
                    className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between font-bold text-cyan-400">
                      <span>DEPO 0{g.number}</span>
                      <span className="font-mono">Ödenen: ${g.winningBid}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Piyasa Değeri:</span>
                      <span className="text-emerald-400 font-mono font-bold">${g.totalMarketValue}</span>
                    </div>
                  </div>
                ))}
              {garages.filter((g) => g.wonBy === 'p2').length === 0 && (
                <div className="p-4 text-center rounded-lg border border-dashed border-zinc-800 text-zinc-500 text-xs">
                  Henüz depo kazanılmadı
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kayıtlar Çekmecesi */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full p-5 flex flex-col shadow-2xl animate-slideLeft">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm uppercase font-['Chakra_Petch']">
                  Garaj Savaşları Kayıt Defteri
                </h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800 cursor-pointer"
              >
                Kapat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-2.5 rounded-lg border text-xs ${
                    entry.type === 'sold'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : entry.type === 'bid'
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
                      : entry.type === 'pass'
                      ? 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mb-1">
                    <span>DEPO #{entry.round}</span>
                    <span>{entry.timestamp}</span>
                  </div>
                  <div className="font-semibold">{entry.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
