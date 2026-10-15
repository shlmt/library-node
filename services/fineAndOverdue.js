export class FineService {
	#defaultRate = 1
	#dailyRates = {
		ילדים: 1,
		ספרות: 2,
		comics: 2,
		עיון: 3
	}

	#getLateDays(dueDate, endDate) {
		const due = this.#toDate(dueDate)
		const end = this.#toDate(endDate)

		return Math.max(0, Math.floor((end - due) / 86_400_000))
	}

	#toDate(value) {
		const date = new Date(value)

		if (Number.isNaN(date.getTime())) {
			throw new Error('תאריך לא תקין')
		}

		return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
	}

	calculateFine(loans, currentDate = new Date()) {
		return loans.reduce((total, loan) => {
			const endDate = loan.returnedAt ?? currentDate
			const lateDays = this.#getLateDays(loan.dueDate, endDate)

			const dailyRate = this.#dailyRates[loan.bookCategory] ?? this.#defaultRate

			return total + lateDays * dailyRate
		}, 0)
	}

	isOverdue(dueDate, currentDate = new Date()) {
		return this.#getLateDays(dueDate, currentDate) > 0
	}
}
