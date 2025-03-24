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
    <div className="max-w-4xl mx-auto bg-white p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
          <p className="text-gray-600 mt-1">#{data.invoiceNumber}</p>
          <div className="mt-2">
            <span className={`px-2 py-1 rounded text-sm ${
              data.status === 'paid' ? 'bg-green-100 text-green-800' :
              data.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">{data.companyDetails.name}</p>
          <p className="text-gray-600 whitespace-pre-line">{data.companyDetails.address}</p>
          <p className="text-gray-600">{data.companyDetails.email}</p>
          <p className="text-gray-600">{data.companyDetails.phone}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-gray-600 font-medium">Bill To:</h2>
          <p className="font-medium mt-2">{data.clientDetails.name}</p>
          <p className="text-gray-600 whitespace-pre-line">{data.clientDetails.address}</p>
          <p className="text-gray-600">{data.clientDetails.email}</p>
        </div>
        <div className="text-right">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Date:</span>
              <span>{format(data.date, 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span>{format(data.dueDate, 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Terms:</span>
              <span>{data.paymentTerms}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 text-left text-gray-600">Description</th>
              <th className="py-3 text-right text-gray-600">Quantity</th>
              <th className="py-3 text-right text-gray-600">Price</th>
              <th className="py-3 text-right text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-4">{item.description}</td>
                
                <td className="py-4 text-right">{item.quantity}</td>
                <td className="py-4 text-right">{data.currency} {item.price.toFixed(2)}</td>
                <td className="py-4 text-right">{data.currency} {(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal:</span>
            <span>{data.currency} {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Tax ({data.taxRate}%):</span>
            <span>{data.currency} {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total:</span>
            <span>{data.currency} {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="mt-8">
          <h2 className="text-gray-600 font-medium">Notes:</h2>
          <p className="text-gray-600 mt-2 whitespace-pre-line">{data.notes}</p>
        </div>
      )}
    </div>
  );
}