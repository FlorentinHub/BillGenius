import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FileText, Copy, Save, Trash2, BookTemplate, FileEdit } from 'lucide-react';
import InvoiceForm from './InvoiceForm';
import InvoicePrint from './InvoicePrint';
import TemplateDialog from './TemplateDialog';
import TemplateList from './TemplateList';
import DraftDialog from './DraftDialog';
import DraftList from './DraftList';
import { supabase } from '../lib/supabase';
import { InvoiceData, InvoiceTemplate, InvoiceDraft, User } from '../types';

interface Props {
  user: User;
}

const initialData: InvoiceData = {
  id: crypto.randomUUID(),
  invoiceNumber: '001',
  date: new Date(),
  dueDate: new Date(),
  companyDetails: {
    name: 'Your Company Name',
    address: '123 Business Street\nCity, State 12345',
    email: 'contact@company.com',
    phone: '(555) 555-5555'
  },
  clientDetails: {
    name: '',
    address: '',
    email: ''
  },
  items: [
    {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      price: 0
    }
  ],
  notes: '',
  taxRate: 10,
  currency: 'USD',
  status: 'draft',
  paymentTerms: 'Net 30'
};

export default function InvoiceGenerator({ user }: Props) {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData>(initialData);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [drafts, setDrafts] = useState<InvoiceDraft[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUserData();
  }, [user.id]);

  const loadUserData = async () => {
    try {
      // Load templates
      const { data: templateData } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.id);

      if (templateData) {
        setTemplates(templateData);
      }

      // Load drafts
      const { data: draftData } = await supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id);

      if (draftData) {
        setDrafts(draftData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleSaveTemplate = async (template: InvoiceTemplate) => {
    try {
      const { error } = await supabase
        .from('templates')
        .insert([{ ...template, user_id: user.id }]);

      if (error) throw error;
      await loadUserData();
    } catch (error) {
      console.error('Error saving template:', error);
    }
    setShowTemplateDialog(false);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        const { error } = await supabase
          .from('templates')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await loadUserData();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleApplyTemplate = (template: InvoiceTemplate) => {
    const newInvoice = { ...currentInvoice };
    
    if (template.companyDetails) newInvoice.companyDetails = template.companyDetails;
    if (template.clientDetails) newInvoice.clientDetails = template.clientDetails;
    if (template.items) newInvoice.items = template.items;
    if (template.taxRate) newInvoice.taxRate = template.taxRate;
    if (template.currency) newInvoice.currency = template.currency;
    if (template.paymentTerms) newInvoice.paymentTerms = template.paymentTerms;
    if (template.notes) newInvoice.notes = template.notes;

    setCurrentInvoice(newInvoice);
    setShowTemplates(false);
  };

  const handleSaveDraft = async (draft: InvoiceDraft) => {
    try {
      const { error } = await supabase
        .from('drafts')
        .insert([{ ...draft, user_id: user.id }]);

      if (error) throw error;
      await loadUserData();
    } catch (error) {
      console.error('Error saving draft:', error);
    }
    setShowDraftDialog(false);
  };

  const handleDeleteDraft = async (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      try {
        const { error } = await supabase
          .from('drafts')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await loadUserData();
      } catch (error) {
        console.error('Error deleting draft:', error);
      }
    }
  };

  const handleLoadDraft = (draft: InvoiceDraft) => {
    setCurrentInvoice(draft);
    setShowDrafts(false);
  };

  const duplicateInvoice = () => {
    const newInvoice: InvoiceData = {
      ...currentInvoice,
      id: crypto.randomUUID(),
      invoiceNumber: `${currentInvoice.invoiceNumber}-copy`,
      date: new Date(),
      status: 'draft'
    };
    setInvoices([...invoices, newInvoice]);
    setCurrentInvoice(newInvoice);
  };

  const saveInvoice = () => {
    const existingIndex = invoices.findIndex(inv => inv.id === currentInvoice.id);
    if (existingIndex >= 0) {
      const newInvoices = [...invoices];
      newInvoices[existingIndex] = currentInvoice;
      setInvoices(newInvoices);
    } else {
      setInvoices([...invoices, currentInvoice]);
    }
  };

  const deleteInvoice = () => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(inv => inv.id !== currentInvoice.id));
      setCurrentInvoice(initialData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Invoice Generator</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <BookTemplate size={20} />
              Templates
            </button>
            <button
              onClick={() => setShowTemplateDialog(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save size={20} />
              Save as Template
            </button>
            <button
              onClick={() => setShowDrafts(true)}
              className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              <FileEdit size={20} />
              Drafts
            </button>
            <button
              onClick={() => setShowDraftDialog(true)}
              className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Save size={20} />
              Save as Draft
            </button>
            <button
              onClick={duplicateInvoice}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Copy size={20} />
              Duplicate
            </button>
            <button
              onClick={saveInvoice}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={20} />
              Save
            </button>
            <button
              onClick={deleteInvoice}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={20} />
              Delete
            </button>
          </div>
        </div>

        {showTemplates && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Templates</h2>
              <TemplateList
                templates={templates}
                onSelect={handleApplyTemplate}
                onDelete={handleDeleteTemplate}
                onClose={() => setShowTemplates(false)}
              />
            </div>
          </div>
        )}

        {showDrafts && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Saved Drafts</h2>
              <DraftList
                drafts={drafts}
                onSelect={handleLoadDraft}
                onDelete={handleDeleteDraft}
                onClose={() => setShowDrafts(false)}
              />
            </div>
          </div>
        )}

        <TemplateDialog
          isOpen={showTemplateDialog}
          onClose={() => setShowTemplateDialog(false)}
          onSave={handleSaveTemplate}
          currentData={currentInvoice}
        />

        <DraftDialog
          isOpen={showDraftDialog}
          onClose={() => setShowDraftDialog(false)}
          onSave={handleSaveDraft}
          currentData={currentInvoice}
        />

        <div className="mb-8">
          <InvoiceForm
            data={currentInvoice}
            onChange={setCurrentInvoice}
            onPrint={handlePrint}
          />
        </div>
        
        <div className="hidden">
          <div ref={printRef}>
            <InvoicePrint data={currentInvoice} />
          </div>
        </div>

        {invoices.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Saved Invoices</h2>
            <div className="grid gap-4">
              {invoices.map(invoice => (
                <div
                  key={invoice.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer"
                  onClick={() => setCurrentInvoice(invoice)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Invoice #{invoice.invoiceNumber}</h3>
                      <p className="text-sm text-gray-600">{invoice.clientDetails.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                      <FileText size={20} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}