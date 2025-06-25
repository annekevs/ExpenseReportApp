export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'finance';
  department: string;
  avatar?: string;
}

export interface ExpenseReport {
  id: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  expenses: Expense[];
  receipts: Receipt[];
  approvals: Approval[];
  comments: Comment[];
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  currency: string;
  date: string;
  location?: string;
  isAdvance?: boolean;
  mileage?: MileageData;
  receipt?: Receipt; // Justificatif obligatoire
  ocrData?: OCRData; // Données extraites
}

export interface Receipt {
  id: string;
  expenseId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  fileUrl: string;
  thumbnailUrl?: string;
  ocrData?: OCRData;
  ocrStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface OCRData {
  merchantName?: string;
  merchantAddress?: string;
  date?: string;
  amount?: number;
  currency?: string;
  category?: string;
  taxAmount?: number;
  paymentMethod?: string;
  confidence: number; // Score de confiance de l'extraction
  extractedText?: string;
}

export interface MileageData {
  fromLocation: string;
  toLocation: string;
  distance: number;
  rate: number;
  vehicleType: 'car' | 'motorcycle' | 'bicycle';
}

export interface Approval {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: 'approved' | 'rejected';
  comment?: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  maxAmount?: number;
  requiresReceipt: boolean;
  color: string;
  ocrKeywords?: string[]; // Mots-clés pour la catégorisation automatique
}

export interface Budget {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  period: 'monthly' | 'quarterly' | 'yearly';
}

export interface DashboardStats {
  totalExpenses: number;
  pendingApprovals: number;
  monthlySpent: number;
  averageProcessingTime: number;
  budgetUtilization: number;
}

export interface NotificationItem {
  id: string;
  type: 'approval_request' | 'expense_approved' | 'expense_rejected' | 'payment_processed' | 'ocr_completed';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}