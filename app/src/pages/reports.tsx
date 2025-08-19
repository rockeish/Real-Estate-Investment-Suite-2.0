import { useEffect, useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

type PL = { startDate: string; endDate: string; income: number; expenses: number; net: number }

type RentRollRow = {
	lease_id: number
	property_id: number
	address: string
	unit_label?: string
	tenant_id?: number
	tenant_name?: string
	rent_amount: number
}

export default function ReportsPage() {
	const [pl, setPl] = useState<PL | null>(null)
	const [rentRoll, setRentRoll] = useState<RentRollRow[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const load = async () => {
			try {
				const [plRes, rrRes] = await Promise.all([
					fetch(`${API_BASE}/api/reports/pl?startDate=2024-01-01&endDate=2024-12-31`),
					fetch(`${API_BASE}/api/reports/rent-roll`),
				])
				if (!plRes.ok) throw new Error(`P&L failed: ${plRes.status}`)
				if (!rrRes.ok) throw new Error(`Rent Roll failed: ${rrRes.status}`)
				setPl(await plRes.json())
				const rr = await rrRes.json()
				setRentRoll(rr.leases)
			} catch (e: any) {
				setError(e.message)
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [])

	return (
		<main className="p-6 space-y-6">
			<h1 className="text-xl font-semibold">Reports</h1>
			{loading && <div>Loading…</div>}
			{error && <div className="text-red-600">{error}</div>}
			{pl && (
				<section>
					<h2 className="font-semibold mb-2">Profit &amp; Loss</h2>
					<div className="grid grid-cols-4 gap-4">
						<div className="p-3 rounded bg-slate-50">Income: ${pl.income.toLocaleString()}</div>
						<div className="p-3 rounded bg-slate-50">Expenses: ${pl.expenses.toLocaleString()}</div>
						<div className="p-3 rounded bg-slate-50">Net: ${pl.net.toLocaleString()}</div>
						<div className="p-3 rounded bg-slate-50">Period: {pl.startDate} → {pl.endDate}</div>
					</div>
				</section>
			)}
			{rentRoll.length > 0 && (
				<section>
					<h2 className="font-semibold mb-2">Rent Roll</h2>
					<table className="min-w-full text-left border">
						<thead>
							<tr className="border-b bg-slate-50">
								<th className="p-2">Property</th>
								<th className="p-2">Unit</th>
								<th className="p-2">Tenant</th>
								<th className="p-2">Rent</th>
							</tr>
						</thead>
						<tbody>
							{rentRoll.map((r) => (
								<tr key={r.lease_id} className="border-b">
									<td className="p-2">{r.address}</td>
									<td className="p-2">{r.unit_label || '-'}</td>
									<td className="p-2">{r.tenant_name || '-'}</td>
									<td className="p-2">${r.rent_amount.toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			)}
		</main>
	)
}