import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import './App.css'

function Nav() {
  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/deals', label: 'Deals' },
    { to: '/properties', label: 'Properties' },
    { to: '/tenants', label: 'Tenants' },
    { to: '/leases', label: 'Leases' },
    { to: '/payments', label: 'Payments' },
    { to: '/reports', label: 'Reports' },
    { to: '/settings', label: 'Settings' },
  ]
  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
      {navItems.map((n) => (
        <NavLink key={n.to} to={n.to} style={({ isActive }) => ({ fontWeight: isActive ? '700' : '400' })}>
          {n.label}
        </NavLink>
      ))}
    </nav>
  )
}

function Page({ title, children }) {
  return (
    <div style={{ padding: 16 }}>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}

function Dashboard() {
  return (
    <Page title="Portfolio Dashboard">
      <ul>
        <li>Occupancy Rate</li>
        <li>Total Monthly Rent (Gross)</li>
        <li>Portfolio Net Cash Flow</li>
        <li>Estimated Portfolio Value</li>
      </ul>
      <div>Map and Property cards will appear here.</div>
    </Page>
  )
}

function Deals() {
  return <Page title="Deal Pipeline">Table of deals and calculators will appear here.</Page>
}
function Properties() {
  return <Page title="Properties">List of properties and property detail pages.</Page>
}
function Tenants() {
  return <Page title="Tenants">Tenant database management.</Page>
}
function Leases() {
  return <Page title="Leases">Lease tracking and expirations.</Page>
}
function Payments() {
  return <Page title="Payments">Rent roll and payment tracking.</Page>
}
function Reports() {
  return <Page title="Reports">P&L, Rent Roll, Tax Summary reports.</Page>
}
function Settings() {
  return <Page title="Settings">App settings and integrations.</Page>
}

function App() {
  const [ready] = useState(true)
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/leases" element={<Leases />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
