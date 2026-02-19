'use client'
import { motion } from 'framer-motion'

export default function FastingGuide() {
  const sections = [
    {
      title: 'Who Must Fast?',
      icon: '👥',
      color: 'from-emerald-500 to-emerald-700',
      points: [
        'Every adult Muslim (who has reached puberty)',
        'Must be sane and mentally capable',
        'Physically able to fast',
        'Not traveling (exemptions apply)',
        'Resident in their hometown',
      ]
    },
    {
      title: 'Who is Exempt?',
      icon: '🕊️',
      color: 'from-blue-500 to-blue-700',
      points: [
        'Sick people (must make up fasts later)',
        'Travelers (can break fast, make up later)',
        'Pregnant women (make up or pay Fidya)',
        'Breastfeeding women (make up or pay Fidya)',
        'Elderly & chronically ill (pay Fidya)',
        'Women in menstruation/post-childbirth (make up later)',
        'Children (not obligatory)',
      ]
    },
    {
      title: 'Things That Break Fast',
      icon: '⚠️',
      color: 'from-red-500 to-red-700',
      points: [
        'Eating or drinking intentionally',
        'Vomiting intentionally',
        'Menstruation or post-childbirth bleeding',
        'Sexual intercourse',
        'Injections with nutritional value',
        'Intentional ejaculation',
      ]
    },
    {
      title: 'Things That Do NOT Break Fast',
      icon: '✅',
      color: 'from-green-500 to-green-700',
      points: [
        'Eating or drinking by mistake',
        'Vomiting unintentionally',
        'Taking a shower or bath',
        'Using miswak or toothpaste',
        'Tasting food with the tip of the tongue',
        'Applying kohl or eye drops',
        'Using ear or nose drops',
        'Injections without nutritional value',
        'Dreaming or wet dream',
        'Kissing with control',
      ]
    },
    {
      title: 'Recommended Acts (Sunnah)',
      icon: '✨',
      color: 'from-purple-500 to-purple-700',
      points: [
        'Eating Sehri (pre-dawn meal)',
        'Delaying Sehri until just before Fajr',
        'Breaking fast immediately at Maghrib',
        'Breaking fast with dates or water',
        'Making Dua at Iftar',
        'Feeding others who are fasting',
        'Increasing charity and good deeds',
        'Reading and studying Quran',
        'Performing I\'tikaf in last 10 days',
      ]
    },
    {
      title: 'Fidyah & Kaffarah',
      icon: '💰',
      color: 'from-yellow-500 to-orange-600',
      points: [
        'Fidyah: Feeding one poor person for each missed fast',
        'Amount: Approx. $5-10 per fast (varies by region)',
        'Kaffarah: For intentionally breaking fast',
        'Must fast 60 consecutive days OR',
        'Feed 60 poor people for each broken fast',
      ]
    }
  ]

  const duas = [
    {
      title: 'Dua for Sehri Intention',
      arabic: 'وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
      translation: 'I intend to fast tomorrow in the month of Ramzan',
    },
    {
      title: 'Dua for Iftar',
      arabic: 'اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
      translation: 'O Allah! I fasted for You, I believe in You, I put my trust in You, and I break my fast with Your provision',
    },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-10 md:p-14 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white"
      >
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fasting Guide</h1>
          <p className="text-white/80 text-lg max-w-xl">
            Complete guide to fasting in Ramzan - rules, exemptions, and recommended practices
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full" />
      </motion.section>

      {/* Guide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl transition-all"
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${section.color}`} />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{section.icon}</span>
              <h2 className="text-xl font-bold dark:text-white">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.points.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Duas Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl p-8 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Essential Duas for Fasting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {duas.map((dua, index) => (
            <div key={index} className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <p className="text-lg font-semibold mb-3">{dua.title}</p>
              <p className="font-arabic text-2xl mb-3 text-emerald-200">{dua.arabic}</p>
              <p className="text-sm text-white/80">{dua.translation}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}