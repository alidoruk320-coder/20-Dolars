import React, { useState } from 'react';
import { X, Trophy, Warehouse, DollarSign, Brain, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'basics' | 'mode1' | 'mode2' | 'gemini'>('basics');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              ?
            </div>
            <h2 className="text-lg font-bold text-white font-['Chakra_Petch'] tracking-wide">
              MÜZAYEDE KURALLARI & REHBER
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playPass();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sekmeler */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-6 gap-2 pt-2">
          <button
            onClick={() => setTab('basics')}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              tab === 'basics'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Temel Kurallar
          </button>
          <button
            onClick={() => setTab('mode1')}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              tab === 'mode1'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Mod 1: Eşya Savaşı
          </button>
          <button
            onClick={() => setTab('mode2')}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              tab === 'mode2'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Mod 2: Garaj Savaşları
          </button>
          <button
            onClick={() => setTab('gemini')}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              tab === 'gemini'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Gemini Yapay Zeka
          </button>
        </div>

        {/* Sekme İçeriği */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-zinc-300 leading-relaxed">
          {tab === 'basics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-300">$20 Başlangıç Bütçesi Kuralı</h4>
                  <p className="text-xs text-amber-200/80 mt-1">
                    Her iki oyuncu da kesinlikle <strong>$20 nakit</strong> ile başlar. Paranız bittiğinde sonraki turlara teklif veremezsiniz! Bütçe disiplini zaferin anahtarıdır.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Teklif Dinamikleri</h4>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Sırayla Teklif:</strong> Oyuncular sırayla teklif artırır veya pas geçer.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Geçerli Teklifler:</strong> Yeni teklif mevcut en yüksek tekliften büyük olmalı ve kalan paranızı aşmamalıdır.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Pas & SATILDI:</strong> Bir oyuncu PAS dediğinde, rakip son geçerli teklifiyle eşyayı kazanır. Kimse teklif vermeden ikisi de pas geçerse eşya satılamaz.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Kazanma Formülü:</strong> Net Kâr = Kazanılan Eşyaların Toplam Piyasa Değeri − Harcanan Para.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'mode1' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-700/40 flex items-start gap-3">
                <Trophy className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-cyan-300">$20 Eşya Savaşı (15 Obje)</h4>
                  <p className="text-xs text-cyan-200/80 mt-1">
                    15 rastgele eşya teker teker açık artırmaya çıkar. Eşyaların gerçek piyasa değerleri teklif aşamasında <strong>gizlidir</strong>!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                  <h5 className="font-semibold text-white mb-1">Blöf ve Tuzaklar</h5>
                  <p className="text-zinc-400">
                    Rakibinizin çok istediğini fark ettiğiniz eşyalarda fiyatı şişirin, ardından tam zamanında PAS diyerek onu parasız bırakın!
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                  <h5 className="font-semibold text-white mb-1">Son Turlar Avantajı</h5>
                  <p className="text-zinc-400">
                    Rakibiniz ilk turlarda tüm parasını tüketirse, sonraki tüm değerli eşyaları rakipsiz olarak sadece $1'a toplayabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === 'mode2' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-700/40 flex items-start gap-3">
                <Warehouse className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-orange-300">Garaj Savaşları (3 Kilitli Depo)</h4>
                  <p className="text-xs text-orange-200/80 mt-1">
                    Kepenkleri kapalı 3 depoya kör teklifler verin. Dedikoduları, kutu etiketlerini ve fener gölgelerini inceleyin!
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                  <div className="font-semibold text-white">1. Kör Müzayede</div>
                  <p className="text-zinc-400 mt-0.5">
                    Açılış $1'dan başlar. Oyuncular içeride ne olduğunu tam bilmeden depoya teklif yarıştırır.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                  <div className="font-semibold text-white">2. Kepenk Açılışı & Eksper Raporu</div>
                  <p className="text-zinc-400 mt-0.5">
                    SATILDI tokmağı indiğinde motor çalışır, kepenk kalkar ve içindeki 4 eşya, teker teker gerçek değerleriyle gün yüzüne çıkar!
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === 'gemini' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-700/40 flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-purple-300">Gemini Yapay Zeka Müzayede Hakemi</h4>
                  <p className="text-xs text-purple-200/80 mt-1">
                    Google GenAI (gemini-3.1-flash-lite) ile desteklenen yapay zeka, maçın tüm teklif geçmişini, blöflerini, en iyi kelepir alımlarını ve fahiş hatalarını Türkçe analiz eder.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Deterministik Matematik Güvencesi</span>
                </div>
                <p className="text-zinc-400">
                  Kazanan yapay zeka tarafından rastgele seçilmez; kesin matematiksel kurallarla (Net Kâr, Kalan Para, Eşya Sayısı) belirlenir. Gemini ise sonucu esprili ve canlı bir anlatımla taçlandırır.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Alt Kısım */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/80 flex justify-end">
          <button
            onClick={() => {
              sound.playPass();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Anladım, Tekliflere Başlayalım!
          </button>
        </div>
      </div>
    </div>
  );
};
