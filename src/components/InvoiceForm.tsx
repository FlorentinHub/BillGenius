import React from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, FileText } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '../types';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onPrint: () => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
const PAYMENT_TERMS = ['Net 30', 'Net 15', 'Due on Receipt', 'Net 60'];
const STATUSES = ['draft', 'pending', 'paid'];

export default function InvoiceForm({ data, onChange, onPrint }: Props) {
  const addItem = () => {
    onChange({
      ...data,
      items: [
        ...data.items,
        { id: crypto.randomUUID(), description: '', quantity: 1, price: 0 },
      ],
    });
  };

  const removeItem = (id: string) => {
    onChange({
      ...data,
      items: data.items.filter(item => item.id !== id),
    });
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    onChange({
      ...data,
      items: data.items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">Invoice Details</h2>
          <div className="flex items-center gap-2">
            <select
              value={data.status}
              onChange={(e) => onChange({ ...data, status: e.target.value as InvoiceData['status'] })}
              className="text-sm rounded-full px-3 py-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              {STATUSES.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <span className={`px-2 py-1 rounded-full text-sm ${
              data.status === 'paid' ? 'bg-green-100 text-green-800' :
              data.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          </div>
        </div>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText size={20} />
          Generate Invoice
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="text"
            value={data.invoiceNumber}
            onChange={(e) => onChange({ ...data, invoiceNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={format(data.date, 'yyyy-MM-dd')}
              onChange={(e) => onChange({ ...data, date: new Date(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dues Date</label>
            <input
              type="date"
              value={format(data.dueDate, 'yyyy-MM-dd')}
              onChange={(e) => onChange({ ...data, dueDate: new Date(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Your Company</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={data.companyDetails.name}
              onChange={(e) => onChange({
                ...data,
                companyDetails: { ...data.companyDetails, name: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={data.companyDetails.address}
              onChange={(e) => onChange({
                ...data,
                companyDetails: { ...data.companyDetails, address: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={data.companyDetails.email}
              onChange={(e) => onChange({
                ...data,
                companyDetails: { ...data.companyDetails, email: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={data.companyDetails.phone}
              onChange={(e) => onChange({
                ...data,
                companyDetails: { ...data.companyDetails, phone: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Client Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              value={data.clientDetails.name}
              onChange={(e) => onChange({
                ...data,
                clientDetails: { ...data.clientDetails, name: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Address</label>
            <textarea
              value={data.clientDetails.address}
              onChange={(e) => onChange({
                ...data,
                clientDetails: { ...data.clientDetails, address: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Email</label>
            <input
              type="email"
              value={data.clientDetails.email}
              onChange={(e) => onChange({
                ...data,
                clientDetails: { ...data.clientDetails, email: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Items</h3>
          <button
            onClick={addItem}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, { price: Number(e.target.value) })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {data.currency} {(item.quantity * item.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={data.notes}
              onChange={(e) => onChange({ ...data, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              placeholder="Additional notes or payment instructions..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={data.currency}
                onChange={(e) => onChange({ ...data, currency: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
              <select
                value={data.paymentTerms}
                onChange={(e) => onChange({ ...data, paymentTerms: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {PAYMENT_TERMS.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
            <input
              type="number"
              value={data.taxRate}
              onChange={(e) => onChange({ ...data, taxRate: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{data.currency} {data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Tax ({data.taxRate}%):</span>
              <span>{data.currency} {(data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (data.taxRate / 100)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
              <span>Total:</span>
              <span>{data.currency} {(data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) * (1 + data.taxRate / 100)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}