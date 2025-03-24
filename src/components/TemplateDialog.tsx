import React, { useState } from 'react';
import { X } from 'lucide-react';
import { InvoiceData, InvoiceTemplate, TemplateFieldOption } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: InvoiceTemplate) => void;
  currentData: InvoiceData;
}

const TEMPLATE_FIELDS: TemplateFieldOption[] = [
  {
    field: 'companyDetails',
    label: 'Company Details',
    description: 'Include company information (name, address, contact details)'
  },
  {
    field: 'clientDetails',
    label: 'Client Details',
    description: 'Include default client information'
  },
  {
    field: 'items',
    label: 'Line Items',
    description: 'Save current items as template items'
  },
  {
    field: 'taxRate',
    label: 'Tax Rate',
    description: 'Include the current tax rate setting'
  },
  {
    field: 'currency',
    label: 'Currency',
    description: 'Save the selected currency'
  },
  {
    field: 'paymentTerms',
    label: 'Payment Terms',
    description: 'Include payment terms'
  },
  {
    field: 'notes',
    label: 'Notes',
    description: 'Include any default notes'
  }
];

export default function TemplateDialog({ isOpen, onClose, onSave, currentData }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleFieldToggle = (field: string) => {
    const newFields = new Set(selectedFields);
    if (newFields.has(field)) {
      newFields.delete(field);
    } else {
      newFields.add(field);
    }
    setSelectedFields(newFields);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }

    const template: InvoiceTemplate = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date()
    };

    // Only include selected fields in the template
    selectedFields.forEach((field) => {
      if (field in currentData) {
        template[field as keyof InvoiceTemplate] = currentData[field as keyof InvoiceData];
      }
    });

    onSave(template);
    onClose();
    setName('');
    setDescription('');
    setSelectedFields(new Set());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Template</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Standard Invoice Template"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
              placeholder="Brief description of the template"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Fields to Include
            </label>
            <div className="grid grid-cols-2 gap-4">
              {TEMPLATE_FIELDS.map((field) => (
                <div
                  key={field.field}
                  className="relative flex items-start"
                >
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={selectedFields.has(field.field)}
                      onChange={() => handleFieldToggle(field.field)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label className="font-medium text-gray-700">
                      {field.label}
                    </label>
                    <p className="text-sm text-gray-500">{field.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={!name.trim() || selectedFields.size === 0}
            >
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}