import React, { useState } from 'react';
import { X } from 'lucide-react';
import { InvoiceData, InvoiceDraft } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (draft: InvoiceDraft) => void;
  currentData: InvoiceData;
}

export default function DraftDialog({ isOpen, onClose, onSave, currentData }: Props) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a name for the draft');
      return;
    }

    const draft: InvoiceDraft = {
      ...currentData,
      draftName: name.trim(),
      lastModified: new Date(),
      status: 'draft'
    };

    onSave(draft);
    onClose();
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Save as Draft</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Draft Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., March Website Project Invoice"
            />
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
              disabled={!name.trim()}
            >
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}