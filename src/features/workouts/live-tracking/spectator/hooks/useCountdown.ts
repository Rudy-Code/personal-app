import { useState, useEffect } from 'react'

export const useCountdown = (targetDate: Date) => {
	// Inicjalizacja stanu JUŻ ma poprawny czas, nie musimy tego nadpisywać w useEffect na start.
	const [timeLeft, setTimeLeft] = useState(targetDate.getTime() - new Date().getTime())

	useEffect(() => {
		const calculateTimeLeft = () => targetDate.getTime() - new Date().getTime()

		const interval = setInterval(() => {
			const distance = calculateTimeLeft()

			if (distance <= 0) {
				clearInterval(interval)
				setTimeLeft(0)
			} else {
				setTimeLeft(distance)
			}
		}, 1000)

		return () => clearInterval(interval)
	}, [targetDate])

	const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
	const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

	const pad = (num: number) => num.toString().padStart(2, '0')

	return {
		days,
		hours,
		minutes,
		seconds,
		formatted: `${days > 0 ? `${days}d ` : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
		isFinished: timeLeft <= 0,
	}
}
