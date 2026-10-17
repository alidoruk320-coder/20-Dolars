export type GameMode = 'items' | 'garages';

export interface Player {
  id: 'p1' | 'p2';
  name: string;
  budget: number; // Starts at 20
  spent: number;
  avatarColor: string;
}

export interface AuctionItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  estimatedMarketValue: number; // Hidden during bidding!
  wonBy: 'p1' | 'p2' | null;
  winningBid: number | null;
}

export interface GarageItem {
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedValue: number;
  rarity: 'junk' | 'common' | 'valuable' | 'jackpot';
  icon: string;
}

export interface Garage {
  id: string;
  number: number;
  title: string;
  theme: string;
  lore: string;
  clues: string[];
  mysteryIcon: string;
  items: GarageItem[];
  totalMarketValue: number;
  wonBy: 'p1' | 'p2' | null;
  winningBid: number | null;
  isRevealed: boolean;
}

export interface BidHistoryEntry {
  id: string;
  timestamp: string;
  round: number;
  text: string;
  type: 'bid' | 'pass' | 'sold' | 'unsold' | 'info';
  playerId?: 'p1' | 'p2';
  amount?: number;
}

export interface GeminiAnalysisResult {
  winnerHeadline: string;
  dramaticRecap: string;
  strategyBreakdown: {
    player1Critique: string;
    player2Critique: string;
  };
  bestBargain: {
    itemName: string;
    playerName: string;
    paid: number;
    marketValue: number;
    commentary: string;
  };
  worstPurchase: {
    itemName: string;
    playerName: string;
    paid: number;
    marketValue: number;
    commentary: string;
  };
  turningPoint: string;
  auctionMasterVerdict: string;
}
