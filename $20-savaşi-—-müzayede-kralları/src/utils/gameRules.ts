import { AuctionItem, Garage, Player } from '../types/game';

export interface ScoreReport {
  player1: {
    name: string;
    remainingCash: number;
    totalSpent: number;
    totalMarketValue: number;
    netProfit: number;
    itemsWonCount: number;
  };
  player2: {
    name: string;
    remainingCash: number;
    totalSpent: number;
    totalMarketValue: number;
    netProfit: number;
    itemsWonCount: number;
  };
  winnerId: 'p1' | 'p2' | 'draw';
  winnerName: string;
  isTie: boolean;
  tiebreakerReason?: string;
}

// Compute deterministic match results for Mode 1 ($20 Item Battle)
export function calculateItemBattleScore(
  player1: Player,
  player2: Player,
  items: AuctionItem[]
): ScoreReport {
  const p1Items = items.filter((it) => it.wonBy === 'p1');
  const p2Items = items.filter((it) => it.wonBy === 'p2');

  const p1Spent = p1Items.reduce((acc, it) => acc + (it.winningBid || 0), 0);
  const p2Spent = p2Items.reduce((acc, it) => acc + (it.winningBid || 0), 0);

  const p1Value = p1Items.reduce((acc, it) => acc + it.estimatedMarketValue, 0);
  const p2Value = p2Items.reduce((acc, it) => acc + it.estimatedMarketValue, 0);

  const p1NetProfit = p1Value - p1Spent;
  const p2NetProfit = p2Value - p2Spent;

  const p1Remaining = player1.budget;
  const p2Remaining = player2.budget;

  let winnerId: 'p1' | 'p2' | 'draw' = 'draw';
  let winnerName = 'Beraberlik';
  let isTie = false;
  let tiebreakerReason: string | undefined;

  if (p1NetProfit > p2NetProfit) {
    winnerId = 'p1';
    winnerName = player1.name;
  } else if (p2NetProfit > p1NetProfit) {
    winnerId = 'p2';
    winnerName = player2.name;
  } else {
    // Eşitlik bozma 1: Kalan nakit
    if (p1Remaining > p2Remaining) {
      winnerId = 'p1';
      winnerName = player1.name;
      tiebreakerReason = `Net kârlar eşit ($${p1NetProfit}), kalan nakit üstünlüğüyle ($${p1Remaining} vs $${p2Remaining}) ${player1.name} kazandı!`;
    } else if (p2Remaining > p1Remaining) {
      winnerId = 'p2';
      winnerName = player2.name;
      tiebreakerReason = `Net kârlar eşit ($${p2NetProfit}), kalan nakit üstünlüğüyle ($${p2Remaining} vs $${p1Remaining}) ${player2.name} kazandı!`;
    } else {
      // Eşitlik bozma 2: Toplam piyasa değeri
      if (p1Value > p2Value) {
        winnerId = 'p1';
        winnerName = player1.name;
        tiebreakerReason = `Kâr ve nakit eşit, toplam piyasa değeri ($${p1Value} vs $${p2Value}) ile ${player1.name} kazandı!`;
      } else if (p2Value > p1Value) {
        winnerId = 'p2';
        winnerName = player2.name;
        tiebreakerReason = `Kâr ve nakit eşit, toplam piyasa değeri ($${p2Value} vs $${p1Value}) ile ${player2.name} kazandı!`;
      } else {
        // Eşitlik bozma 3: Kazanılan eşya sayısı
        if (p1Items.length > p2Items.length) {
          winnerId = 'p1';
          winnerName = player1.name;
          tiebreakerReason = `Tüm kriterler eşit, daha çok eşya kazanan (${p1Items.length} vs ${p2Items.length}) ${player1.name} kazandı!`;
        } else if (p2Items.length > p1Items.length) {
          winnerId = 'p2';
          winnerName = player2.name;
          tiebreakerReason = `Tüm kriterler eşit, daha çok eşya kazanan (${p2Items.length} vs ${p1Items.length}) ${player2.name} kazandı!`;
        } else {
          winnerId = 'draw';
          winnerName = 'Beraberlik';
          isTie = true;
          tiebreakerReason = 'Her iki oyuncu da tüm kriterlerde tamamen eşit performans sergiledi!';
        }
      }
    }
  }

  return {
    player1: {
      name: player1.name,
      remainingCash: p1Remaining,
      totalSpent: p1Spent,
      totalMarketValue: p1Value,
      netProfit: p1NetProfit,
      itemsWonCount: p1Items.length,
    },
    player2: {
      name: player2.name,
      remainingCash: p2Remaining,
      totalSpent: p2Spent,
      totalMarketValue: p2Value,
      netProfit: p2NetProfit,
      itemsWonCount: p2Items.length,
    },
    winnerId,
    winnerName,
    isTie,
    tiebreakerReason,
  };
}

// Compute deterministic match results for Mode 2 (Garage Wars)
export function calculateGarageWarsScore(
  player1: Player,
  player2: Player,
  garages: Garage[]
): ScoreReport {
  const p1Garages = garages.filter((g) => g.wonBy === 'p1');
  const p2Garages = garages.filter((g) => g.wonBy === 'p2');

  const p1Spent = p1Garages.reduce((acc, g) => acc + (g.winningBid || 0), 0);
  const p2Spent = p2Garages.reduce((acc, g) => acc + (g.winningBid || 0), 0);

  const p1Value = p1Garages.reduce((acc, g) => acc + g.totalMarketValue, 0);
  const p2Value = p2Garages.reduce((acc, g) => acc + g.totalMarketValue, 0);

  const p1NetProfit = p1Value - p1Spent;
  const p2NetProfit = p2Value - p2Spent;

  const p1Remaining = player1.budget;
  const p2Remaining = player2.budget;

  let winnerId: 'p1' | 'p2' | 'draw' = 'draw';
  let winnerName = 'Beraberlik';
  let isTie = false;
  let tiebreakerReason: string | undefined;

  if (p1NetProfit > p2NetProfit) {
    winnerId = 'p1';
    winnerName = player1.name;
  } else if (p2NetProfit > p1NetProfit) {
    winnerId = 'p2';
    winnerName = player2.name;
  } else {
    // Eşitlik bozma 1: Kalan nakit
    if (p1Remaining > p2Remaining) {
      winnerId = 'p1';
      winnerName = player1.name;
      tiebreakerReason = `Net kârlar eşit ($${p1NetProfit}), kalan nakit ($${p1Remaining} vs $${p2Remaining}) ile ${player1.name} kazandı!`;
    } else if (p2Remaining > p1Remaining) {
      winnerId = 'p2';
      winnerName = player2.name;
      tiebreakerReason = `Net kârlar eşit ($${p2NetProfit}), kalan nakit ($${p2Remaining} vs $${p1Remaining}) ile ${player2.name} kazandı!`;
    } else {
      // Eşitlik bozma 2: Toplam kazanılan depo piyasa değeri
      if (p1Value > p2Value) {
        winnerId = 'p1';
        winnerName = player1.name;
        tiebreakerReason = `Kâr ve nakit eşit, toplam depo piyasa değeri ($${p1Value} vs $${p2Value}) ile ${player1.name} kazandı!`;
      } else if (p2Value > p1Value) {
        winnerId = 'p2';
        winnerName = player2.name;
        tiebreakerReason = `Kâr ve nakit eşit, toplam depo piyasa değeri ($${p2Value} vs $${p1Value}) ile ${player2.name} kazandı!`;
      } else {
        winnerId = 'draw';
        winnerName = 'Beraberlik';
        isTie = true;
        tiebreakerReason = 'Kâr, kalan para ve depo değeri tamamen eşit, dostça beraberlik!';
      }
    }
  }

  return {
    player1: {
      name: player1.name,
      remainingCash: p1Remaining,
      totalSpent: p1Spent,
      totalMarketValue: p1Value,
      netProfit: p1NetProfit,
      itemsWonCount: p1Garages.length,
    },
    player2: {
      name: player2.name,
      remainingCash: p2Remaining,
      totalSpent: p2Spent,
      totalMarketValue: p2Value,
      netProfit: p2NetProfit,
      itemsWonCount: p2Garages.length,
    },
    winnerId,
    winnerName,
    isTie,
    tiebreakerReason,
  };
}
