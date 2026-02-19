// lib/islamApi.js
import { detectLanguage } from './languageDetector'

export async function searchIslamicContent(query, language = 'auto') {
  try {
    console.log('🔍 Searching Islamic AI for:', query)
    
    // Agar language 'auto' hai to detect karo
    const finalLanguage = language === 'auto' ? detectLanguage(query) : language
    
    const response = await fetch('/api/islamic-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: query,
        category: 'general',
        language: finalLanguage === 'ur-rom' ? 'ur' : finalLanguage // Roman Urdu ke liye bhi Urdu response
      })
    })

    const data = await response.json()
    
    if (data.result?.response) {
      const response_text = data.result.response.message || ''
      
      return {
        success: true,
        results: [{
          type: 'ai_response',
          title: 'Islamic AI Response',
          content: response_text,
          translation: response_text,
          source: 'AI Islamic Chatbot',
          detectedLanguage: data.detectedLanguage || finalLanguage,
          references: {
            quran: data.result.response.quranicReferences || [],
            hadith: data.result.response.hadithReferences || []
          }
        }],
        total: 1
      }
    } else {
      console.log('❌ No valid response from API')
      return getSmartFallback(query, finalLanguage)
    }
    
  } catch (error) {
    console.error('❌ Islamic AI Error:', error)
    return getSmartFallback(query, detectLanguage(query))
  }
}

// Smart fallback with language support
function getSmartFallback(query, language) {
  const q = query.toLowerCase()
  
  // Language-specific responses
  const fallbacks = {
    en: {
      namaz: {
        content: 'Salah (Prayer) is the second pillar of Islam. It is the ascension of the believer and prevents from evil deeds. Five daily prayers are obligatory: Fajr (2+2), Dhuhr (4+4+2), Asr (4), Maghrib (3+2), Isha (4+2+3).'
      },
      ramzan: {
        content: 'Ramzan is the 9th month of Islamic calendar. It\'s a month of mercy, forgiveness, and salvation. Fasting is obligatory and Quran was revealed in this month.'
      },
      default: {
        content: 'You can ask about any Islamic topic. Please ask your question clearly.'
      }
    },
    ur: {
      namaz: {
        content: 'نماز اسلام کا دوسرا رکن ہے۔ یہ مومن کی معراج ہے اور برائیوں سے روکتی ہے۔ نماز روزانہ 5 وقت فرض ہے: فجر (2+2), ظہر (4+4+2), عصر (4), مغرب (3+2), عشاء (4+2+3)۔'
      },
      ramzan: {
        content: 'رمضان المبارک اسلامی کیلنڈر کا نواں مہینہ ہے۔ یہ رحمت، مغفرت اور جہنم سے نجات کا مہینہ ہے۔ اس میں روزے فرض ہیں اور قرآن نازل ہوا۔'
      },
      default: {
        content: 'آپ کسی بھی اسلامی موضوع کے بارے میں پوچھ سکتے ہیں۔ براہ کرم اپنا سوال واضح طور پر پوچھیں۔'
      }
    }
  }

  // Select language
  const langData = language === 'ur' || language === 'ur-rom' ? fallbacks.ur : fallbacks.en
  
  // Select appropriate response
  let selected = langData.default
  if (q.includes('namaz') || q.includes('prayer') || q.includes('نماز')) {
    selected = langData.namaz
  } else if (q.includes('ramzan') || q.includes('roza') || q.includes('رمضان')) {
    selected = langData.ramzan
  }

  return {
    success: true,
    results: [{
      type: 'fallback',
      title: language === 'ur' ? 'اسلامک نالج' : 'Islamic Knowledge',
      content: selected.content,
      translation: selected.content,
      source: 'Knowledge Base',
      detectedLanguage: language
    }],
    total: 1
  }
}