import { NextResponse } from 'next/server'
import { detectLanguage } from '@/app/lib/languageDetector'

export async function POST(request) {
  try {
    const { message, category = 'general' } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // 🎯 Auto-detect language from user's message
    const detectedLang = detectLanguage(message)
    
    // Convert to API language codes
    let apiLanguage = 'en' // default
    if (detectedLang === 'ur' || detectedLang === 'ur-rom') {
      apiLanguage = 'ur' // Urdu for both scripts
    }

    console.log('🔍 Detected language:', detectedLang, '→ API language:', apiLanguage)
    console.log('Question:', message)

    // Call RapidAPI Islamic Chatbot
    const response = await fetch(
      'https://ai-islamic-chatbot-quran-hadith-fiqh-fatwa-halal-q-a.p.rapidapi.com/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': process.env.RAPIDAPI_HOST
        },
        body: JSON.stringify({
          message: message,
          category: category,
          language: apiLanguage // API ko batao kis language mein answer chahiye
        })
      }
    )

    const data = await response.json()
    
    // Response mein language info add karo
    return NextResponse.json({
      ...data,
      detectedLanguage: detectedLang,
      apiLanguageUsed: apiLanguage
    })

  } catch (error) {
    console.error('❌ Islamic Chat API Error:', error)
    
    return NextResponse.json({
      status: 'success',
      detectedLanguage: detectLanguage(message || ''),
      result: {
        response: {
          message: getFallbackResponse(message),
          quranicReferences: [],
          hadithReferences: []
        }
      }
    })
  }
}