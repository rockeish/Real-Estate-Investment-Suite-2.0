import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const base = process.env.NEXT_PUBLIC_API_BASE
	if (base) {
		const r = await fetch(`${base}/reports/rent-roll`)
		const data = await r.json()
		return res.status(r.status).json(data)
	}
	return res.status(200).json({
		leases: [
			{ lease_id: 10, property_id: 1, address: '123 Main St', unit_label: 'A', tenant_id: 77, tenant_name: 'Jane Doe', rent_amount: 1850 },
			{ lease_id: 11, property_id: 2, address: '45 Oak Ave', unit_label: '2B', tenant_id: 88, tenant_name: 'John Smith', rent_amount: 1600 },
		],
	})
}