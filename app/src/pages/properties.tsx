import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

type Property = {
	id: number
	address: string
	city?: string
	state?: string
	units?: number
	rental_income?: number
}

export default function PropertiesPage() {
	const [items, setItems] = useState<Property[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const run = async () => {
			try {
				const res = await fetch(`${API_BASE}/api/properties`)
				if (!res.ok) throw new Error(`Failed: ${res.status}`)
				setItems(await res.json())
			} catch (e: any) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		}
		run()
	}, [])

	return (
		<main className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">Properties</h1>
			{loading && <div>Loading…</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && (
				<table className="min-w-full text-left border">
					<thead>
						<tr className="border-b bg-slate-50">
							<th className="p-2">Address</th>
							<th className="p-2">City</th>
							<th className="p-2">State</th>
							<th className="p-2">Units</th>
							<th className="p-2">Rent (Gross)</th>
						</tr>
					</thead>
					<tbody>
						{items.map((p) => (
							<tr key={p.id} className="border-b">
								<td className="p-2">{p.address}</td>
								<td className="p-2">{p.city || '-'}</td>
								<td className="p-2">{p.state || '-'}</td>
								<td className="p-2">{p.units ?? 1}</td>
								<td className="p-2">{p.rental_income ? `$${Number(p.rental_income).toLocaleString()}` : '-'}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</main>
	)
}