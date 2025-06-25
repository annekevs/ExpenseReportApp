import { User, ExpenseReport, ExpenseCategory, Budget, DashboardStats, NotificationItem, Receipt, OCRData } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Marie Dubois',
  email: 'marie.dubois@company.com',
  role: 'employee',
  department: 'Marketing',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
};

export const expenseCategories: ExpenseCategory[] = [
  {
    id: '1',
    name: 'Transport',
    icon: 'Car',
    maxAmount: 500,
    requiresReceipt: true,
    color: 'bg-blue-500',
    ocrKeywords: ['train', 'taxi', 'uber', 'transport', 'sncf', 'metro', 'bus']
  },
  {
    id: '2',
    name: 'Hébergement',
    icon: 'Building2',
    maxAmount: 300,
    requiresReceipt: true,
    color: 'bg-green-500',
    ocrKeywords: ['hotel', 'hébergement', 'nuit', 'chambre', 'booking', 'airbnb']
  },
  {
    id: '3',
    name: 'Repas',
    icon: 'UtensilsCrossed',
    maxAmount: 75,
    requiresReceipt: true,
    color: 'bg-orange-500',
    ocrKeywords: ['restaurant', 'repas', 'déjeuner', 'dîner', 'café', 'brasserie']
  },
  {
    id: '4',
    name: 'Fournitures',
    icon: 'Package',
    maxAmount: 200,
    requiresReceipt: true,
    color: 'bg-purple-500',
    ocrKeywords: ['fournitures', 'bureau', 'papeterie', 'matériel', 'ordinateur']
  },
  {
    id: '5',
    name: 'Frais kilométriques',
    icon: 'MapPin',
    maxAmount: 1000,
    requiresReceipt: false,
    color: 'bg-red-500',
    ocrKeywords: ['essence', 'carburant', 'péage', 'parking']
  },
  {
    id: '6',
    name: 'Communication',
    icon: 'Phone',
    maxAmount: 150,
    requiresReceipt: true,
    color: 'bg-indigo-500',
    ocrKeywords: ['téléphone', 'internet', 'mobile', 'communication', 'forfait']
  }
];

// Mock OCR data pour différents types de factures
export const mockOCRData: OCRData[] = [
  {
    merchantName: 'SNCF Connect',
    merchantAddress: '2 Place aux Étoiles, 93200 Saint-Denis',
    date: '2024-01-15',
    amount: 156.00,
    currency: 'EUR',
    category: 'Transport',
    taxAmount: 15.60,
    paymentMethod: 'Carte bancaire',
    confidence: 0.95,
    extractedText: 'SNCF CONNECT\nBillet de train\nParis Gare de Lyon - Lyon Part-Dieu\n15/01/2024 - 08:30\nTarif: 156,00 EUR\nTVA: 15,60 EUR'
  },
  {
    merchantName: 'Hotel Mercure Lyon Centre',
    merchantAddress: '50 Cours de la République, 69002 Lyon',
    date: '2024-01-10',
    amount: 140.00,
    currency: 'EUR',
    category: 'Hébergement',
    taxAmount: 14.00,
    paymentMethod: 'Carte bancaire',
    confidence: 0.92,
    extractedText: 'HOTEL MERCURE LYON CENTRE\nChambre Standard - 1 nuit\n10/01/2024\nMontant: 140,00 EUR\nTaxe de séjour: 2,50 EUR\nTVA: 14,00 EUR'
  },
  {
    merchantName: 'Le Bistrot Parisien',
    merchantAddress: '15 Rue de Rivoli, 75001 Paris',
    date: '2024-01-15',
    amount: 85.50,
    currency: 'EUR',
    category: 'Repas',
    taxAmount: 8.55,
    paymentMethod: 'Carte bancaire',
    confidence: 0.88,
    extractedText: 'LE BISTROT PARISIEN\nDéjeuner d\'affaires\n15/01/2024 - 13:30\nMenu: 65,00 EUR\nBoissons: 20,50 EUR\nTVA: 8,55 EUR\nTotal: 85,50 EUR'
  }
];

export const mockReceipts: Receipt[] = [
  {
    id: '1',
    fileName: 'facture_sncf_20240115.pdf',
    fileType: 'application/pdf',
    fileSize: 245760,
    uploadedAt: '2024-01-15T09:15:00Z',
    fileUrl: 'https://example.com/receipts/facture_sncf_20240115.pdf',
    thumbnailUrl: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400',
    ocrData: mockOCRData[0],
    ocrStatus: 'completed'
  },
  {
    id: '2',
    fileName: 'hotel_mercure_lyon.jpg',
    fileType: 'image/jpeg',
    fileSize: 1024000,
    uploadedAt: '2024-01-10T18:30:00Z',
    fileUrl: 'https://example.com/receipts/hotel_mercure_lyon.jpg',
    thumbnailUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400',
    ocrData: mockOCRData[1],
    ocrStatus: 'completed'
  },
  {
    id: '3',
    fileName: 'restaurant_paris.jpg',
    fileType: 'image/jpeg',
    fileSize: 856000,
    uploadedAt: '2024-01-15T14:45:00Z',
    fileUrl: 'https://example.com/receipts/restaurant_paris.jpg',
    thumbnailUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
    ocrData: mockOCRData[2],
    ocrStatus: 'completed'
  }
];

export const mockExpenseReports: ExpenseReport[] = [
  {
    id: '1',
    title: 'Mission client Paris',
    description: 'Déplacement chez le client pour présentation commerciale',
    userId: '1',
    userName: 'Marie Dubois',
    totalAmount: 287.50,
    currency: 'EUR',
    status: 'submitted',
    createdAt: '2024-01-15T09:00:00Z',
    submittedAt: '2024-01-15T14:30:00Z',
    expenses: [
      {
        id: '1',
        category: expenseCategories[0],
        description: 'Train Paris A/R',
        amount: 156.00,
        currency: 'EUR',
        date: '2024-01-15',
        location: 'Paris',
        receipt: mockReceipts[0],
        ocrData: mockOCRData[0]
      },
      {
        id: '2',
        category: expenseCategories[2],
        description: 'Déjeuner client',
        amount: 85.50,
        currency: 'EUR',
        date: '2024-01-15',
        location: 'Paris',
        receipt: mockReceipts[2],
        ocrData: mockOCRData[2]
      },
      {
        id: '3',
        category: expenseCategories[0],
        description: 'Taxi gare - client',
        amount: 46.00,
        currency: 'EUR',
        date: '2024-01-15',
        location: 'Paris',
        receipt: {
          id: '4',
          fileName: 'taxi_paris.jpg',
          fileType: 'image/jpeg',
          fileSize: 512000,
          uploadedAt: '2024-01-15T16:00:00Z',
          fileUrl: 'https://example.com/receipts/taxi_paris.jpg',
          thumbnailUrl: 'https://images.pexels.com/photos/449965/pexels-photo-449965.jpeg?auto=compress&cs=tinysrgb&w=400',
          ocrStatus: 'completed',
          ocrData: {
            merchantName: 'Taxi Parisien',
            date: '2024-01-15',
            amount: 46.00,
            currency: 'EUR',
            category: 'Transport',
            confidence: 0.85,
            extractedText: 'TAXI PARISIEN\nCourse du 15/01/2024\nGare de Lyon - 15 Rue de la Paix\nMontant: 46,00 EUR'
          }
        }
      }
    ],
    receipts: [mockReceipts[0], mockReceipts[2]],
    approvals: [],
    comments: []
  },
  {
    id: '2',
    title: 'Salon professionnel Lyon',
    description: 'Participation au salon TechExpo 2024',
    userId: '1',
    userName: 'Marie Dubois',
    totalAmount: 542.30,
    currency: 'EUR',
    status: 'approved',
    createdAt: '2024-01-10T08:00:00Z',
    submittedAt: '2024-01-10T17:00:00Z',
    approvedAt: '2024-01-12T10:30:00Z',
    expenses: [
      {
        id: '4',
        category: expenseCategories[1],
        description: 'Hôtel 2 nuits',
        amount: 280.00,
        currency: 'EUR',
        date: '2024-01-10',
        location: 'Lyon',
        receipt: mockReceipts[1],
        ocrData: mockOCRData[1]
      },
      {
        id: '5',
        category: expenseCategories[0],
        description: 'Train Lyon A/R',
        amount: 198.30,
        currency: 'EUR',
        date: '2024-01-10',
        location: 'Lyon',
        receipt: {
          id: '5',
          fileName: 'train_lyon.pdf',
          fileType: 'application/pdf',
          fileSize: 189000,
          uploadedAt: '2024-01-10T08:30:00Z',
          fileUrl: 'https://example.com/receipts/train_lyon.pdf',
          thumbnailUrl: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400',
          ocrStatus: 'completed',
          ocrData: {
            merchantName: 'SNCF Connect',
            date: '2024-01-10',
            amount: 198.30,
            currency: 'EUR',
            category: 'Transport',
            confidence: 0.93,
            extractedText: 'SNCF CONNECT\nParis - Lyon A/R\n10/01/2024\nMontant: 198,30 EUR'
          }
        }
      },
      {
        id: '6',
        category: expenseCategories[2],
        description: 'Repas salon',
        amount: 64.00,
        currency: 'EUR',
        date: '2024-01-11',
        location: 'Lyon',
        receipt: {
          id: '6',
          fileName: 'repas_salon_lyon.jpg',
          fileType: 'image/jpeg',
          fileSize: 678000,
          uploadedAt: '2024-01-11T20:00:00Z',
          fileUrl: 'https://example.com/receipts/repas_salon_lyon.jpg',
          thumbnailUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
          ocrStatus: 'completed',
          ocrData: {
            merchantName: 'Restaurant du Salon',
            date: '2024-01-11',
            amount: 64.00,
            currency: 'EUR',
            category: 'Repas',
            confidence: 0.90,
            extractedText: 'RESTAURANT DU SALON\nDîner\n11/01/2024\nMontant: 64,00 EUR'
          }
        }
      }
    ],
    receipts: [mockReceipts[1]],
    approvals: [
      {
        id: '1',
        userId: '2',
        userName: 'Pierre Martin',
        role: 'Manager',
        action: 'approved',
        comment: 'Dépenses conformes au salon professionnel',
        timestamp: '2024-01-12T10:30:00Z'
      }
    ],
    comments: []
  }
];

export const budgets: Budget[] = [
  {
    category: 'Transport',
    allocated: 2000,
    spent: 1450,
    remaining: 550,
    period: 'monthly'
  },
  {
    category: 'Hébergement',
    allocated: 1500,
    spent: 890,
    remaining: 610,
    period: 'monthly'
  },
  {
    category: 'Repas',
    allocated: 800,
    spent: 624,
    remaining: 176,
    period: 'monthly'
  },
  {
    category: 'Fournitures',
    allocated: 600,
    spent: 287,
    remaining: 313,
    period: 'monthly'
  }
];

export const dashboardStats: DashboardStats = {
  totalExpenses: 995.79,
  pendingApprovals: 3,
  monthlySpent: 2851.43,
  averageProcessingTime: 2.4,
  budgetUtilization: 68.5
};

export const notifications: NotificationItem[] = [
  {
    id: '1',
    type: 'approval_request',
    title: 'Nouvelle note de frais',
    message: 'Jean Dupont a soumis une note de frais de 234,50€',
    timestamp: '2024-01-16T10:30:00Z',
    read: false,
    actionUrl: '/expenses/4'
  },
  {
    id: '2',
    type: 'ocr_completed',
    title: 'Extraction terminée',
    message: 'Les données de votre facture SNCF ont été extraites automatiquement',
    timestamp: '2024-01-15T16:45:00Z',
    read: false,
    actionUrl: '/expenses/1'
  },
  {
    id: '3',
    type: 'expense_approved',
    title: 'Note approuvée',
    message: 'Votre note "Mission client Paris" a été approuvée',
    timestamp: '2024-01-15T16:45:00Z',
    read: false,
    actionUrl: '/expenses/1'
  },
  {
    id: '4',
    type: 'payment_processed',
    title: 'Remboursement effectué',
    message: 'Remboursement de 165,99€ traité avec succès',
    timestamp: '2024-01-10T14:20:00Z',
    read: true,
    actionUrl: '/expenses/3'
  }
];