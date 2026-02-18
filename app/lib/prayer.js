export async function fetchPrayerTimes({ latitude, longitude }) {
    const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`,
        { cache: 'no-store' }
    )
    const data = await res.json()
    console.log(data,"data..")
    const t = data?.data?.timings || {}


    return [
        { name: 'Fajr', time: t.Fajr },
        { name: 'Dhuhr', time: t.Dhuhr },
        { name: 'Asr', time: t.Asr },
        { name: 'Maghrib', time: t.Maghrib },
        { name: 'Isha', time: t.Isha },
    ]
}


export function getNextPrayer(prayers) {
    const now = new Date()


    const parseTime = (timeStr) => {
        if (!timeStr) return null
        const [h, m] = timeStr.split(':')
        const d = new Date()
        d.setHours(Number(h), Number(m), 0, 0)
        return d
    }


    let foundNext = false


    return prayers.map((p) => {
        if (foundNext) return { ...p, isNext: false }


        const pt = parseTime(p.time)
        if (pt && pt > now) {
            foundNext = true
            return { ...p, isNext: true }
        }
        return { ...p, isNext: false }
    })
}