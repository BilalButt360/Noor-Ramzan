'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchIslamicContent } from '../lib/islamApi'

// 🔍 Language detection function for text alignment
function getTextDirection(text, detectedLanguage) {
  // Agar API ne language detect ki hai to use karo
  if (detectedLanguage === 'ur' || detectedLanguage === 'ur-rom') {
    return 'right'
  }
  
  // Fallback: Arabic/Urdu script check
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  if (arabicPattern.test(text)) {
    return 'right'
  }
  
  // Default English/Roman Urdu left aligned
  return 'left'
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'ai',
        content: {
          urdu: 'السلام علیکم! 🌙 میں AI Islamic Assistant ہوں۔ رمضان، نماز، قرآن، دعاؤں یا کسی بھی اسلامی موضوع کے بارے میں پوچھیں!',
          english: 'Assalam-o-Alaikum! 🌙 I\'m AI Islamic Assistant. Ask me about Ramzan, Prayer, Quran, Duas or any Islamic topic!',
          detectedLanguage: 'ur'
        },
        timestamp: new Date()
      }])
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      detectedLanguage: detectLanguage(inputValue), // User message ki bhi language detect karo
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const result = await searchIslamicContent(inputValue, 'auto')
      
      if (result.results && result.results.length > 0) {
        const res = result.results[0]
        
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai',
          content: {
            urdu: res.content,
            english: res.translation || res.content,
            detectedLanguage: res.detectedLanguage || 'ur',
            followUp: res.followUp || []
          },
          references: res.references,
          timestamp: new Date()
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        content: {
          urdu: 'کچھ مسئلہ ہو گیا ہے۔ براہ کرم دوبارہ کوشش کریں۔',
          english: 'Something went wrong. Please try again.',
          detectedLanguage: 'ur'
        },
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // 🎯 Smart Language Detection
  function detectLanguage(text) {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
    const romanUrduPattern = /\b(?:kya|hai|hain|ka|ki|ko|se|mein|tha|the|raha|rahi|kar|karo|karta|karti|aap|tum|hum|woh|yeh|mera|tera|apna|namaz|roza|ramzan|dua|quran|allah|muslim|islam)\b/i;
    
    if (arabicPattern.test(text)) {
      return 'ur'
    }
    
    if (romanUrduPattern.test(text)) {
      return 'ur-rom'
    }
    
    return 'en'
  }


  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-2xl hover:shadow-emerald-500/50 flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-3xl">🤖</span>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[450px] h-[600px] bg-white dark:bg-[#0d1b2a] rounded-3xl shadow-2xl border border-gray-200 dark:border-emerald-900/40 overflow-hidden flex flex-col top-10"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h3 className="font-bold">AI Islamic Assistant</h3>
                      <p className="text-xs text-emerald-200">Powered by Noor Ramzan</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-[#0a1520]">
                {messages.map((msg) => {
                  // 🎯 Determine text direction for this message
                  const direction = getTextDirection(
                    msg.type === 'ai' ? msg.content.urdu : msg.content,
                    msg.type === 'ai' ? msg.content.detectedLanguage : msg.detectedLanguage
                  )
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 ${
                          msg.type === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                        }`}
                        // 🔥 Smart text alignment based on language
                        style={{ textAlign: direction }}
                      >
                        {msg.type === 'ai' ? (
                          <>
                            {/* 🔥 Main Content with Dynamic Alignment */}
                            <p 
                              className={`text-sm mb-2 leading-relaxed ${
                                direction === 'right' ? 'font-arabic text-right' : ''
                              }`}
                              style={{ 
                                direction: direction === 'right' ? 'rtl' : 'ltr',
                                textAlign: direction === 'right' ? 'right' : 'left'
                              }}
                            >
                              {msg.content.urdu}
                            </p>
                            
                            {/* English Translation (always left-aligned) */}
                            {/* <p 
                              className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2 mt-1"
                              style={{ textAlign: 'left' }}
                            >
                              {msg.content.english}
                            </p> */}
                            
                            {/* References */}
                            {msg.references?.quran?.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                                  📖 Quranic References:
                                </p>
                                {msg.references.quran.map((ref, i) => (
                                  <p key={i} className="text-xs text-gray-500 dark:text-gray-400">
                                    • {ref}
                                  </p>
                                ))}
                              </div>
                            )}
                            
                            {/* Follow-up Suggestions */}
                            {msg.content.followUp?.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                                  🔍 مزید سوالات:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {msg.content.followUp.slice(0, 3).map((q, i) => (
                                    <button
                                      key={i}
                                      onClick={() => {
                                        setInputValue(q)
                                        setTimeout(() => handleSend(), 100)
                                      }}
                                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full text-gray-600 dark:text-gray-300"
                                    >
                                      {q}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          // User Message
                          <p 
                            className="text-sm"
                            style={{ 
                              textAlign: msg.detectedLanguage === 'ur' ? 'right' : 'left',
                              direction: msg.detectedLanguage === 'ur' ? 'rtl' : 'ltr'
                            }}
                          >
                            {msg.content}
                          </p>
                        )}
                        
                        {/* Timestamp */}
                        <p 
                          className="text-[10px] opacity-60 mt-1"
                          style={{ textAlign: 'left' }}
                        >
                          {msg.timestamp.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none p-4">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Islamic AI Thinking...</p>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1b2a]">
                <div className="flex flex-wrap gap-2">
                  {[
                    'Namaz kya hai?',
                    'Roza kyun rakhte hain?',
                    'Tell me about Quran'
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputValue(q)
                        setTimeout(() => handleSend(), 100)
                      }}
                      disabled={isLoading}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full text-gray-700 dark:text-gray-300 transition disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1b2a]">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask your question..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}