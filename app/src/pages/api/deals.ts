export default async function handler(req, res) {
	const base = process.env.NEXT_PUBLIC_API_BASE
	if (base) {
		const r = await fetch(`${base}/deals`)
		const data = await r.json()
		return res.status(r.status).json(data)
	}
	return res.status(200).json([
		{ id: 1, address: '123 Main St', status: 'Researching', source: 'MLS', list_price: 350000 },
		{ id: 2, address: '45 Oak Ave', status: 'Under Offer', source: 'Zillow', list_price: 525000 },
	])
}