// Quran Pages Data - 604 pages ka complete data
// Yeh actual Quran pages ki information hai

export const QURAN_PAGES = [
  // Page 1: Surah Al-Fatiha complete + Al-Baqarah start
  {
    id: 1,
    surahs: [
      {
        name: 'Al-Fatiha',
        arabic: 'الفاتحة',
        verses: [
          { id: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Most Gracious, the Most Merciful' },
          { id: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'All praise is due to Allah, Lord of the worlds' },
          // ... rest of Surah Al-Fatiha
        ]
      },
      {
        name: 'Al-Baqarah',
        arabic: 'البقرة',
        startVerse: 1,
        verses: [
          { id: 1, arabic: 'الٓمٓ', translation: 'Alif, Lam, Meem' },
          // ... first few verses of Al-Baqarah
        ]
      }
    ],
    juz: 1,
    sipara: 1
  },
  // Page 2... upto 604 pages
  // ...
  
  // Page 604: Surah An-Nas complete
  {
    id: 604,
    surahs: [
      {
        name: 'An-Nas',
        arabic: 'الناس',
        verses: [
          { id: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', translation: 'Say, "I seek refuge in the Lord of mankind' },
          // ... rest of Surah An-Nas
        ]
      }
    ],
    juz: 30,
    sipara: 30
  }
]

// Juz/Para information
export const JUZ_INFO = [
  { id: 1, name: 'الم', pages: '1-21' },
  { id: 2, name: 'سَيَقُولُ', pages: '22-41' },
  // ... up to 30
]

// Surah information with page numbers
export const SURAH_PAGES = [
  { id: 1, name: 'Al-Fatiha', arabic: 'الفاتحة', startPage: 1, endPage: 1, verses: 7 },
  { id: 2, name: 'Al-Baqarah', arabic: 'البقرة', startPage: 2, endPage: 49, verses: 286 },
  // ... all 114 Surahs
]