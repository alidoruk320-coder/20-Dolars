import React, { useState, useEffect, useRef } from 'react';
import {
  Gavel,
  DollarSign,
  Clock,
  ArrowUpRight,
  Shield,
  History,
  AlertCircle,
  Sparkles,
  ChevronRight,
  User,
  ShoppingBag,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuctionItem, BidHistoryEntry, Player } from '../types/game';
import { sound } from '../utils/sound';
import { ItemIcon } from './ItemIcon';
import { ITEM_TEMPLATES } from '../data/itemsData';

interface ItemAuctionProps {
  player1: Player;
  player2: Player;
  items: AuctionItem[];
  timerDuration: number;
  onAuctionComplete: (p1: Player, p2: Player, updatedItems: AuctionItem[]) => void;
}

export const ItemAuction: React.FC<ItemAuctionProps> = ({
  player1: initialP1,
  player2: initialP2,
  items: initialItems,
  timerDuration,
  onAuctionComplete,
}) => {
  const [p1, setP1] = useState<Player>(initialP1);
  const [p2, setP2] = useState<Player>(initialP2);
  const [items, setItems] = useState<AuctionItem[]>(initialItems);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
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

  const [history, setHistory] = useState<BidHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const historyEndRef = useRef<HTMLDivElement>(null);

  const currentItem = items[currentIndex];
  const activePlayer = activePlayerId === 'p1' ? p1 : p2;
  const nonActivePlayer = activePlayerId === 'p1' ? p2 : p1;

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    const nextMin = currentBid > 0 ? currentBid + 1 : 1;
    setCustomBidAmount(Math.min(nextMin, activePlayer.budget));
  }, [currentBid, activePlayer.budget]);

  useEffect(() => {
    if (timerDuration <= 0 || saleResult !== null) return;

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
  }, [currentIndex, activePlayerId, saleResult, timerDuration]);

  const addHistory = (entry: Omit<BidHistoryEntry, 'id' | 'timestamp' | 'round'>) => {
    setHistory((prev) => [
      ...prev,
      {
        ...entry,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        round: currentIndex + 1,
      },
    ]);
  };

  const checkEarlyGameOver = (nextP1: Player, nextP2: Player) => {
    return nextP1.budget <= 0 && nextP2.budget <= 0;
  };

  const advanceToNextItem = (updatedItems: AuctionItem[], updatedP1: Player, updatedP2: Player) => {
    if (currentIndex + 1 >= updatedItems.length || checkEarlyGameOver(updatedP1, updatedP2)) {
      onAuctionComplete(updatedP1, updatedP2, updatedItems);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setCurrentBid(0);
      setLeadingPlayerId(null);
      setActivePlayerId(currentIndex % 2 === 0 ? 'p2' : 'p1');
      setTimeLeft(timerDuration);
      setSaleResult(null);
    }
  };

  const finalizeSale = (winnerId: 'p1' | 'p2' | null, finalPrice: number) => {
    sound.playGavelStrike();

    let updatedP1 = { ...p1 };
    let updatedP2 = { ...p2 };
    let updatedItems = [...items];

    if (winnerId !== null && finalPrice > 0) {
      if (winnerId === 'p1') {
        updatedP1.budget -= finalPrice;
        updatedP1.spent += finalPrice;
      } else {
        updatedP2.budget -= finalPrice;
        updatedP2.spent += finalPrice;
      }

      updatedItems[currentIndex] = {
        ...updatedItems[currentIndex],
        wonBy: winnerId,
        winningBid: finalPrice,
      };

      setP1(updatedP1);
      setP2(updatedP2);
      setItems(updatedItems);

      setSaleResult({
        status: 'sold',
        winnerId,
        amount: finalPrice,
      });

      addHistory({
        text: `SATILDI! $${finalPrice} karşılığında ${winnerId === 'p1' ? p1.name : p2.name} kazandı!`,
        type: 'sold',
        playerId: winnerId,
        amount: finalPrice,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: winnerId === 'p1' ? ['#f59e0b', '#fbbf24', '#ffffff'] : ['#06b6d4', '#22d3ee', '#ffffff'],
      });

      setTimeout(() => sound.playCashRegister(), 300);
    } else {
      updatedItems[currentIndex] = {
        ...updatedItems[currentIndex],
        wonBy: null,
        winningBid: 0,
      };
      setItems(updatedItems);

      setSaleResult({
        status: 'unsold',
        winnerId: null,
        amount: 0,
      });

      addHistory({
        text: `Eşya SATILAMADI. Her iki oyuncu da teklif vermeden pas geçti.`,
        type: 'unsold',
      });
    }

    setTimeout(() => {
      advanceToNextItem(updatedItems, updatedP1, updatedP2);
    }, 2200);
  };

  const handlePlaceBid = (amount: number) => {
    if (saleResult !== null) return;

    if (amount <= currentBid || amount > activePlayer.budget || leadingPlayerId === activePlayerId) {
      sound.playBuzzer();
      return;
    }

    sound.playBid();
    setCurrentBid(amount);
    setLeadingPlayerId(activePlayerId);

    addHistory({
      text: `${activePlayer.name} $${amount} teklif etti`,
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
      finalizeSale(activePlayerId, amount);
    }
  };

  const handlePass = (isTimeout: boolean = false) => {
    if (saleResult !== null) return;

    sound.playPass();
    addHistory({
      text: `${activePlayer.name} ${isTimeout ? 'süre dolduğu için PAS geçti' : 'PAS geçti'}`,
      type: 'pass',
      playerId: activePlayerId,
    });

    if (leadingPlayerId === null) {
      const otherPlayer = nonActivePlayer;
      if (otherPlayer.budget >= 1 && activePlayerId === 'p1') {
        setActivePlayerId('p2');
        setTimeLeft(timerDuration);
      } else {
        finalizeSale(null, 0);
      }
    } else {
      finalizeSale(leadingPlayerId, currentBid);
    }
  };

  const templateMatch = ITEM_TEMPLATES.find((t) => t.name === currentItem.name) || ITEM_TEMPLATES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex flex-col gap-5 min-h-[calc(100vh-70px)]">
      {/* Üst Bilgi Çubuğu */}
      <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 px-4 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-xs font-['Chakra_Petch'] uppercase tracking-wider">
            EŞYA {currentIndex + 1} / {items.length}
          </span>
          <span className="hidden sm:inline-block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {currentItem.category}
          </span>
        </div>

        {/* Sayaç */}
        {timerDuration > 0 && saleResult === null && (
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-500 animate-spin' : 'text-amber-400'}`} />
            <span
              className={`font-mono font-bold text-sm ${
                timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-zinc-200'
              }`}
            >
              {timeLeft}sn
            </span>
            <div className="w-20 sm:w-28 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 5 ? 'bg-rose-500' : timeLeft <= 10 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${(timeLeft / timerDuration) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Canlı Kayıt Butonu */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer transition-colors"
        >
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Canlı Kayıt</span>
          <span className="px-1.5 py-0.2 rounded bg-zinc-700 text-[10px] text-zinc-300 font-mono">
            {history.length}
          </span>
        </button>
      </div>

      {/* 3 Sütunlu Ana Saha Düzeni */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 1. OYUNCU PANELİ */}
        <div
          className={`lg:col-span-3 rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
            activePlayerId === 'p1' && saleResult === null
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
            {activePlayerId === 'p1' && saleResult === null && (
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
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Kazanılan Eşyalar ({items.filter((it) => it.wonBy === 'p1').length})</span>
              </span>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {items
                .filter((it) => it.wonBy === 'p1')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-zinc-200 font-medium truncate max-w-[130px]">{item.name}</span>
                    <span className="font-mono font-bold text-amber-400 text-[11px]">${item.winningBid}</span>
                  </div>
                ))}
              {items.filter((it) => it.wonBy === 'p1').length === 0 && (
                <div className="p-4 text-center rounded-lg border border-dashed border-zinc-800 text-zinc-500 text-xs">
                  Henüz eşya kazanılmadı
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ORTA MÜZAYEDE KÜRSÜSÜ */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center">
            {/* Rozet */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-bold text-zinc-300 uppercase tracking-widest">
                {templateMatch.badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>GİZLİ EKSPER DEĞERİ</span>
              </span>
            </div>

            {/* İkon Çerçevesi */}
            <div className="relative my-4 group">
              <div
                className={`w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-b ${templateMatch.visualTheme.bg} border ${templateMatch.visualTheme.border} ${templateMatch.visualTheme.glow} shadow-xl flex items-center justify-center p-6 transition-transform group-hover:scale-105 duration-300`}
              >
                <ItemIcon name={currentItem.imageUrl} className={`w-20 h-20 sm:w-24 sm:h-24 ${templateMatch.visualTheme.accent}`} />
              </div>
            </div>

            {/* Eşya Bilgileri */}
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Chakra_Petch'] tracking-wide uppercase mb-1">
              {currentItem.name}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-2 leading-relaxed">
              {currentItem.description}
            </p>
            <p className="text-[11px] italic text-zinc-500 font-medium">{templateMatch.flavorQuote}</p>

            {/* CANLI TEKLİF PANELİ */}
            <div className="w-full max-w-md mt-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 shadow-inner flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                MEVCUT EN YÜKSEK TEKLİF
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight">
                  ${currentBid}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                {leadingPlayerId ? (
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                      leadingPlayerId === 'p1'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    }`}
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    <span>Önde Olan: {leadingPlayerId === 'p1' ? p1.name : p2.name}</span>
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500 font-semibold tracking-wide">
                    HENÜZ TEKLİF YOK • AÇILIŞ $1
                  </span>
                )}
              </div>
            </div>

            {/* SATILDI / PAS OVERLAY STAMP */}
            {saleResult !== null && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-20 animate-fadeIn">
                <div
                  className={`p-6 sm:p-8 rounded-2xl border-4 transform -rotate-3 uppercase font-['Chakra_Petch'] font-black tracking-widest text-center shadow-2xl animate-bounce ${
                    saleResult.status === 'sold'
                      ? 'border-emerald-500 bg-emerald-950/80 text-emerald-400 shadow-emerald-500/40'
                      : 'border-zinc-600 bg-zinc-900/90 text-zinc-400'
                  }`}
                >
                  <div className="text-4xl sm:text-6xl mb-1">
                    {saleResult.status === 'sold' ? 'SATILDI!' : 'PAS GEÇİLDİ!'}
                  </div>
                  {saleResult.status === 'sold' ? (
                    <div className="text-sm sm:text-lg font-bold text-white tracking-wide">
                      ${saleResult.amount} karşılığında {saleResult.winnerId === 'p1' ? p1.name : p2.name} kazandı!
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-zinc-400 tracking-wide">
                      Kimse teklif vermedi — Eşya satılamadı
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-zinc-400 text-xs font-semibold animate-pulse">
                  <span>Sonraki eşyaya geçiliyor...</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* TEKLİF KONTROLLERİ */}
          {saleResult === null && (
            <div
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                activePlayerId === 'p1'
                  ? 'bg-zinc-900/90 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-900/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User
                    className={`w-4 h-4 ${activePlayerId === 'p1' ? 'text-amber-400' : 'text-cyan-400'}`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    {activePlayer.name}'in Teklif Sırası
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-zinc-400">
                  Kullanılabilir Bütçe: <strong className="text-white">${activePlayer.budget}</strong>
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

              {leadingPlayerId === activePlayerId && (
                <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 text-center">
                  Şu an ${currentBid} ile lider teklif sizde. {nonActivePlayer.name}'in kararı bekleniyor.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. OYUNCU PANELİ */}
        <div
          className={`lg:col-span-3 rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
            activePlayerId === 'p2' && saleResult === null
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
            {activePlayerId === 'p2' && saleResult === null && (
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
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Kazanılan Eşyalar ({items.filter((it) => it.wonBy === 'p2').length})</span>
              </span>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {items
                .filter((it) => it.wonBy === 'p2')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-zinc-200 font-medium truncate max-w-[130px]">{item.name}</span>
                    <span className="font-mono font-bold text-cyan-400 text-[11px]">${item.winningBid}</span>
                  </div>
                ))}
              {items.filter((it) => it.wonBy === 'p2').length === 0 && (
                <div className="p-4 text-center rounded-lg border border-dashed border-zinc-800 text-zinc-500 text-xs">
                  Henüz eşya kazanılmadı
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kayıt Defteri Çekmecesi */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full p-5 flex flex-col shadow-2xl animate-slideLeft">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm uppercase font-['Chakra_Petch']">
                  Müzayede Canlı Kayıt Defteri
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
              {history.length === 0 ? (
                <div className="text-zinc-500 text-center py-10">Henüz teklif hareketi kaydedilmedi.</div>
              ) : (
                history.map((entry) => (
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
                      <span>LOT #{entry.round}</span>
                      <span>{entry.timestamp}</span>
                    </div>
                    <div className="font-semibold">{entry.text}</div>
                  </div>
                ))
              )}
              <div ref={historyEndRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
