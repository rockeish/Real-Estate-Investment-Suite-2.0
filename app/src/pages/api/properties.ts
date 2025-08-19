export default async function handler(req, res) {
	const base = process.env.NEXT_PUBLIC_API_BASE
	if (base) {
		const r = await fetch(`${base}/properties`)
		const data = await r.json()
		return res.status(r.status).json(data)
	}
	return res.status(200).json([
		{ id: 1, address: '123 Main St', city: 'Austin', state: 'TX', units: 1, rental_income: 1850 },
		{ id: 2, address: '45 Oak Ave', city: 'Denver', state: 'CO', units: 4, rental_income: 6400 },
	])
}