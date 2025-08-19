export default async function handler(req, res) {
	const base = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE
	if (base) {
		const r = await fetch(`${base}/reports/summary`)
		const data = await r.json()
		return res.status(r.status).json(data)
	}
	return res.status(200).json({
		total_properties: 2,
		active_leases: 2,
		total_tenants: 2,
		total_rent_collected: 8250,
	})
}

