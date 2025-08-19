export default async function handler(req, res) {
	const base = process.env.NEXT_PUBLIC_API_BASE
	const startDate = req.query.startDate || '2024-01-01'
	const endDate = req.query.endDate || '2024-12-31'
	if (base) {
		const r = await fetch(`${base}/reports/pl?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`)
		const data = await r.json()
		return res.status(r.status).json(data)
	}
	return res.status(200).json({ startDate, endDate, income: 120000, expenses: 72000, net: 48000 })
}