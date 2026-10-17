import React from 'react';
import {
  Watch,
  PenTool,
  Headphones,
  Eraser,
  Footprints,
  Mouse,
  Lamp,
  Backpack,
  CircleDot,
  Camera,
  Flame,
  Speaker,
  Keyboard,
  Sparkles,
  PackageOpen,
  Wrench,
  AudioWaveform,
  Trash2,
  Tv,
  Cpu,
  Bike,
  Dumbbell,
  Palette,
  Archive,
  BookOpen,
  Skull,
  HelpCircle,
} from 'lucide-react';

interface ItemIconProps {
  name: string;
  className?: string;
}

export const ItemIcon: React.FC<ItemIconProps> = ({ name, className = 'w-12 h-12' }) => {
  switch (name) {
    case 'Watch':
      return <Watch className={className} />;
    case 'PenTool':
      return <PenTool className={className} />;
    case 'Headphones':
      return <Headphones className={className} />;
    case 'Eraser':
      return <Eraser className={className} />;
    case 'Footprints':
      return <Footprints className={className} />;
    case 'Mouse':
      return <Mouse className={className} />;
    case 'Lamp':
      return <Lamp className={className} />;
    case 'Backpack':
      return <Backpack className={className} />;
    case 'CircleDot':
      return <CircleDot className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Speaker':
      return <Speaker className={className} />;
    case 'Keyboard':
      return <Keyboard className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'PackageOpen':
      return <PackageOpen className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'AudioWaveform':
      return <AudioWaveform className={className} />;
    case 'Trash2':
      return <Trash2 className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Bike':
      return <Bike className={className} />;
    case 'Dumbbell':
      return <Dumbbell className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Archive':
      return <Archive className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Skull':
      return <Skull className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
