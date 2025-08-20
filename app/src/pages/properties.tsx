import { useEffect, useState } from 'react'

const API_BASE = ''

export default function PropertiesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        let url = `/api/properties`
        if (searchTerm) {
          url = `/api/properties/search?q=${encodeURIComponent(
            searchTerm
          )}`
        }
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        setItems(await res.json())
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchProperties()
    }, 500) // 500ms debounce delay

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Properties</h1>
        <input
          type="text"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="p-3">Address</th>
                <th className="p-3">City</th>
                <th className="p-3">State</th>
                <th className="p-3 text-center">Units</th>
                <th className="p-3 text-right">Rent (Gross)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{p.address}</td>
                  <td className="p-3">{p.city || '-'}</td>
                  <td className="p-3">{p.state || '-'}</td>
                  <td className="p-3 text-center">{p.units ?? 1}</td>
                  <td className="p-3 text-right">
                    {p.rental_income
                      ? `$${Number(p.rental_income).toLocaleString()}`
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}