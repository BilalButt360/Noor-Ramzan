'use client'
import { useEffect, useState } from 'react'
import { usePrayers } from '../context/PrayerContext'

export default function Countdown() {
    const { prayers, city } = usePrayers()
    const [timeLeft, setTimeLeft] = useState({})
    const [nextEvent, setNextEvent] = useState('')
    const [eventTime, setEventTime] = useState(null)

    useEffect(() => {
        if (!prayers.length || !city) return

        const timer = setInterval(() => {
            const now = new Date()
            
            // Get today's prayers
            const fajrTime = prayers.find(p => p.name === 'Fajr')?.time
            const maghribTime = prayers.find(p => p.name === 'Maghrib')?.time
            
            if (!fajrTime || !maghribTime) return

            // Parse times
            const parseTimeToDate = (timeStr) => {
                const [hour, minute, period] = timeStr.split(/[:\s]/)
                let hours = parseInt(hour)
                if (period === 'PM' && hours !== 12) hours += 12
                if (period === 'AM' && hours === 12) hours = 0
                
                const date = new Date()
                date.setHours(hours, parseInt(minute), 0, 0)
                return date
            }

            const maghrib = parseTimeToDate(maghribTime)
            const fajr = parseTimeToDate(fajrTime)
            
            // If Maghrib already passed, set next Fajr (for next day's Sehri)
            if (now > maghrib) {
                fajr.setDate(fajr.getDate() + 1)
            }

            // Determine next event
            let targetTime
            if (now < maghrib) {
                targetTime = maghrib
                setNextEvent('Iftar')
                setEventTime('Maghrib')
            } else {
                targetTime = fajr
                setNextEvent('Sehri Ends')
                setEventTime('Fajr')
            }

            const diff = targetTime - now

            if (diff <= 0) return

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((diff / (1000 * 60)) % 60)
            const seconds = Math.floor((diff / 1000) % 60)

            setTimeLeft({ hours, minutes, seconds })
        }, 1000)

        return () => clearInterval(timer)
    }, [prayers, city])

    if (!Object.keys(timeLeft).length) return null

    return (
        <div className="space-y-2">
            <p className="text-sm text-white/60 flex items-center gap-2">
                <span className="animate-pulse">⏳</span>
                Time until {nextEvent} ({eventTime})
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
                {['hours', 'minutes', 'seconds'].map((k) => (
                    <div key={k} className="rounded-xl p-2 bg-white/20 backdrop-blur border border-white/30">
                        <p className="text-2xl font-bold">{timeLeft[k]?.toString().padStart(2, '0') ?? '00'}</p>
                        <p className="text-xs uppercase opacity-80">{k}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}