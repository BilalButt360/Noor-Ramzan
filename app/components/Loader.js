'use client'
import { motion } from 'framer-motion'

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"
      />
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-gray-500 dark:text-gray-400"
      >
        {message}
      </motion.p>
    </div>
  )
}