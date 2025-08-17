import Link from 'next/link'

export default function Home() {
	const links = [
		{ href: '/deals', label: 'Deals' },
		{ href: '/properties', label: 'Properties' },
		{ href: '/tenants', label: 'Tenants' },
		{ href: '/leases', label: 'Leases' },
		{ href: '/payments', label: 'Payments' },
		{ href: '/reports', label: 'Reports' },
	]
	return (
		<main className="p-6 space-y-4">
			<h1 className="text-2xl font-semibold">Real Estate Portfolio Management Suite</h1>
			<p className="text-slate-600">Dashboard and quick links</p>
			<nav className="flex gap-4 flex-wrap">
				{links.map((l) => (
					<Link key={l.href} href={l.href} className="px-3 py-2 rounded bg-slate-100 hover:bg-slate-200">
						{l.label}
					</Link>
				))}
			</nav>
		</main>
	)
}