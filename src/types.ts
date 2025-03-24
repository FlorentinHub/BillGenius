export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface CompanyDetails {
  name: string;
  address: string;
  email: string;
  phone: string;
  logo?: string;
}

export interface ClientDetails {
  name: string;
  address: string;
  email: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  companyDetails: CompanyDetails;
  clientDetails: ClientDetails;
  items: InvoiceItem[];
  notes: string;
  taxRate: number;
  currency: string;
  status: 'draft' | 'pending' | 'paid';
  paymentTerms: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  companyDetails?: CompanyDetails;
  clientDetails?: ClientDetails;
  items?: InvoiceItem[];
  taxRate?: number;
  currency?: string;
  paymentTerms?: string;
  notes?: string;
  isPublic?: boolean;
}

export interface InvoiceDraft extends InvoiceData {
  draftName: string;
  lastModified: Date;
}

export type TemplateField = keyof InvoiceTemplate;

export interface TemplateFieldOption {
  field: TemplateField;
  label: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface PublicTemplate {
  id: string;
  name: string;
  description?: string;
  data: InvoiceTemplate;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  companyLogo?: string;
}