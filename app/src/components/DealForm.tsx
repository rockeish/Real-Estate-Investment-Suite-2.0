import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export default function DealForm({ deal, onSave, onCancel }) {
  const [formData, setFormData] = useState(deal || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = deal
      ? `${API_BASE}/deals/${deal.id}`
      : `${API_BASE}/deals`;
    const method = deal ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save deal');
      const savedDeal = await res.json();
      onSave(savedDeal);
    } catch (err) {
      console.error(err);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {deal ? 'Edit Deal' : 'Add New Deal'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          {/* Add other form fields here... */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {deal ? 'Save Changes' : 'Add Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
