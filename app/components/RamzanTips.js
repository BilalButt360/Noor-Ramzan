'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function RamzanTips() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Tips', icon: '📋' },
    { id: 'sehri', label: 'Sehri Tips', icon: '🌅' },
    { id: 'day', label: 'Day Tips', icon: '☀️' },
    { id: 'iftar', label: 'Iftar Tips', icon: '🌇' },
    { id: 'night', label: 'Night Tips', icon: '🌙' },
    { id: 'health', label: 'Health Tips', icon: '💪' },
  ]

  const allTips = [
    {
      category: 'sehri',
      icon: '🌅',
      title: 'Sehri (Pre-dawn Meal)',
      tips: [
        'Wake up for Sehri even if it\'s just a date and water - it contains barakah (blessings)',
        'Drink plenty of water during Sehri to stay hydrated throughout the day',
        'Eat slow-digesting foods like oats, eggs, yogurt, and bananas',
        'Avoid salty and spicy foods that can cause thirst',
        'Make the intention (Niyyah) for fasting before Fajr',
        'Recite the dua for fasting: "Wa bisawmi ghadin nawaiytu"',
      ]
    },
    {
      category: 'day',
      icon: '☀️',
      title: 'During the Day',
      tips: [
        'Avoid gossip, backbiting, and negative speech - fasting is not just about food',
        'Read Quran daily - even if it\'s just a few verses',
        'Take a short nap (Qaylulah) to conserve energy',
        'Make lots of Dua throughout the day',
        'Give charity - even a smile is charity',
        'Control your anger and practice patience',
      ]
    },
    {
      category: 'iftar',
      icon: '🌇',
      title: 'Iftar (Breaking Fast)',
      tips: [
        'Break your fast with dates and water - it\'s Sunnah',
        'Make Dua before Iftar - it\'s a time when duas are accepted',
        'Don\'t overeat - fill 1/3 with food, 1/3 with water, 1/3 with air',
        'Pray Maghrib immediately after breaking your fast',
        'Start with light food, then pray, then have a proper meal',
        'Share Iftar with others - feeding a fasting person brings great reward',
      ]
    },
    {
      category: 'night',
      icon: '🌙',
      title: 'Night Worship',
      tips: [
        'Pray Taraweeh with focus and understanding',
        'Read Quran after Isha and Taraweeh',
        'Perform Tahajjud prayer in the last third of the night',
        'Make sincere repentance (Tawbah)',
        'Recite lots of Istighfar (Astaghfirullah)',
        'In the last 10 nights, increase worship and seek Laylatul Qadr',
      ]
    },
    {
      category: 'health',
      icon: '💪',
      title: 'Health & Wellness',
      tips: [
        'Don\'t skip Sehri - it gives energy for the day',
        'Eat balanced meals with proteins, fibers, and vitamins',
        'Avoid fried and sugary foods that cause fatigue',
        'Stay hydrated between Iftar and Sehri',
        'Light walking after Taraweeh is good for digestion',
        'Get adequate sleep - manage your time wisely',
      ]
    },
    {
      category: 'spiritual',
      icon: '✨',
      title: 'Spiritual Growth',
      tips: [
        'Make a daily Quran reading goal and stick to it',
        'Learn the meanings of what you recite in prayer',
        'Give regular charity (Sadaqah)',
        'Strengthen family ties - invite relatives for Iftar',
        'Forgive others and seek forgiveness',
        'Make a list of duas you want to make for yourself and others',
      ]
    }
  ]

  const filteredTips = selectedCategory === 'all' 
    ? allTips 
    : allTips.filter(tip => tip.category === selectedCategory)

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-10 md:p-14 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white"
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Ramzan Tips
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-xl"
          >
            Practical tips to make the most of your Ramzan
          </motion.p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full" />
      </motion.section>

      {/* Category Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
            }`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTips.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{section.icon}</span>
              <h2 className="text-xl font-bold dark:text-white">{section.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {section.tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hadith Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-2xl p-8 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white text-center"
      >
        <p className="text-sm uppercase tracking-widest text-emerald-200 mb-3">Prophetic Guidance</p>
        <p className="text-2xl font-arabic mb-4 leading-relaxed">
          مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ
        </p>
        <p className="text-white/80 max-w-xl mx-auto">
          "Whoever fasts in Ramzan with faith and seeking reward, all his previous sins will be forgiven."
        </p>
        <p className="text-emerald-200 text-sm mt-3">— Bukhari & Muslim</p>
      </motion.section>
    </div>
  )
}