'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactUs() {
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)

    // Format message for WhatsApp
    const whatsappMessage = `*New Message from Noor Ramzan* 🕌

👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
📝 *Subject:* ${formData.subject}

💬 *Message:*
${formData.message}

━━━━━━━━━━━━━━━━
📅 *Date:* ${new Date().toLocaleDateString()}
⏰ *Time:* ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━━`;

    // Encode for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // WhatsApp number (hardcoded - hidden from UI)
    const whatsappNumber = '923216286535'; // 0321-6286535
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    toast.success('Opening WhatsApp... Please send the message.');
    setSending(false);

    // Clear form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

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
            <span>📱</span>
            <span>WhatsApp Contact</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Contact Us
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg max-w-xl"
          >
            Send us a message directly on WhatsApp
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full" />
        <div className="absolute -left-8 -top-8 w-48 h-48 bg-yellow-300/10 blur-2xl rounded-full" />
      </motion.section>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        {/* Simple Info Card - Without showing number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl">
            📱
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Quick Response via WhatsApp
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Fill the form and we'll get back to you shortly
            </p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="your@email.com"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="What is this regarding?"
              />
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                placeholder="Type your message here..."
              />
            </div>

            {/* Character Counter */}
            {formData.message && (
              <div className="text-right text-xs text-gray-400">
                {formData.message.length} / 2000 characters
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={sending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 text-white font-semibold py-4 rounded-xl hover:from-emerald-800 hover:via-emerald-900 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Preparing...
                </span>
              ) : (
                <>
                  <span>📱</span>
                  Send via WhatsApp
                </>
              )}
            </motion.button>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Your message will be sent securely via WhatsApp
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}