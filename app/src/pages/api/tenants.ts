import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const base = process.env.NEXT_PUBLIC_API_BASE
	if (base) {
		const r = await fetch(`${base}/tenants`)
		const data = await r.json()
		return res.status(r.status).json(data)
	}
	return res.status(200).json([
		{ id: 1, full_name: 'Jane Doe', email: 'jane@example.com', phone_number: '555-111-2222' },
		{ id: 2, full_name: 'John Smith', email: 'john@example.com', phone_number: '555-333-4444' },
	])
}