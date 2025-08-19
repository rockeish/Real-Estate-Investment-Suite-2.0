import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const base = process.env.NEXT_PUBLIC_API_BASE
	if (base) {
		const r = await fetch(`${base}/leases`)
		const data = await r.json()
		return res.status(r.status).json(data)
	}
	return res.status(200).json([
		{ id: 100, property_id: 1, tenant_id: 1, start_date: '2024-01-01', end_date: '2024-12-31', rent_amount: 1850, is_active: true },
		{ id: 101, property_id: 2, tenant_id: 2, start_date: '2024-06-01', end_date: '2025-05-31', rent_amount: 1600, is_active: true },
	])
}