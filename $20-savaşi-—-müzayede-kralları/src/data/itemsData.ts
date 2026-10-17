import { AuctionItem, Garage, GarageItem } from '../types/game';

// Mod 1: 16 Farklı Müzayede Eşyası (Türkçe)
interface ItemTemplate {
  name: string;
  category: string;
  description: string;
  badge: string;
  iconName: string;
  baseMinVal: number;
  baseMaxVal: number;
  flavorQuote: string;
  visualTheme: {
    bg: string;
    border: string;
    glow: string;
    accent: string;
  };
}

export const ITEM_TEMPLATES: ItemTemplate[] = [
  {
    name: 'Vintage Kurmalı Kol Saati',
    category: 'Lüks & Antika',
    description: '1968 yapımı İsviçre üretimi, orijinal deri kordonlu ve patinalı kadranlı mekanik saat.',
    badge: 'KOLEKSİYONLUK',
    iconName: 'Watch',
    baseMinVal: 12,
    baseMaxVal: 24,
    flavorQuote: '“Tıkır tıkır çalışıyor, gerçek bir zaman makinesi.”',
    visualTheme: {
      bg: 'from-amber-950/40 via-amber-900/20 to-black',
      border: 'border-amber-500/40',
      glow: 'shadow-amber-500/20',
      accent: 'text-amber-400',
    },
  },
  {
    name: 'Pirinç Gövdeli Teknik Kalem',
    category: 'Kırtasiye',
    description: 'Mimar ve mühendislerin gözdesi, ağır pirinç gövdeli 0.5mm hassas mekanik kurşun kalem.',
    badge: 'PROFESYONEL',
    iconName: 'PenTool',
    baseMinVal: 3,
    baseMaxVal: 8,
    flavorQuote: '“Elde kusursuz dengelenmiş cerrahi çizim hassasiyeti.”',
    visualTheme: {
      bg: 'from-zinc-900 via-stone-900/40 to-black',
      border: 'border-zinc-500/40',
      glow: 'shadow-zinc-500/20',
      accent: 'text-zinc-300',
    },
  },
  {
    name: 'Stüdyo Kablosuz Kulaklık',
    category: 'Elektronik',
    description: 'Aktif gürültü engelleyici (ANC), alüminyum menteşeli ve hafızalı köpük yastıklı kulak üstü model.',
    badge: 'YÜKSEK TALEP',
    iconName: 'Headphones',
    baseMinVal: 10,
    baseMaxVal: 22,
    flavorQuote: '“Dış dünyayı tamamen unutturan saf stüdyo akustik kalitesi.”',
    visualTheme: {
      bg: 'from-cyan-950/40 via-sky-950/20 to-black',
      border: 'border-cyan-500/40',
      glow: 'shadow-cyan-500/20',
      accent: 'text-cyan-400',
    },
  },
  {
    name: 'Hamur & Polimer Sanat Silgisi',
    category: 'Kırtasiye',
    description: 'Yüksek yoğunluklu özel polimer blok. Sade görünür ancak sıfır iz bırakır.',
    badge: 'MÜTEVAZI CEVHER',
    iconName: 'Eraser',
    baseMinVal: 1,
    baseMaxVal: 4,
    flavorQuote: '“Görünüşe aldanmayın, her sanatçının gizli silahı.”',
    visualTheme: {
      bg: 'from-rose-950/30 via-neutral-900 to-black',
      border: 'border-rose-500/40',
      glow: 'shadow-rose-500/20',
      accent: 'text-rose-400',
    },
  },
  {
    name: 'Retro Sokak Spor Ayakkabısı',
    category: 'Moda & Giyim',
    description: 'Özel renk kutusunda saklanmış, hiç giyilmemiş deadstock basketbol tabanlı retro sneaker.',
    badge: 'SOKAK MODASI',
    iconName: 'Footprints',
    baseMinVal: 11,
    baseMaxVal: 25,
    flavorQuote: '“Orijinal kutusunda, tabanı asfalta dahi değmemiş.”',
    visualTheme: {
      bg: 'from-purple-950/40 via-violet-900/20 to-black',
      border: 'border-purple-500/40',
      glow: 'shadow-purple-500/20',
      accent: 'text-purple-400',
    },
  },
  {
    name: 'Ergonomik Espor Mouse',
    category: 'Elektronik',
    description: 'Ultra hafif petek gövdeli, 26.000 DPI optik sensörlü ve altın kaplama anahtarlı oyuncu faresi.',
    badge: 'ESPOR EKİPMANI',
    iconName: 'Mouse',
    baseMinVal: 7,
    baseMaxVal: 16,
    flavorQuote: '“Milisaniyelik refleks avantajı sağlar.”',
    visualTheme: {
      bg: 'from-emerald-950/40 via-teal-950/20 to-black',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      accent: 'text-emerald-400',
    },
  },
  {
    name: 'Endüstriyel Masa Lambası',
    category: 'Ev & Dekorasyon',
    description: 'Eklemli fırçalanmış çelik gövde ve nostaljik sarı Edison ampullü döküm demir çalışma lambası.',
    badge: 'MİMARİ TASARIM',
    iconName: 'Lamp',
    baseMinVal: 5,
    baseMaxVal: 13,
    flavorQuote: '“Ağır döküm tabanıyla hem dayanıklı hem çok şık.”',
    visualTheme: {
      bg: 'from-yellow-950/40 via-stone-900 to-black',
      border: 'border-yellow-500/40',
      glow: 'shadow-yellow-500/20',
      accent: 'text-yellow-400',
    },
  },
  {
    name: 'Taktik Seyahat Sırt Çantası',
    category: 'Outdoor & Seyahat',
    description: '35L balistik naylon, su geçirmez fermuarlar, korumalı dizüstü bilgisayar bölmesi ve modüler askılar.',
    badge: 'AĞIR HİZMET',
    iconName: 'Backpack',
    baseMinVal: 8,
    baseMaxVal: 17,
    flavorQuote: '“Şehir ve vahşi doğa koşullarına dayanıklı dikişler.”',
    visualTheme: {
      bg: 'from-lime-950/30 via-stone-900 to-black',
      border: 'border-lime-500/40',
      glow: 'shadow-lime-500/20',
      accent: 'text-lime-400',
    },
  },
  {
    name: 'Şampiyona Basketbol Topu',
    category: 'Spor',
    description: 'Gerçek kompozit deri, derin tırtıklı kanallarla kusursuz tutuş sağlayan salon maç topu.',
    badge: 'RESMİ MAÇ TOPU',
    iconName: 'CircleDot',
    baseMinVal: 4,
    baseMaxVal: 11,
    flavorQuote: '“Deri kokusu üstünde, parkede sekmeye hazır.”',
    visualTheme: {
      bg: 'from-orange-950/40 via-red-950/20 to-black',
      border: 'border-orange-500/40',
      glow: 'shadow-orange-500/20',
      accent: 'text-orange-400',
    },
  },
  {
    name: '35mm Mekanik Telemetre Fotoğraf Makinesi',
    category: 'Fotoğrafçılık',
    description: 'Japon yapımı f/1.7 40mm kaplamalı lense sahip pirinç gövdeli analog film makinesi.',
    badge: 'NADİR ANTİKA',
    iconName: 'Camera',
    baseMinVal: 14,
    baseMaxVal: 28,
    flavorQuote: '“Saf mekanik fotoğrafçılık hazzı.”',
    visualTheme: {
      bg: 'from-indigo-950/40 via-slate-900 to-black',
      border: 'border-indigo-500/40',
      glow: 'shadow-indigo-500/20',
      accent: 'text-indigo-400',
    },
  },
  {
    name: 'Akçaağaç Kaykay (Pro Deck)',
    category: 'Spor',
    description: '7 kat Kanada akçaağacından preslenmiş, ABEC-9 rulmanlı ve üretan tekerlekli kaykay.',
    badge: 'SOKAK KAYKAYI',
    iconName: 'Flame',
    baseMinVal: 6,
    baseMaxVal: 15,
    flavorQuote: '“Özel grafiti alt baskısıyla sokakların efendisi.”',
    visualTheme: {
      bg: 'from-red-950/40 via-zinc-900 to-black',
      border: 'border-red-500/40',
      glow: 'shadow-red-500/20',
      accent: 'text-red-400',
    },
  },
  {
    name: 'Suya Dayanıklı Bluetooth Hoparlör',
    category: 'Elektronik',
    description: 'IPX7 sertifikalı, çift pasif bas radyatörlü ve 15 saat pil ömürlü taşınabilir silindir hoparlör.',
    badge: 'PORTATİF SES',
    iconName: 'Speaker',
    baseMinVal: 6,
    baseMaxVal: 14,
    flavorQuote: '“Cebinize sığan devasa akustik güç.”',
    visualTheme: {
      bg: 'from-teal-950/40 via-cyan-950/20 to-black',
      border: 'border-teal-500/40',
      glow: 'shadow-teal-500/20',
      accent: 'text-teal-400',
    },
  },
  {
    name: 'Özel Mekanik Klavye (%65)',
    category: 'Elektronik',
    description: 'CNC alüminyum kasa, çalışırken değiştirilebilir (hot-swap) ses yalıtımlı tuş anahtarları.',
    badge: 'ÖZEL YAPIM',
    iconName: 'Keyboard',
    baseMinVal: 10,
    baseMaxVal: 21,
    flavorQuote: '“Yazarken çıkardığı tok ses tam bir terapi.”',
    visualTheme: {
      bg: 'from-blue-950/40 via-indigo-950/20 to-black',
      border: 'border-blue-500/40',
      glow: 'shadow-blue-500/20',
      accent: 'text-blue-400',
    },
  },
  {
    name: 'İmzalı Koleksiyon Figürü',
    category: 'Koleksiyon',
    description: 'Orijinal ambalajında, fuar hologram etiketli ve yaratıcısının altın yaldızlı imzasını taşıyan figür.',
    badge: 'KUTUSUNDA SIFIR',
    iconName: 'Sparkles',
    baseMinVal: 7,
    baseMaxVal: 19,
    flavorQuote: '“Koleksiyoner borsalarında kapış kapış giden parça.”',
    visualTheme: {
      bg: 'from-pink-950/40 via-rose-950/20 to-black',
      border: 'border-pink-500/40',
      glow: 'shadow-pink-500/20',
      accent: 'text-pink-400',
    },
  },
  {
    name: 'Mühürlü Gizemli Sandık',
    category: 'Sürpriz Kutu',
    description: 'Gümrük tasfiyesinden kalma kilitli ahşap sandık. Ağır, üzeri mühürlü ve içeriği meçhul!',
    badge: 'YÜKSEK RİSK / HAZİNE',
    iconName: 'PackageOpen',
    baseMinVal: 2,
    baseMaxVal: 27,
    flavorQuote: '“İçinden paha biçilmez bir hazine de çıkabilir, paslı çiviler de!”',
    visualTheme: {
      bg: 'from-amber-900/40 via-purple-950/30 to-black',
      border: 'border-amber-400/60',
      glow: 'shadow-amber-400/30',
      accent: 'text-amber-300',
    },
  },
  {
    name: 'İsviçre Çakısı & Çok Amaçlı Alet',
    category: 'El Aletleri',
    description: '14 fonksiyonlu paslanmaz çelik cep pensesi, tel kesici, testere ve tornavida seti.',
    badge: 'GÜNLÜK TAŞIMA',
    iconName: 'Wrench',
    baseMinVal: 5,
    baseMaxVal: 12,
    flavorQuote: '“Avucunuzun içinde taşınabilir bir alet çantası.”',
    visualTheme: {
      bg: 'from-zinc-800/40 via-neutral-900 to-black',
      border: 'border-neutral-400/40',
      glow: 'shadow-neutral-400/20',
      accent: 'text-neutral-200',
    },
  },
];

// Mod 1 için 15 rastgele eşya oluşturur
export function generateMode1Items(): AuctionItem[] {
  const shuffled = [...ITEM_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 15);

  return selected.map((tpl, index) => {
    const val = Math.floor(Math.random() * (tpl.baseMaxVal - tpl.baseMinVal + 1)) + tpl.baseMinVal;

    return {
      id: `item-${index + 1}-${tpl.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: tpl.name,
      category: tpl.category,
      description: tpl.description,
      imageUrl: tpl.iconName,
      estimatedMarketValue: val,
      wonBy: null,
      winningBid: null,
    };
  });
}

// Mod 2: Garaj Savaşları 3 Farklı Kilitli Depo
export function generateMode2Garages(): Garage[] {
  // Depo 01: Eski Ses Stüdyosu & Retro Elektronik Laboratuvarı
  const techPool: GarageItem[] = [
    {
      id: 'g1-1',
      name: 'Modüler Analog Müzik Sentezleyici',
      category: 'Ses & Müzik',
      description: 'Eski nesil jak kablolu synth modülü. Elektronik müzik prodüktörlerinin rüyası.',
      estimatedValue: Math.floor(Math.random() * 8) + 12, // 12-19
      rarity: 'valuable',
      icon: 'AudioWaveform',
    },
    {
      id: 'g1-2',
      name: 'Dolaşık SCSI Kabloları & Bitmiş Piller',
      category: 'Hurda',
      description: 'Hiçbir piyasa değeri olmayan elektronik atık kutusu.',
      estimatedValue: 1,
      rarity: 'junk',
      icon: 'Trash2',
    },
    {
      id: 'g1-3',
      name: 'Nostaljik Tüplü CRT Oyun Monitörü',
      category: 'Elektronik',
      description: 'Sıfır gecikmeli retro dövüş oyunları meraklılarının aradığı tüplü ekran.',
      estimatedValue: Math.floor(Math.random() * 5) + 6, // 6-10
      rarity: 'common',
      icon: 'Tv',
    },
    {
      id: 'g1-4',
      name: '90’lar Orijinal Kutusunda Mikroişlemci',
      category: 'Koleksiyon',
      description: 'Altın kaplama bacaklı, antistatik poşetinde hiç açılmamış CPU.',
      estimatedValue: Math.floor(Math.random() * 6) + 4, // 4-9
      rarity: 'common',
      icon: 'Cpu',
    },
  ];

  // Depo 02: Ustanın Garajı & Bisiklet & Kamp Ekipmanları
  const sportsPool: GarageItem[] = [
    {
      id: 'g2-1',
      name: 'Ağır Hizmet 20V Akülü Vidalama Seti',
      category: 'El Aletleri',
      description: 'Kömürsüz darbeli matkap ve çift 5.0Ah lityum bataryalı profesyonel çanta.',
      estimatedValue: Math.floor(Math.random() * 7) + 10, // 10-16
      rarity: 'valuable',
      icon: 'Wrench',
    },
    {
      id: 'g2-2',
      name: 'Karbon Fiber Yarış Bisikleti Kadrosu',
      category: 'Bisiklet',
      description: 'Tüy gibi hafif monokok karbon gövde. Temizlenirse servet eder.',
      estimatedValue: Math.floor(Math.random() * 10) + 14, // 14-23
      rarity: 'valuable',
      icon: 'Bike',
    },
    {
      id: 'g2-3',
      name: 'Patlak Egzersiz Topları & Yırtık Mat',
      category: 'Hurda',
      description: 'Çürümüş kauçuk ve fare kemirmiş sünger parçaları.',
      estimatedValue: 1,
      rarity: 'junk',
      icon: 'Dumbbell',
    },
    {
      id: 'g2-4',
      name: 'Titanyum Kamp Pişirme Tencere Seti',
      category: 'Outdoor',
      description: 'Ultra hafif sırt çantası uyumlu katlanır kamp ocağı ve tenceresi.',
      estimatedValue: Math.floor(Math.random() * 4) + 4, // 4-7
      rarity: 'common',
      icon: 'Flame',
    },
  ];

  // Depo 03: Eski Malikâne Sandığı & Gizemli Antikalar (Büyük Risk / Büyük Hazine)
  const isJackpot = Math.random() > 0.4; // %60 hazine, %40 sahte tablo
  const antiquePool: GarageItem[] = [
    {
      id: 'g3-1',
      name: isJackpot ? 'İmzalı Orijinal 1960’lar Yağlı Boya Tablo' : 'Plastik Çerçeveli Soluk Otel Baskısı',
      category: isJackpot ? 'Sanat Eseri' : 'Hurda',
      description: isJackpot
        ? 'Dönemin ünlü avangart ressamına ait eksper onaylı orijinal tuval üzeri yağlı boya.'
        : 'Plastik yaldızlı çerçeveye zımbalanmış seri üretim soluk poster.',
      estimatedValue: isJackpot ? Math.floor(Math.random() * 8) + 24 : 2, // 24-31 veya 2
      rarity: isJackpot ? 'jackpot' : 'junk',
      icon: 'Palette',
    },
    {
      id: 'g3-2',
      name: 'Viktorya Dönemi Meşe Mücevher Sandığı',
      category: 'Antika',
      description: 'Masif meşe ağacından, kadife kaplı çekmeceli ve pirinç kilitli antika sandık.',
      estimatedValue: Math.floor(Math.random() * 6) + 7, // 7-12
      rarity: 'common',
      icon: 'Archive',
    },
    {
      id: 'g3-3',
      name: 'Nadir Birinci Baskı Bilim Kurgu Kitap Üçlemesi',
      category: 'Kitap',
      description: 'Koleksiyonluk özel kılıflarında saklanmış ilk baskı romanlar.',
      estimatedValue: Math.floor(Math.random() * 5) + 6, // 6-10
      rarity: 'common',
      icon: 'BookOpen',
    },
    {
      id: 'g3-4',
      name: 'Kırık Porselen Biblolar & Çatlak Ayna Parçaları',
      category: 'Hurda',
      description: 'Onarılamaz derecede ufalanmış porselen parçaları.',
      estimatedValue: 0,
      rarity: 'junk',
      icon: 'Skull',
    },
  ];

  const calcTotal = (items: GarageItem[]) => items.reduce((sum, it) => sum + it.estimatedValue, 0);

  return [
    {
      id: 'garage-01',
      number: 1,
      title: 'DEPO 104 — RETRO TEKNOLOJİ MAHSENİ',
      theme: 'Vintage Elektronik, Sentezleyici & Kablo Yığınları',
      lore: 'Asma kilit paslanmış. Kepengin alt aralığından baktığımızda eski stüdyo cihazlarının ışıkları ve antistatik kutular sezildi.',
      clues: [
        'Kondansatör ve eski adaptörlerden gelen hafif bir uğultu duyuldu',
        'Ağır bir CRT tüplü monitörün silüeti görünüyor',
        'Kutu üzeri not: "STÜDYO ARŞİVİ - EZMEYİNİZ"',
      ],
      mysteryIcon: 'AudioWaveform',
      items: techPool,
      totalMarketValue: calcTotal(techPool),
      wonBy: null,
      winningBid: null,
      isRevealed: false,
    },
    {
      id: 'garage-02',
      number: 2,
      title: 'DEPO 219 — USTANIN GİZLİ CEVHERİ',
      theme: 'El Aletleri, Karbon Bisiklet & Kamp Teçhizatı',
      lore: 'Ağır zincirli kepenk. İçeriden makine yağı, yeni bisiklet lastiği ve sedir talaşı kokusu geliyor.',
      clues: [
        'Sarı kilitli ağır plastik takım çantaları seçilebiliyor',
        'Hafif yarış bisikleti borularının keskin gölgesi',
        'Kapak etiketi: "ŞANTİYE ARACI #4"',
      ],
      mysteryIcon: 'Wrench',
      items: sportsPool,
      totalMarketValue: calcTotal(sportsPool),
      wonBy: null,
      winningBid: null,
      isRevealed: false,
    },
    {
      id: 'garage-03',
      number: 3,
      title: 'DEPO 308 — MALİKÂNE ARŞİVİ #8',
      theme: 'Tozlu Antikalar, Yağlı Boya Tablo & Gizemli Eşyalar',
      lore: 'Köşelerde örümcek ağları sarmış. Kasabadan ayrılan eski bir koleksiyonere ait olduğu söyleniyor. Muazzam kâr veya tam bir fiyasko!',
      clues: [
        'Tozlu örtünün altında altın varaklı tablo çerçevesi gölgesi',
        'Fener ışığında parlayan ağır pirinç çekmece kulpları',
        'Çerçeveye iliştirilmiş not: "EKSPER RAPORU BEKLİYOR - NEMDEN KORUYUN"',
      ],
      mysteryIcon: 'Palette',
      items: antiquePool,
      totalMarketValue: calcTotal(antiquePool),
      wonBy: null,
      winningBid: null,
      isRevealed: false,
    },
  ];
}
