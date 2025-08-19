export default async function handler(req, res) {
	const base = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE
	if (base) {
		const r = await fetch(`${base}/payments`)
		const data = await r.json()
		return res.status(r.status).json(data)
	}
	return res.status(200).json([
		{ id: 900, property_id: 1, tenant_id: 1, due_date: '2025-08-01', amount_due: 1850, amount_paid: 1850, status: 'paid' },
		{ id: 901, property_id: 2, tenant_id: 2, due_date: '2025-08-01', amount_due: 1600, amount_paid: 0, status: 'unpaid' },
	])
}