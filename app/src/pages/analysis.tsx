import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

function InputField({ label, name, value, onChange, type = 'number', step = '0.01' }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        step={step}
        value={value}
        onChange={onChange}
        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function ResultsCard({ title, metrics }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key}>
            <p className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-lg font-semibold">{typeof value === 'number' || !isNaN(Number(value)) ? `$${Number(value).toLocaleString()}` : value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const [formData, setFormData] = useState({
    address: '',
    purchasePrice: 150000,
    closingCosts: 5000,
    rehabBudget: 10000,
    downPaymentPercent: 20,
    interestRate: 5.5,
    loanTermYears: 30,
    propertyTaxes: 2000,
    insurance: 1000,
    vacancyRate: 5,
    maintenanceRate: 5,
    managementRate: 10,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch(`${API_BASE}/analysis/rental`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to analyze property');
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Buy & Hold Rental Analysis</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 p-6 bg-slate-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold border-b pb-2">Inputs</h2>
          <InputField label="Address" name="address" value={formData.address} onChange={handleChange} type="text" />
          <InputField label="Purchase Price ($)" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} />
          <InputField label="Closing Costs ($)" name="closingCosts" value={formData.closingCosts} onChange={handleChange} />
          <InputField label="Rehab Budget ($)" name="rehabBudget" value={formData.rehabBudget} onChange={handleChange} />
          <h3 className="text-lg font-semibold border-b pb-2 pt-4">Financing</h3>
          <InputField label="Down Payment (%)" name="downPaymentPercent" value={formData.downPaymentPercent} onChange={handleChange} />
          <InputField label="Interest Rate (%)" name="interestRate" value={formData.interestRate} onChange={handleChange} />
          <InputField label="Loan Term (Years)" name="loanTermYears" value={formData.loanTermYears} onChange={handleChange} />
          <h3 className="text-lg font-semibold border-b pb-2 pt-4">Operating Expenses</h3>
          <InputField label="Property Taxes (Annual)" name="propertyTaxes" value={formData.propertyTaxes} onChange={handleChange} />
          <InputField label="Insurance (Annual)" name="insurance" value={formData.insurance} onChange={handleChange} />
          <InputField label="Vacancy Rate (%)" name="vacancyRate" value={formData.vacancyRate} onChange={handleChange} />
          <InputField label="Maintenance Rate (%)" name="maintenanceRate" value={formData.maintenanceRate} onChange={handleChange} />
          <InputField label="Management Rate (%)" name="managementRate" value={formData.managementRate} onChange={handleChange} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors disabled:bg-slate-400"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Property'}
            </button>
          </div>

          {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {results && (
            <div className="space-y-6">
              <ResultsCard title="Key Metrics" metrics={results.metrics} />
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Market Comps (Mock Data)</h3>
                <p>Estimated ARV: ${Number(results.inputs.arv).toLocaleString()}</p>
                <p>Estimated Market Rent: ${Number(results.inputs.marketRent).toLocaleString()}/mo</p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
