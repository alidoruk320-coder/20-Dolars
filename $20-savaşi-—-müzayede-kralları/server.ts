import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const port = Number(process.env.PORT) || 3000;
const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint for Gemini post-game analysis
app.post('/api/analyze-game', async (req, res) => {
  try {
    const {
      gameMode,
      player1,
      player2,
      deterministicWinner,
      isTie,
      matchSummary,
    } = req.body;

    if (!player1 || !player2) {
      return res.status(400).json({ error: 'Player data missing' });
    }

    if (!ai) {
      return res.status(503).json({
        available: false,
        error: 'GEMINI_API_KEY is not configured on the server. AI commentary is temporarily unavailable.',
      });
    }

    const systemInstruction = `Sen "$20 SAVAŞI — Müzayede Kralları" oyununun efsanevi, esprili, hızlı konuşan ve analiz ustası Türk açık artırma yöneticisisin (Müzayede Ustası).
Görevin, biten açık artırmayı tamamen TÜRKÇE olarak, yüksek enerji ve mizahla, verilere dayalı şekilde analiz etmektir.
KRİTİK KURALLAR:
1. Sana bildirilen resmi kazananı (${isTie ? 'BERABERLİK' : deterministicWinner}) KESİNLİKLE kabul et ve kazananı DEĞİŞTİRME. Matematiksel kural: Net Kâr = Kazanılan eşyaların tahmini piyasa değeri - Harcanan para.
2. Türkçe konuş, esprili ol, gereksiz uzun cümleler kurma (token tasarrufu sağla, vurucu ve öz konuş).
3. Hatalı aşırı teklifleri tatlı bir dille eleştir, kelepir kazançları öv.
4. Çıktıyı MUTLAKA istenen JSON şemasına uygun ver.`;

    const prompt = `Şu tamamlanan ${gameMode === 'garages' ? 'GARAJ SAVAŞLARI (3 Kilitli Depo)' : '$20 EŞYA SAVAŞI (15 Obje)'} maçını analiz et:

1. Oyuncu: ${player1.name}
- Kalan Bütçe: $${player1.remainingCash} / $20
- Toplam Harcanan: $${player1.totalSpent}
- Kazanılanlar: ${JSON.stringify(player1.itemsWon)}
- Toplam Piyasa Değeri: $${player1.totalMarketValue}
- Net Kâr: $${player1.netProfit}

2. Oyuncu: ${player2.name}
- Kalan Bütçe: $${player2.remainingCash} / $20
- Toplam Harcanan: $${player2.totalSpent}
- Kazanılanlar: ${JSON.stringify(player2.itemsWon)}
- Toplam Piyasa Değeri: $${player2.totalMarketValue}
- Net Kâr: $${player2.netProfit}

Resmi Kazanan: ${isTie ? 'BERABERLİK' : deterministicWinner}
Özet Bilgi: ${matchSummary || 'Çekişmeli 2 kişilik açık artırma.'}

Tüm analizleri TÜRKÇE yaz. En karlı kelepir alımı, en hatalı aşırı teklifi, oyuncuların taktiklerini ve dönüm noktasını özetle.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winnerHeadline: {
              type: Type.STRING,
              description: 'Türkçe dikkat çekici manşet (örn: "SOĞUKKANLI STRATEJİ: AHMET RİSK ALMADI, ZAFERİ KAPTI!")',
            },
            dramaticRecap: {
              type: Type.STRING,
              description: 'Türkçe 2-3 cümlelik heyecan verici maç özeti.',
            },
            strategyBreakdown: {
              type: Type.OBJECT,
              properties: {
                player1Critique: {
                  type: Type.STRING,
                  description: `${player1.name} oyuncusunun taktik değerlendirmesi (Türkçe).`,
                },
                player2Critique: {
                  type: Type.STRING,
                  description: `${player2.name} oyuncusunun taktik değerlendirmesi (Türkçe).`,
                },
              },
              required: ['player1Critique', 'player2Critique'],
            },
            bestBargain: {
              type: Type.OBJECT,
              properties: {
                itemName: { type: Type.STRING },
                playerName: { type: Type.STRING },
                paid: { type: Type.NUMBER },
                marketValue: { type: Type.NUMBER },
                commentary: { type: Type.STRING, description: 'Türkçe kısa yorum' },
              },
              required: ['itemName', 'playerName', 'paid', 'marketValue', 'commentary'],
            },
            worstPurchase: {
              type: Type.OBJECT,
              properties: {
                itemName: { type: Type.STRING },
                playerName: { type: Type.STRING },
                paid: { type: Type.NUMBER },
                marketValue: { type: Type.NUMBER },
                commentary: { type: Type.STRING, description: 'Türkçe kısa yorum' },
              },
              required: ['itemName', 'playerName', 'paid', 'marketValue', 'commentary'],
            },
            turningPoint: {
              type: Type.STRING,
              description: 'Maçın kaderini belirleyen kritik an veya teklif (Türkçe).',
            },
            auctionMasterVerdict: {
              type: Type.STRING,
              description: 'Müzayede Ustasının esprili kapanış sözü (Türkçe).',
            },
          },
          required: [
            'winnerHeadline',
            'dramaticRecap',
            'strategyBreakdown',
            'bestBargain',
            'worstPurchase',
            'turningPoint',
            'auctionMasterVerdict',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      available: true,
      analysis: parsed,
    });
  } catch (err: any) {
    console.error('Error analyzing game with Gemini:', err);
    return res.status(500).json({
      available: false,
      error: err?.message || 'Failed to process AI commentary.',
    });
  }
});

// Setup Vite middleware for development or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Auction Wars] Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
