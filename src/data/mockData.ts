import { User, Supplier, Invoice, DashboardStats, NotificationItem, OCRData, InvoiceDocument } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Sophie Martin',
  email: 'sophie.martin@company.com',
  role: 'finance',
  department: 'Finance',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
};

export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'ABC SARL',
    siret: '12345678901234',
    address: '123 Rue de la Paix, 75001 Paris',
    email: 'contact@abc-sarl.fr',
    phone: '+33 1 23 45 67 89',
    contactPerson: 'Jean Dupont',
    paymentTerms: 30,
    paymentMethod: 'virement',
    status: 'active',
    createdAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'XYZ Technologies SAS',
    siret: '98765432109876',
    address: '456 Avenue des Champs, 69002 Lyon',
    email: 'facturation@xyz-tech.fr',
    phone: '+33 4 78 90 12 34',
    contactPerson: 'Marie Dubois',
    paymentTerms: 45,
    paymentMethod: 'virement',
    status: 'active',
    createdAt: '2023-02-20T00:00:00Z'
  },
  {
    id: '3',
    name: 'DEF Services EURL',
    siret: '11223344556677',
    address: '789 Boulevard du Commerce, 13001 Marseille',
    email: 'admin@def-services.fr',
    phone: '+33 4 91 23 45 67',
    contactPerson: 'Pierre Leroy',
    paymentTerms: 30,
    paymentMethod: 'cheque',
    status: 'active',
    createdAt: '2023-03-10T00:00:00Z'
  }
];

export const mockOCRData: OCRData[] = [
  {
    supplierName: 'ABC SARL',
    supplierSiret: '12345678901234',
    invoiceNumber: 'F2025001',
    issueDate: '2025-01-15',
    dueDate: '2025-02-14',
    amountHT: 2916.67,
    amountTTC: 3500.00,
    vatAmount: 583.33,
    currency: 'EUR',
    confidence: 0.95,
    extractedText: 'ABC SARL\nSIRET: 12345678901234\nFacture F2025001\nDate: 15/01/2025\nÉchéance: 14/02/2025\nMontant HT: 2 916,67 €\nTVA 20%: 583,33 €\nMontant TTC: 3 500,00 €'
  },
  {
    supplierName: 'XYZ Technologies SAS',
    supplierSiret: '98765432109876',
    invoiceNumber: 'XYZ-2025-0042',
    issueDate: '2025-01-10',
    dueDate: '2025-02-24',
    amountHT: 6500.00,
    amountTTC: 7800.00,
    vatAmount: 1300.00,
    currency: 'EUR',
    confidence: 0.92,
    extractedText: 'XYZ Technologies SAS\nSIRET: 98765432109876\nFacture XYZ-2025-0042\nDate: 10/01/2025\nÉchéance: 24/02/2025\nMontant HT: 6 500,00 €\nTVA 20%: 1 300,00 €\nMontant TTC: 7 800,00 €'
  }
];

export const mockDocuments: InvoiceDocument[] = [
  {
    id: '1',
    fileName: 'facture_abc_f2025001.pdf',
    fileType: 'application/pdf',
    fileSize: 245760,
    fileUrl: 'https://example.com/invoices/facture_abc_f2025001.pdf',
    thumbnailUrl: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400',
    uploadedAt: '2025-01-15T09:15:00Z',
    uploadedBy: 'ABC SARL',
    documentType: 'invoice'
  },
  {
    id: '2',
    fileName: 'facture_xyz_2025_0042.pdf',
    fileType: 'application/pdf',
    fileSize: 189000,
    fileUrl: 'https://example.com/invoices/facture_xyz_2025_0042.pdf',
    thumbnailUrl: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400',
    uploadedAt: '2025-01-10T14:30:00Z',
    uploadedBy: 'XYZ Technologies SAS',
    documentType: 'invoice'
  }
];

export const invoices: Invoice[] = [
  {
    id: '1',
    number: 'F2025001',
    supplierId: '1',
    supplierName: 'ABC SARL',
    amount: 2916.67,
    amountTTC: 3500.00,
    currency: 'EUR',
    issueDate: '2025-01-15',
    dueDate: '2025-02-14',
    receivedDate: '2025-01-15',
    description: 'Prestations de conseil en informatique',
    orderReference: 'CMD-2025-001',
    status: 'approved',
    paymentStatus: 'scheduled',
    documents: [mockDocuments[0]],
    validations: [
      {
        id: '1',
        userId: '2',
        userName: 'Pierre Durand',
        role: 'Manager',
        action: 'validated',
        comment: 'Prestation conforme à la commande',
        timestamp: '2025-01-16T10:30:00Z',
        level: 1
      },
      {
        id: '2',
        userId: '1',
        userName: 'Sophie Martin',
        role: 'Finance',
        action: 'approved',
        comment: 'Validation comptable OK',
        timestamp: '2025-01-17T14:15:00Z',
        level: 2
      }
    ],
    comments: [],
    ocrData: mockOCRData[0],
    createdAt: '2025-01-15T09:15:00Z',
    updatedAt: '2025-01-17T14:15:00Z'
  },
  {
    id: '2',
    number: 'XYZ-2025-0042',
    supplierId: '2',
    supplierName: 'XYZ Technologies SAS',
    amount: 6500.00,
    amountTTC: 7800.00,
    currency: 'EUR',
    issueDate: '2025-01-10',
    dueDate: '2025-02-24',
    receivedDate: '2025-01-10',
    description: 'Licence logiciel et maintenance annuelle',
    orderReference: 'CMD-2025-002',
    status: 'validated',
    paymentStatus: 'pending',
    documents: [mockDocuments[1]],
    validations: [
      {
        id: '3',
        userId: '3',
        userName: 'Marc Lefevre',
        role: 'Manager',
        action: 'validated',
        comment: 'Licence conforme au contrat',
        timestamp: '2025-01-11T16:45:00Z',
        level: 1
      }
    ],
    comments: [],
    ocrData: mockOCRData[1],
    createdAt: '2025-01-10T14:30:00Z',
    updatedAt: '2025-01-11T16:45:00Z'
  },
  {
    id: '3',
    number: 'DEF-2025-001',
    supplierId: '3',
    supplierName: 'DEF Services EURL',
    amount: 1000.00,
    amountTTC: 1200.00,
    currency: 'EUR',
    issueDate: '2025-01-20',
    dueDate: '2025-02-19',
    receivedDate: '2025-01-20',
    description: 'Services de nettoyage - Janvier 2025',
    status: 'received',
    paymentStatus: 'pending',
    documents: [],
    validations: [],
    comments: [],
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: '4',
    number: 'ABC-2025-002',
    supplierId: '1',
    supplierName: 'ABC SARL',
    amount: 4166.67,
    amountTTC: 5000.00,
    currency: 'EUR',
    issueDate: '2025-01-05',
    dueDate: '2025-01-25',
    receivedDate: '2025-01-05',
    description: 'Développement application mobile',
    status: 'paid',
    paymentStatus: 'paid',
    documents: [],
    validations: [
      {
        id: '4',
        userId: '2',
        userName: 'Pierre Durand',
        role: 'Manager',
        action: 'validated',
        timestamp: '2025-01-06T09:00:00Z',
        level: 1
      },
      {
        id: '5',
        userId: '1',
        userName: 'Sophie Martin',
        role: 'Finance',
        action: 'approved',
        timestamp: '2025-01-07T11:30:00Z',
        level: 2
      }
    ],
    comments: [],
    paymentDate: '2025-01-22',
    paymentReference: 'VIR-2025-001',
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-22T15:30:00Z'
  }
];

export const dashboardStats: DashboardStats = {
  totalInvoices: 156,
  pendingValidation: 8,
  pendingPayment: 12,
  totalAmount: 245780.50,
  overdueInvoices: 3,
  averageProcessingTime: 3.2,
  monthlyVolume: 45,
  supplierCount: 28
};

export const notifications: NotificationItem[] = [
  {
    id: '1',
    type: 'validation_required',
    title: 'Nouvelle facture à valider',
    message: 'DEF Services EURL - Facture DEF-2025-001 (1 200,00€) en attente de validation',
    timestamp: '2025-01-20T08:15:00Z',
    read: false,
    actionUrl: '/invoices/3',
    priority: 'medium'
  },
  {
    id: '2',
    type: 'payment_due',
    title: 'Échéance de paiement',
    message: 'ABC SARL - Facture F2025001 arrive à échéance le 14/02/2025',
    timestamp: '2025-01-19T09:00:00Z',
    read: false,
    actionUrl: '/invoices/1',
    priority: 'high'
  },
  {
    id: '3',
    type: 'invoice_received',
    title: 'Nouvelle facture reçue',
    message: 'XYZ Technologies SAS a déposé une nouvelle facture (7 800,00€)',
    timestamp: '2025-01-10T14:30:00Z',
    read: true,
    actionUrl: '/invoices/2',
    priority: 'low'
  },
  {
    id: '4',
    type: 'payment_executed',
    title: 'Paiement effectué',
    message: 'Paiement de 5 000,00€ à ABC SARL exécuté avec succès',
    timestamp: '2025-01-22T15:30:00Z',
    read: true,
    actionUrl: '/payments',
    priority: 'low'
  }
];