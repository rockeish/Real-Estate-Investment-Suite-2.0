import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const base = process.env.NEXT_PUBLIC_API_BASE
	const qs = new URLSearchParams({
		startDate: (req.query.startDate as string) || '2024-01-01',
		endDate: (req.query.endDate as string) || '2024-12-31',
	})
	if (base) {
		const r = await fetch(`${base}/reports/pl?${qs.toString()}`)
		const data = await r.json()
		return res.status(r.status).json(data)
	}
	return res.status(200).json({ startDate: '2024-01-01', endDate: '2024-12-31', income: 120000, expenses: 72000, net: 48000 })
}