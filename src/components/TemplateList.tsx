import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { InvoiceTemplate } from '../types';

interface Props {
  templates: InvoiceTemplate[];
  onSelect: (template: InvoiceTemplate) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function TemplateList({ templates, onSelect, onDelete, onClose }: Props) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No templates available</p>
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
      {templates.map(template => (
        <div
          key={template.id}
          className="bg-white p-4 rounded-lg border hover:border-blue-500 transition-colors cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div
              className="flex-1"
              onClick={() => onSelect(template)}
            >
              <h3 className="font-medium text-lg">{template.name}</h3>
              {template.description && (
                <p className="text-gray-600 text-sm mt-1">{template.description}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                Created: {format(new Date(template.createdAt), 'MMM dd, yyyy')}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(template)
                  .filter(([key]) => key !== 'id' && key !== 'name' && key !== 'description' && key !== 'createdAt')
                  .map(([key]) => (
                    <span
                      key={key}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  ))}
              </div>
            </div>
            <button
              onClick={() => onDelete(template.id)}
              className="text-gray-400 hover:text-red-600 p-1"
              title="Delete template"
            >
              <Trash2 size={20} />
            </button>
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