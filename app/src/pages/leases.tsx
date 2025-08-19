import { useEffect, useState } from 'react'

type Lease = { id: number; property_id: number; tenant_id: number; start_date: string; end_date: string; rent_amount: number; is_active: boolean }

export default function LeasesPage() {
	const [items, setItems] = useState<Lease[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const run = async () => {
			try {
				const res = await fetch('/api/leases')
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
			<h1 className="text-xl font-semibold">Leases</h1>
			{loading && <div>Loading…</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && (
				<table className="min-w-full text-left border">
					<thead>
						<tr className="border-b bg-slate-50">
							<th className="p-2">Property</th>
							<th className="p-2">Tenant</th>
							<th className="p-2">Start</th>
							<th className="p-2">End</th>
							<th className="p-2">Rent</th>
							<th className="p-2">Active</th>
						</tr>
					</thead>
					<tbody>
						{items.map((l) => (
							<tr key={l.id} className="border-b">
								<td className="p-2">{l.property_id}</td>
								<td className="p-2">{l.tenant_id}</td>
								<td className="p-2">{l.start_date}</td>
								<td className="p-2">{l.end_date}</td>
								<td className="p-2">${l.rent_amount.toLocaleString()}</td>
								<td className="p-2">{l.is_active ? 'Yes' : 'No'}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</main>
	)
}