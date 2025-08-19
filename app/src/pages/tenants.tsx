import { useEffect, useState } from 'react'

type Tenant = { id: number; full_name: string; email?: string; phone_number?: string }

export default function TenantsPage() {
	const [items, setItems] = useState<Tenant[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const run = async () => {
			try {
				const res = await fetch('/api/tenants')
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
			<h1 className="text-xl font-semibold">Tenants</h1>
			{loading && <div>Loading…</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && (
				<table className="min-w-full text-left border">
					<thead>
						<tr className="border-b bg-slate-50">
							<th className="p-2">Name</th>
							<th className="p-2">Email</th>
							<th className="p-2">Phone</th>
						</tr>
					</thead>
					<tbody>
						{items.map((t) => (
							<tr key={t.id} className="border-b">
								<td className="p-2">{t.full_name}</td>
								<td className="p-2">{t.email || '-'}</td>
								<td className="p-2">{t.phone_number || '-'}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</main>
	)
}