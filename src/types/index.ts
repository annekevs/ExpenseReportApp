export interface User {
  id: string;
  name: string;
  email: string;
  role: 'supplier' | 'internal_requester' | 'manager' | 'finance' | 'admin';
  department?: string;
  company?: string;
  avatar?: string;
}

export interface Supplier {
  id: string;
  name: string;
  siret: string;
  address: string;
  email: string;
  phone: string;
  contactPerson: string;
  paymentTerms: number; // jours
  paymentMethod: 'virement' | 'cheque' | 'autre';
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  amountTTC: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  receivedDate: string;
  description: string;
  orderReference?: string;
  deliveryReference?: string;
  status: 'received' | 'validated' | 'approved' | 'paid' | 'rejected' | 'disputed';
  paymentStatus: 'pending' | 'scheduled' | 'paid' | 'failed' | 'cancelled';
  documents: InvoiceDocument[];
  validations: Validation[];
  comments: Comment[];
  ocrData?: OCRData;
  paymentDate?: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
  documentType: 'invoice' | 'credit_note' | 'delivery_note' | 'order' | 'other';
}

export interface OCRData {
  supplierName?: string;
  supplierSiret?: string;
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  amountHT?: number;
  amountTTC?: number;
  vatAmount?: number;
  currency?: string;
  confidence: number;
  extractedText?: string;
}

export interface Validation {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: 'validated' | 'approved' | 'rejected';
  comment?: string;
  timestamp: string;
  level: number; // niveau de validation
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  type: 'comment' | 'dispute' | 'clarification';
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: 'virement' | 'cheque' | 'autre';
  scheduledDate: string;
  executedDate?: string;
  bankReference?: string;
  status: 'scheduled' | 'executed' | 'failed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

export interface DashboardStats {
  totalInvoices: number;
  pendingValidation: number;
  pendingPayment: number;
  totalAmount: number;
  overdueInvoices: number;
  averageProcessingTime: number;
  monthlyVolume: number;
  supplierCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'invoice_received' | 'validation_required' | 'payment_due' | 'payment_executed' | 'dispute_raised';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface WorkflowRule {
  id: string;
  name: string;
  conditions: {
    amountMin?: number;
    amountMax?: number;
    supplierId?: string;
    department?: string;
  };
  validators: {
    level: number;
    role: string;
    userId?: string;
  }[];
  active: boolean;
}