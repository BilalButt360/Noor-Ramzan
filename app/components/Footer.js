'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Quick Links': [
      { label: 'Prayer Times', href: '/prayer-times' },
      { label: 'Al-Quran', href: '/al-quran' },
      { label: 'Ramzan Calendar', href: '/ramzan-calendar' },
      { label: 'Duas & Hadith', href: '/duas' },
    ],
    'Features': [
      { label: 'Digital Tasbeeh', href: '/tasbeeh' },
      { label: 'Ibadah Planner', href: '/planner' },
      { label: 'Quran Tracker', href: '/quran-tracker' },
      { label: 'Zakat Calculator', href: '/zakat' },
    ],
    'Resources': [
      { label: 'About Ramzan', href: '/about-ramzan' },
      { label: 'Ramzan Tips', href: '/ramzan-tips' },
      { label: 'Fasting Guide', href: '/fasting-guide' },
      { label: 'Contact Us', href: '/contact' },
    ],
  }

  const socialLinks = [
    { icon: '📧', label: 'Email', href: 'mailto:info@noorramzan.com' },
    { icon: '🐦', label: 'Twitter', href: '#' },
    { icon: '📘', label: 'Facebook', href: '#' },
    { icon: '📷', label: 'Instagram', href: '#' },
  ]

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-gray-200 dark:border-gray-800">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-[#060d14] dark:via-[#0d1b2a] dark:to-emerald-950/20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/30 dark:bg-teal-900/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Decorative Islamic Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 15 L45 30 L30 45 L15 30 Z" fill="currentColor" className="text-emerald-600" />
            <circle cx="30" cy="30" r="3" fill="currentColor" className="text-emerald-600" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Top Section - Brand & Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 group mb-4">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all group-hover:scale-110 duration-300">
                <span className="text-2xl">🌙</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                Noor Ramzan
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Your complete companion for a blessed Ramzan. Track prayer times, read Al-Quran, count Tasbeeh, and plan your daily ibadah — all in one place.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
              <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-medium">
                <span>🌙</span> Ramzan 1447 H
              </span>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
                  {title}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1 group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        {/* <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-[#060d14] dark:via-[#0d1b2a] dark:to-emerald-950/20 px-4 text-xl">
              ✦
            </span>
          </div>
        </div> */}

        {/* Middle Section - Quranic Verse */}
        {/* <div className="text-center mb-8">
          <p className="font-arabic text-2xl md:text-3xl text-gray-800 dark:text-gray-100 mb-3 leading-relaxed">
            يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            "O you who believe! Fasting is prescribed for you as it was prescribed for those before you, that you may become righteous.&quot;
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            — Surah Al-Baqarah 2:183
          </p>
        </div> */}

        {/* Bottom Section - Social & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 border-t border-gray-200 dark:border-gray-800 !py-5">
          {/* Social Links */}
          {/* <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:scale-110 hover:shadow-md"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div> */}

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Noor Ramzan. Made with{' '}
              <span className="text-red-500">♥</span> for the Ummah.
            </p>
          </div>
        </div>

        {/* Optional - Newsletter Signup */}
        {/* <div className="mt-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Stay Connected</h3>
          <p className="text-emerald-100 text-sm mb-4 max-w-md mx-auto">
            Get daily Ramzan reminders, Quranic verses, and ibadah tips straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div> */}
      </div>
    </footer>
  )
}