'use client'
import { useEffect, useState } from 'react'


export default function Countdown() {
    // Example target: Next Ramzan (change later dynamically)
    const targetDate = new Date('2026-02-19T18:00:00')
    const [timeLeft, setTimeLeft] = useState({})


    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            const diff = targetDate - now


            if (diff <= 0) return


            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((diff / (1000 * 60)) % 60)
            const seconds = Math.floor((diff / 1000) % 60)


            setTimeLeft({ days, hours, minutes, seconds })
        }, 1000)


        return () => clearInterval(timer)
    }, [])


    return (
        <div className="grid grid-cols-4 gap-3 text-center">
            {['days', 'hours', 'minutes', 'seconds'].map((k) => (
                <div key={k} className="rounded-xl p-3 bg-white/70 dark:bg-gray-800">
                    <p className="text-2xl font-bold">{timeLeft[k] ?? '--'}</p>
                    <p className="text-xs uppercase">{k}</p>
                </div>
            ))}
        </div>
    )
}