import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api'

type Deal = {
	id: number
	address: string
	status: string
	source?: string
	list_price?: number
}

export default function DealsPage() {
	const [deals, setDeals] = useState<Deal[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const run = async () => {
			try {
				const res = await fetch(`${API_BASE}/deals`)
				if (!res.ok) throw new Error(`Failed: ${res.status}`)
				const data = await res.json()
				setDeals(data)
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
			<h1 className="text-xl font-semibold">Deals</h1>
			{loading && <div>Loading…</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && (
				<table className="min-w-full text-left border">
					<thead>
						<tr className="border-b bg-slate-50">
							<th className="p-2">Address</th>
							<th className="p-2">Status</th>
							<th className="p-2">Source</th>
							<th className="p-2">List Price</th>
						</tr>
					</thead>
					<tbody>
						{deals.map((d) => (
							<tr key={d.id} className="border-b">
								<td className="p-2">{d.address}</td>
								<td className="p-2">{d.status}</td>
								<td className="p-2">{d.source || '-'}</td>
								<td className="p-2">{d.list_price ? `$${d.list_price.toLocaleString()}` : '-'}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</main>
	)
}