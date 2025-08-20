import { useEffect, useState } from 'react'

const API_BASE = ''

// A single dashboard card component
function StatCard({ label, value }) {
  return (
    <div className="p-4 bg-slate-100 rounded-lg shadow">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-3xl font-semibold text-slate-800">{value}</p>
    </div>
  )
}

export default function Home() {
  const [summaryData, setSummaryData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const res = await fetch(`/api/reports/summary`)
        if (!res.ok) {
          throw new Error('Failed to fetch summary data')
        }
        const data = await res.json()
        setSummaryData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-slate-600">
        A high-level overview of your real estate portfolio.
      </p>

      {loading && <p>Loading dashboard...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Properties"
            value={summaryData.total_properties}
          />
          <StatCard label="Active Leases" value={summaryData.active_leases} />
          <StatCard label="Total Tenants" value={summaryData.total_tenants} />
          <StatCard
            label="Total Rent Collected"
            value={new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(summaryData.total_rent_collected)}
          />
        </div>
      )}
    </div>
  )
}