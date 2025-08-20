import React from 'react';
import Link from 'next/link';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/deals', label: 'Deals' },
  { href: '/analysis', label: 'Analysis' },
  { href: '/properties', label: 'Properties' },
  { href: '/tenants', label: 'Tenants' },
  { href: '/leases', label: 'Leases' },
  { href: '/payments', label: 'Payments' },
  { href: '/reports', label: 'Reports' },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-xl font-bold text-slate-800">
              Real Estate PM
            </Link>
            <nav className="hidden md:flex gap-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
