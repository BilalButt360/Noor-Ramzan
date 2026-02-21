'use client'
import { useEffect, useState } from 'react'
import { usePrayers } from '../context/PrayerContext'
import { motion } from 'framer-motion'

export default function Countdown() {
    const { prayers, city, loading } = usePrayers()
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
    const [eventType, setEventType] = useState('') // 'sehri' or 'iftar'
    const [eventTime, setEventTime] = useState('')

    useEffect(() => {
        if (!prayers.length || !city || loading) return

        const calculateNextEvent = () => {
            const now = new Date()
            
            // Get today's prayer times
            const fajrTime = prayers.find(p => p.name === 'Fajr')?.time
            const maghribTime = prayers.find(p => p.name === 'Maghrib')?.time
            
            if (!fajrTime || !maghribTime) return

            // Parse 12-hour time format
            const parse12HourTime = (timeStr) => {
                const [time, period] = timeStr.split(' ')
                let [hours, minutes] = time.split(':').map(Number)
                
                if (period === 'PM' && hours !== 12) hours += 12
                if (period === 'AM' && hours === 12) hours = 0
                
                const date = new Date()
                date.setHours(hours, minutes, 0, 0)
                return date
            }

            const fajr = parse12HourTime(fajrTime)
            const maghrib = parse12HourTime(maghribTime)
            
            // Tomorrow's Fajr
            const tomorrowFajr = new Date(fajr.getTime() + 24 * 60 * 60 * 1000)

            // Determine next event
            let targetTime, type, displayTime
            
            if (now < fajr) {
                // Before Fajr: Sehri countdown
                targetTime = fajr
                type = 'sehri'
                displayTime = fajrTime
            } 
            else if (now >= fajr && now < maghrib) {
                // Between Fajr and Maghrib: Iftar countdown
                targetTime = maghrib
                type = 'iftar'
                displayTime = maghribTime
            } 
            else {
                // After Maghrib: Tomorrow's Sehri countdown
                targetTime = tomorrowFajr
                type = 'sehri'
                displayTime = fajrTime
            }

            const diff = targetTime - now
            if (diff <= 0) return

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeLeft({ hours, minutes, seconds })
            setEventType(type)
            setEventTime(displayTime)
        }

        calculateNextEvent()
        const timer = setInterval(calculateNextEvent, 1000)
        return () => clearInterval(timer)
    }, [prayers, city, loading])

    // Agar loading ho ya prayers nahi hain to kuch na dikhao
    if (loading || !prayers.length || !city) return null

    // Agar timeLeft zero hai to kuch na dikhao
    if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) return null

    // Title based on event
    const countdownTitle = eventType === 'iftar' ? 'Iftar Countdown' : 'Sehri Countdown'

    return (
        <div className="space-y-2">
            <p className="text-sm text-white/60 mb-2 uppercase tracking-widest font-medium">
                {countdownTitle} ({eventTime})
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
                {['hours', 'minutes', 'seconds'].map((unit) => (
                    <div key={unit} className="rounded-xl p-2 bg-white/20 backdrop-blur border border-white/30">
                        <p className="text-2xl font-bold">
                            {timeLeft[unit]?.toString().padStart(2, '0') ?? '00'}
                        </p>
                        <p className="text-xs uppercase opacity-80">{unit}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}