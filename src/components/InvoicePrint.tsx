import React from 'react';
import { format } from 'date-fns';
import { InvoiceData } from '../types';

interface Props {
  data: InvoiceData;
}

export default function InvoicePrint({ data }: Props) {
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto bg-white p-12">
      <div className="flex justify-between items-start mb-12">
        <div className="flex-1">
          {data.companyDetails.logo && (
            <img
              src={data.companyDetails.logo}
              alt="Company Logo"
              className="max-h-24 mb-4 object-contain"
            />
          )}
          <h1 className="text-5xl font-bold text-gray-800 tracking-tight">INVOICE</h1>
          <p className="text-gray-600 mt-2 text-lg">#{data.invoiceNumber}</p>
          <div className="mt-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              data.status === 'paid' ? 'bg-green-100 text-green-800' :
              data.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl text-gray-800">{data.companyDetails.name}</p>
          <p className="text-gray-600 whitespace-pre-line mt-2">{data.companyDetails.address}</p>
          <p className="text-gray-600 mt-2">{data.companyDetails.email}</p>
          <p className="text-gray-600">{data.companyDetails.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-gray-700 font-medium mb-4">Bill To:</h2>
          <p className="font-medium text-lg text-gray-800">{data.clientDetails.name}</p>
          <p className="text-gray-600 whitespace-pre-line mt-2">{data.clientDetails.address}</p>
          <p className="text-gray-600 mt-2">{data.clientDetails.email}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Date:</span>
              <span className="font-medium">{format(data.date, 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">{format(data.dueDate, 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Terms:</span>
              <span className="font-medium">{data.paymentTerms}</span>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="py-4 text-left text-gray-600 font-medium">Description</th>
            <th className="py-4 text-right text-gray-600 font-medium">Quantity</th>
            <th className="py-4 text-right text-gray-600 font-medium">Price</th>
            <th className="py-4 text-right text-gray-600 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.items.map((item) => (
            <tr key={item.id}>
              <td className="py-4">{item.description}</td>
              <td className="py-4 text-right">{item.quantity}</td>
              <td className="py-4 text-right">{data.currency} {item.price.toFixed(2)}</td>
              <td className="py-4 text-right">{data.currency} {(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-12">
        <div className="w-80 space-y-3">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{data.currency} {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Tax ({data.taxRate}%):</span>
            <span className="font-medium">{data.currency} {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 text-lg font-bold">
            <span>Total:</span>
            <span>{data.currency} {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-gray-700 font-medium mb-2">Notes:</h2>
          <p className="text-gray-600 whitespace-pre-line">{data.notes}</p>
        </div>
      )}
    </div>
  );
}