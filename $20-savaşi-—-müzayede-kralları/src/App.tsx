import React, { useState } from 'react';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { PlayerSetupModal } from './components/PlayerSetupModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ItemAuction } from './components/ItemAuction';
import { GarageWars } from './components/GarageWars';
import { ResultsScreen } from './components/ResultsScreen';
import { AuctionItem, GameMode, Garage, Player } from './types/game';
import { generateMode1Items, generateMode2Garages } from './data/itemsData';
import { sound } from './utils/sound';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'menu' | 'item-battle' | 'garage-wars' | 'results'
  >('menu');
  const [gameMode, setGameMode] = useState<GameMode>('items');

  // Player setup modal
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [muted, setMuted] = useState(sound.getMuted());

  // Match configurations
  const [timerDuration, setTimerDuration] = useState<number>(20);
  const [player1, setPlayer1] = useState<Player>({
    id: 'p1',
    name: 'Oyuncu 1',
    budget: 20,
    spent: 0,
    avatarColor: 'amber',
  });
  const [player2, setPlayer2] = useState<Player>({
    id: 'p2',
    name: 'Oyuncu 2',
    budget: 20,
    spent: 0,
    avatarColor: 'cyan',
  });

  // Game assets for current match
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [garages, setGarages] = useState<Garage[]>([]);

  // Sound toggle
  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setMuted(next);
    if (!next) {
      sound.playBid();
    }
  };

  // User selects a mode from main menu
  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    setIsSetupOpen(true);
  };

  // Start match with chosen player names
  const handleStartMatch = (p1Name: string, p2Name: string, duration: number) => {
    const freshP1: Player = {
      id: 'p1',
      name: p1Name,
      budget: 20,
      spent: 0,
      avatarColor: 'amber',
    };
    const freshP2: Player = {
      id: 'p2',
      name: p2Name,
      budget: 20,
      spent: 0,
      avatarColor: 'cyan',
    };

    setPlayer1(freshP1);
    setPlayer2(freshP2);
    setTimerDuration(duration);
    setIsSetupOpen(false);

    if (gameMode === 'items') {
      const freshItems = generateMode1Items();
      setItems(freshItems);
      setCurrentView('item-battle');
    } else {
      const freshGarages = generateMode2Garages();
      setGarages(freshGarages);
      setCurrentView('garage-wars');
    }
  };

  // Mode 1 completes
  const handleItemAuctionComplete = (
    finalP1: Player,
    finalP2: Player,
    finalItems: AuctionItem[]
  ) => {
    setPlayer1(finalP1);
    setPlayer2(finalP2);
    setItems(finalItems);
    setCurrentView('results');
  };

  // Mode 2 completes
  const handleGaragesComplete = (
    finalP1: Player,
    finalP2: Player,
    finalGarages: Garage[]
  ) => {
    setPlayer1(finalP1);
    setPlayer2(finalP2);
    setGarages(finalGarages);
    setCurrentView('results');
  };

  // Rematch with fresh data but keeping same player names
  const handlePlayAgain = () => {
    const resetP1: Player = { ...player1, budget: 20, spent: 0 };
    const resetP2: Player = { ...player2, budget: 20, spent: 0 };
    setPlayer1(resetP1);
    setPlayer2(resetP2);

    if (gameMode === 'items') {
      setItems(generateMode1Items());
      setCurrentView('item-battle');
    } else {
      setGarages(generateMode2Garages());
      setCurrentView('garage-wars');
    }
  };

  // Return to menu
  const handleReturnToMenu = () => {
    setCurrentView('menu');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header Bar */}
      <Header
        currentView={currentView}
        gameMode={currentView !== 'menu' ? gameMode : undefined}
        onReturnToMenu={handleReturnToMenu}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
      />

      {/* Main View Router */}
      <main className="relative">
        {currentView === 'menu' && (
          <MainMenu
            onSelectMode={handleSelectMode}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            muted={muted}
            onToggleSound={handleToggleSound}
          />
        )}

        {currentView === 'item-battle' && (
          <ItemAuction
            player1={player1}
            player2={player2}
            items={items}
            timerDuration={timerDuration}
            onAuctionComplete={handleItemAuctionComplete}
          />
        )}

        {currentView === 'garage-wars' && (
          <GarageWars
            player1={player1}
            player2={player2}
            garages={garages}
            timerDuration={timerDuration}
            onGaragesComplete={handleGaragesComplete}
          />
        )}

        {currentView === 'results' && (
          <ResultsScreen
            gameMode={gameMode}
            player1={player1}
            player2={player2}
            items={items}
            garages={garages}
            onPlayAgain={handlePlayAgain}
            onReturnToMenu={handleReturnToMenu}
          />
        )}
      </main>

      {/* Registration / Player Setup Modal */}
      <PlayerSetupModal
        isOpen={isSetupOpen}
        gameMode={gameMode}
        onClose={() => setIsSetupOpen(false)}
        onStartMatch={handleStartMatch}
      />

      {/* Rulebook Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
