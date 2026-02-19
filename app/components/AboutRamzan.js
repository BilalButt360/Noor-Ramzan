'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutRamzan() {
  const sections = [
    {
      title: 'What is Ramzan?',
      icon: '🌙',
      content: 'Ramzan (also spelled Ramadan) is the ninth month of the Islamic lunar calendar. It is the holiest month for Muslims, during which the Quran was first revealed to Prophet Muhammad (PBUH). Muslims around the world fast from dawn until sunset, abstaining from food, drink, and other physical needs.',
      color: 'from-emerald-500 to-emerald-700'
    },
    {
      title: 'Why Do Muslims Fast?',
      icon: '🤲',
      content: 'Fasting (Sawm) is one of the Five Pillars of Islam. It is a form of worship that brings Muslims closer to Allah, teaches self-discipline, and reminds them of those less fortunate. Fasting is not just about abstaining from food, but also from negative behaviors like gossip, anger, and sinful acts.',
      color: 'from-blue-500 to-blue-700'
    },
    {
      title: 'The Quran in Ramzan',
      icon: '📖',
      content: 'The Quran was first revealed to Prophet Muhammad (PBUH) during the last 10 nights of Ramzan. Muslims strive to complete reading the entire Quran during this month, and many perform I\'tikaf (spiritual retreat) in the mosque during the last 10 days.',
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Laylatul Qadr',
      icon: '✨',
      content: 'Laylatul Qadr (The Night of Power) is better than 1000 months. It falls on one of the odd nights in the last 10 days of Ramzan. On this night, the Quran was first revealed, and worship on this night is better than worship for 83 years.',
      color: 'from-yellow-500 to-orange-600'
    }
  ]

  const virtues = [
    { text: 'Allah\'s mercy is abundant', icon: '💚' },
    { text: 'Sins are forgiven', icon: '🕊️' },
    { text: 'Duas are accepted', icon: '🤲' },
    { text: 'Rewards are multiplied', icon: '✨' },
    { text: 'The gates of Jannah are opened', icon: '🏛️' },
    { text: 'The gates of Jahannam are closed', icon: '🔥' },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-10 md:p-14 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white"
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full"
          >
            <span>🌙</span>
            <span>رمضان المبارک</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold"
          >
            About Ramzan
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg max-w-xl"
          >
            Understanding the blessed month of mercy, forgiveness, and salvation
          </motion.p>
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute -left-8 -top-8 w-48 h-48 bg-yellow-300/10 blur-2xl rounded-full" />
      </motion.section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl transition-all"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${section.color}`} />
            <div className="flex items-start gap-4">
              <span className="text-4xl">{section.icon}</span>
              <div>
                <h2 className="text-xl font-bold dark:text-white mb-2">{section.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{section.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Virtues Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-8">✨ Virtues of Ramzan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {virtues.map((virtue, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur p-4 rounded-xl"
            >
              <span className="text-2xl">{virtue.icon}</span>
              <span className="text-sm font-medium">{virtue.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quran Verse */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 text-center"
      >
        <p className="font-arabic text-3xl md:text-4xl mb-4 text-emerald-800 dark:text-emerald-300 leading-relaxed">
          يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ
        </p>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-3">
          {`"O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous."`}
        </p>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">— Surah Al-Baqarah 2:183</p>
      </motion.section>
    </div>
  )
}