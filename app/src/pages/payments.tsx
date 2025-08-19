import { useEffect, useState } from 'react'

export default function PaymentsPage() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const run = async () => {
			try {
				const res = await fetch('/api/payments')
				if (!res.ok) throw new Error(`Failed: ${res.status}`)
				setItems(await res.json())
			} catch (e) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		}
		run()
	}, [])

	return (
		<main className="p-6 space-y-4">
			<h1 className="text-xl font-semibold">Payments</h1>
			{loading && <div>Loading…</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && (
				<table className="min-w-full text-left border">
					<thead>
						<tr className="border-b bg-slate-50">
							<th className="p-2">Property</th>
							<th className="p-2">Tenant</th>
							<th className="p-2">Due Date</th>
							<th className="p-2">Amount Due</th>
							<th className="p-2">Amount Paid</th>
							<th className="p-2">Status</th>
						</tr>
					</thead>
					<tbody>
						{items.map((p) => (
							<tr key={p.id} className="border-b">
								<td className="p-2">{p.property_id}</td>
								<td className="p-2">{p.tenant_id}</td>
								<td className="p-2">{p.due_date}</td>
								<td className="p-2">${p.amount_due.toLocaleString()}</td>
								<td className="p-2">{p.amount_paid ? `$${p.amount_paid.toLocaleString()}` : '-'}</td>
								<td className="p-2">{p.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</main>
	)
}