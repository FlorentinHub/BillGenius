import React from 'react';
import { format } from 'date-fns';
import { Trash2, FileText } from 'lucide-react';
import { InvoiceDraft } from '../types';

interface Props {
  drafts: InvoiceDraft[];
  onSelect: (draft: InvoiceDraft) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function DraftList({ drafts, onSelect, onDelete, onClose }: Props) {
  if (drafts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No drafts available</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {drafts.map(draft => (
        <div
          key={draft.id}
          className="bg-white p-4 rounded-lg border hover:border-blue-500 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => onSelect(draft)}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">{draft.draftName}</h3>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  #{draft.invoiceNumber}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                Client: {draft.clientDetails.name || 'No client specified'}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                Last modified: {format(new Date(draft.lastModified), 'MMM dd, yyyy HH:mm')}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {draft.currency} {draft.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">
                  ({draft.items.length} items)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDelete(draft.id)}
                className="text-gray-400 hover:text-red-600 p-1"
                title="Delete draft"
              >
                <Trash2 size={20} />
              </button>
              <FileText size={20} className="text-gray-400" />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}