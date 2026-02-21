// Quran API Service - Simplified version (Arabic only)

const API_BASE = process.env.NEXT_PUBLIC_QURAN_API_BASE || 'https://api.alquran.cloud/v1'

// Cache for API responses
const apiCache = new Map()

/**
 * Fetch Quran by Juz/Para - Arabic only
 * @param {number} juzNumber - Juz number (1-30)
 */
export async function fetchJuz(juzNumber) {
  const cacheKey = `juz-${juzNumber}-arabic`
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey)
  }

  try {
    // Fetch Arabic text only (Uthmani script)
    const arabicRes = await fetch(`${API_BASE}/juz/${juzNumber}/quran-uthmani`)
    const arabicData = await arabicRes.json()

    if (arabicData.code !== 200) {
      throw new Error('Failed to fetch Arabic text')
    }

    if (arabicData.code === 200) {
      // Format the data
      const formattedAyahs = arabicData.data.ayahs.map((ayah) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        juz: ayah.juz,
        page: ayah.page,
        arabic: ayah.text,
        surah: {
          name: ayah.surah?.name || 'Unknown',
          number: ayah.surah?.number || 1,
          englishName: ayah.surah?.englishName || ''
        }
      }))

      const result = {
        ...arabicData.data,
        ayahs: formattedAyahs
      }
      
      apiCache.set(cacheKey, result)
      return result
    }
    
    throw new Error('Failed to fetch juz')
  } catch (error) {
    console.error('Error fetching juz:', error)
    return null
  }
}

/**
 * Para/Juz information
 */
export const PARA_INFO = [
  { id: 1, name: 'الم', arabicName: 'الم', pages: '1-21', description: 'پارہ 1' },
  { id: 2, name: 'سَيَقُولُ', arabicName: 'سَيَقُولُ', pages: '22-41', description: 'پارہ 2' },
  { id: 3, name: 'تِلْكَ الرُّسُلُ', arabicName: 'تِلْكَ الرُّسُلُ', pages: '42-61', description: 'پارہ 3' },
  { id: 4, name: 'لَنْ تَنَالُوا', arabicName: 'لَنْ تَنَالُوا', pages: '62-81', description: 'پارہ 4' },
  { id: 5, name: 'وَالْمُحْصَنَاتُ', arabicName: 'وَالْمُحْصَنَاتُ', pages: '82-101', description: 'پارہ 5' },
  { id: 6, name: 'لَا يُحِبُّ اللَّهُ', arabicName: 'لَا يُحِبُّ اللَّهُ', pages: '102-121', description: 'پارہ 6' },
  { id: 7, name: 'وَإِذَا سَمِعُوا', arabicName: 'وَإِذَا سَمِعُوا', pages: '122-141', description: 'پارہ 7' },
  { id: 8, name: 'وَلَوْ أَنَّنَا', arabicName: 'وَلَوْ أَنَّنَا', pages: '142-161', description: 'پارہ 8' },
  { id: 9, name: 'قَالَ الْمَلَأُ', arabicName: 'قَالَ الْمَلَأُ', pages: '162-181', description: 'پارہ 9' },
  { id: 10, name: 'وَاعْلَمُوا', arabicName: 'وَاعْلَمُوا', pages: '182-201', description: 'پارہ 10' },
  { id: 11, name: 'يَعْتَذِرُونَ', arabicName: 'يَعْتَذِرُونَ', pages: '202-221', description: 'پارہ 11' },
  { id: 12, name: 'وَمَا مِنْ دَابَّةٍ', arabicName: 'وَمَا مِنْ دَابَّةٍ', pages: '222-241', description: 'پارہ 12' },
  { id: 13, name: 'وَمَا أُبَرِّئُ', arabicName: 'وَمَا أُبَرِّئُ', pages: '242-261', description: 'پارہ 13' },
  { id: 14, name: 'رُبَمَا', arabicName: 'رُبَمَا', pages: '262-281', description: 'پارہ 14' },
  { id: 15, name: 'سُبْحَانَ الَّذِي', arabicName: 'سُبْحَانَ الَّذِي', pages: '282-301', description: 'پارہ 15' },
  { id: 16, name: 'قَالَ أَلَمْ', arabicName: 'قَالَ أَلَمْ', pages: '302-321', description: 'پارہ 16' },
  { id: 17, name: 'اقْتَرَبَ لِلنَّاسِ', arabicName: 'اقْتَرَبَ لِلنَّاسِ', pages: '322-341', description: 'پارہ 17' },
  { id: 18, name: 'قَدْ أَفْلَحَ', arabicName: 'قَدْ أَفْلَحَ', pages: '342-361', description: 'پارہ 18' },
  { id: 19, name: 'وَقَالَ الَّذِينَ', arabicName: 'وَقَالَ الَّذِينَ', pages: '362-381', description: 'پارہ 19' },
  { id: 20, name: 'أَمَّنْ خَلَقَ', arabicName: 'أَمَّنْ خَلَقَ', pages: '382-401', description: 'پارہ 20' },
  { id: 21, name: 'اتْلُ مَا أُوحِيَ', arabicName: 'اتْلُ مَا أُوحِيَ', pages: '402-421', description: 'پارہ 21' },
  { id: 22, name: 'وَمَنْ يَقْنُتْ', arabicName: 'وَمَنْ يَقْنُتْ', pages: '422-441', description: 'پارہ 22' },
  { id: 23, name: 'وَمَا لِيَ', arabicName: 'وَمَا لِيَ', pages: '442-461', description: 'پارہ 23' },
  { id: 24, name: 'فَمَنْ أَظْلَمُ', arabicName: 'فَمَنْ أَظْلَمُ', pages: '462-481', description: 'پارہ 24' },
  { id: 25, name: 'إِلَيْهِ يُرَدُّ', arabicName: 'إِلَيْهِ يُرَدُّ', pages: '482-501', description: 'پارہ 25' },
  { id: 26, name: 'حم', arabicName: 'حم', pages: '502-521', description: 'پارہ 26' },
  { id: 27, name: 'قَالَ فَمَا خَطْبُكُمْ', arabicName: 'قَالَ فَمَا خَطْبُكُمْ', pages: '522-541', description: 'پارہ 27' },
  { id: 28, name: 'قَدْ سَمِعَ اللَّهُ', arabicName: 'قَدْ سَمِعَ اللَّهُ', pages: '542-561', description: 'پارہ 28' },
  { id: 29, name: 'تَبَارَكَ الَّذِي', arabicName: 'تَبَارَكَ الَّذِي', pages: '562-581', description: 'پارہ 29' },
  { id: 30, name: 'عَمَّ', arabicName: 'عَمَّ', pages: '582-604', description: 'پارہ 30' },
]