import Navbar from "./components/Navbar.js";
import CitySelectModal from "./components/Cityselectmodal.js";
import Footer from "./components/Footer.js";
import AIAssistant from "./components/AIAssistant";
import { ThemeProvider } from "./context/ThemeContext.js";
import { PrayerProvider } from "./context/PrayerContext.js";
import { AuthProvider } from "./context/Authcontext.js";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

export const metadata = {
  title: 'Noor Ramzan',
  description: 'Your Ramzan Companion — Prayer times, Quran, Duas & More',
  referrer: 'no-referrer',
  other: {
    'referrer': 'no-referrer',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Scheherazade+New:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <PrayerProvider>
              {/* Toast Notifications */}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#10b981',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#fff',
                      secondary: '#10b981',
                    },
                  },
                  error: {
                    duration: 4000,
                    style: {
                      background: '#ef4444',
                      color: '#fff',
                    },
                    iconTheme: {
                      primary: '#fff',
                      secondary: '#ef4444',
                    },
                  },
                  loading: {
                    style: {
                      background: '#6b7280',
                      color: '#fff',
                    },
                  },
                }}
              />
              
              <CitySelectModal />
              <Navbar />
              <main className="p-4 max-w-7xl mx-auto min-h-screen">
                {children}
              </main>
              <Footer />
              <AIAssistant />
            </PrayerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}