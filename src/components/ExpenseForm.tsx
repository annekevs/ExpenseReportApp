import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Plus,
  Upload,
  X,
  Calendar,
  MapPin,
  DollarSign,
  Save,
  Send,
  Camera,
  Trash2,
  AlertCircle,
  FileText,
  Image,
  CheckCircle,
  Clock,
  Eye,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { expenseCategories, mockOCRData } from '../data/mockData';
import { Expense, ExpenseReport, Receipt, OCRData } from '../types';

interface ExpenseFormProps {
  onBack: () => void;
  expense?: ExpenseReport;
  isEditing?: boolean;
}

export default function ExpenseForm({ onBack, expense, isEditing = false }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: expense?.title || '',
    description: expense?.description || '',
    status: expense?.status || 'draft'
  });

  const [expenses, setExpenses] = useState<Expense[]>(
    expense?.expenses || []
  );

  const [currentExpense, setCurrentExpense] = useState<Partial<Expense>>({
    category: expenseCategories[0],
    description: '',
    amount: 0,
    currency: 'EUR',
    date: new Date().toISOString().split('T')[0],
    location: ''
  });

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [processingOCR, setProcessingOCR] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const validateExpense = (exp: Partial<Expense>) => {
    const newErrors: Record<string, string> = {};
    
    if (!exp.description?.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    if (!exp.amount || exp.amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }
    
    if (exp.category?.maxAmount && exp.amount && exp.amount > exp.category.maxAmount) {
      newErrors.amount = `Le montant ne peut pas dépasser ${exp.category.maxAmount}€`;
    }
    
    if (!exp.date) {
      newErrors.date = 'La date est requise';
    }

    // Vérification du justificatif obligatoire
    if (exp.category?.requiresReceipt && !exp.receipt) {
      newErrors.receipt = 'Un justificatif est requis pour cette catégorie';
    }

    return newErrors;
  };

  const simulateOCRProcessing = (file: File): Promise<OCRData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulation de l'extraction OCR avec des données aléatoires
        const randomOCR = mockOCRData[Math.floor(Math.random() * mockOCRData.length)];
        resolve({
          ...randomOCR,
          confidence: 0.85 + Math.random() * 0.15 // Score entre 0.85 et 1.0
        });
      }, 2000 + Math.random() * 3000); // Délai entre 2 et 5 secondes
    });
  };

  const handleFileUpload = async (file: File) => {
    setUploadingReceipt(true);
    setProcessingOCR(true);

    try {
      // Simulation de l'upload du fichier
      const receipt: Receipt = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        fileUrl: URL.createObjectURL(file),
        thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        ocrStatus: 'processing'
      };

      // Mise à jour de l'état avec le reçu en cours de traitement
      setCurrentExpense(prev => ({ ...prev, receipt }));
      setUploadingReceipt(false);

      // Simulation du traitement OCR
      const ocrData = await simulateOCRProcessing(file);
      
      // Mise à jour avec les données extraites
      const updatedReceipt: Receipt = {
        ...receipt,
        ocrData,
        ocrStatus: 'completed'
      };

      // Auto-remplissage des champs basé sur l'OCR
      const suggestedCategory = expenseCategories.find(cat => 
        cat.ocrKeywords?.some(keyword => 
          ocrData.extractedText?.toLowerCase().includes(keyword.toLowerCase()) ||
          ocrData.merchantName?.toLowerCase().includes(keyword.toLowerCase())
        )
      ) || expenseCategories[0];

      setCurrentExpense(prev => ({
        ...prev,
        receipt: updatedReceipt,
        ocrData,
        description: ocrData.merchantName || prev.description,
        amount: ocrData.amount || prev.amount,
        date: ocrData.date || prev.date,
        category: suggestedCategory
      }));

      setProcessingOCR(false);
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error);
      setUploadingReceipt(false);
      setProcessingOCR(false);
    }
  };

  const handleAddExpense = () => {
    const validationErrors = validateExpense(currentExpense);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      category: currentExpense.category!,
      description: currentExpense.description!,
      amount: currentExpense.amount!,
      currency: currentExpense.currency!,
      date: currentExpense.date!,
      location: currentExpense.location,
      receipt: currentExpense.receipt,
      ocrData: currentExpense.ocrData
    };

    setExpenses([...expenses, newExpense]);
    setCurrentExpense({
      category: expenseCategories[0],
      description: '',
      amount: 0,
      currency: 'EUR',
      date: new Date().toISOString().split('T')[0],
      location: ''
    });
    setShowAddExpense(false);
    setErrors({});
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleSave = (status: 'draft' | 'submitted') => {
    if (expenses.length === 0) {
      alert('Veuillez ajouter au moins une dépense');
      return;
    }

    if (!formData.title.trim()) {
      alert('Veuillez saisir un titre');
      return;
    }

    // Vérification que toutes les dépenses ont un justificatif si requis
    const missingReceipts = expenses.filter(exp => 
      exp.category.requiresReceipt && !exp.receipt
    );

    if (missingReceipts.length > 0) {
      alert(`Des justificatifs sont manquants pour ${missingReceipts.length} dépense(s)`);
      return;
    }

    console.log('Saving expense report:', {
      ...formData,
      expenses,
      totalAmount,
      status
    });

    alert(`Note de frais ${status === 'draft' ? 'sauvegardée' : 'soumise'} avec succès !`);
    onBack();
  };

  const getCategoryIcon = (iconName: string) => {
    const icons = {
      Car: <div className="w-5 h-5 bg-current rounded"></div>,
      Building2: <div className="w-5 h-5 bg-current rounded"></div>,
      UtensilsCrossed: <div className="w-5 h-5 bg-current rounded"></div>,
      Package: <div className="w-5 h-5 bg-current rounded"></div>,
      MapPin: <div className="w-5 h-5 bg-current rounded"></div>,
      Phone: <div className="w-5 h-5 bg-current rounded"></div>
    };
    return icons[iconName as keyof typeof icons] || <div className="w-5 h-5 bg-current rounded"></div>;
  };

  const getOCRStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier la note' : 'Nouvelle note de frais'}
            </h1>
            <p className="text-gray-600 mt-1">
              {expenses.length} dépense{expenses.length > 1 ? 's' : ''} • 
              Total: {totalAmount.toLocaleString('fr-FR')}€
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Informations générales
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la note *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  placeholder="Ex: Mission client Paris"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="form-input"
                  placeholder="Décrivez le contexte de ces frais..."
                />
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Dépenses ({expenses.length})
              </h3>
              <button
                onClick={() => setShowAddExpense(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une dépense
              </button>
            </div>

            {expenses.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune dépense ajoutée
                </h4>
                <p className="text-gray-500 mb-4">
                  Commencez par ajouter vos premières dépenses avec leurs justificatifs
                </p>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une dépense
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((exp) => (
                  <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${exp.category.color} text-white`}>
                          {getCategoryIcon(exp.category.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {exp.category.name}
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {exp.amount.toLocaleString('fr-FR')}€
                            </span>
                            {exp.ocrData && (
                              <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Auto-rempli
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {exp.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(exp.date).toLocaleDateString('fr-FR')}
                            </div>
                            {exp.location && (
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {exp.location}
                              </div>
                            )}
                          </div>
                          
                          {/* Receipt Status */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              {exp.receipt ? (
                                <div className="flex items-center text-sm text-green-600">
                                  {getOCRStatusIcon(exp.receipt.ocrStatus)}
                                  <span className="ml-1">
                                    {exp.receipt.ocrStatus === 'processing' ? 'Traitement en cours...' :
                                     exp.receipt.ocrStatus === 'completed' ? 'Justificatif traité' :
                                     exp.receipt.ocrStatus === 'failed' ? 'Erreur de traitement' :
                                     'Justificatif ajouté'}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center text-sm text-red-600">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  {exp.category.requiresReceipt ? 'Justificatif requis' : 'Justificatif optionnel'}
                                </div>
                              )}
                            </div>
                            {exp.receipt && (
                              <button className="text-sm text-blue-600 hover:text-blue-500">
                                <Eye className="w-4 h-4 inline mr-1" />
                                Voir
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveExpense(exp.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Expense Modal */}
          {showAddExpense && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Ajouter une dépense
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddExpense(false);
                        setErrors({});
                        setCurrentExpense({
                          category: expenseCategories[0],
                          description: '',
                          amount: 0,
                          currency: 'EUR',
                          date: new Date().toISOString().split('T')[0],
                          location: ''
                        });
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Receipt Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Justificatif *
                        {currentExpense.category?.requiresReceipt && (
                          <span className="text-red-500 ml-1">(Obligatoire)</span>
                        )}
                      </label>
                      
                      {!currentExpense.receipt ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                          <div className="text-center">
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Glissez votre justificatif ici ou
                            </p>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingReceipt}
                              className="btn-primary"
                            >
                              {uploadingReceipt ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Upload en cours...
                                </>
                              ) : (
                                <>
                                  <Camera className="w-4 h-4 mr-2" />
                                  Parcourir les fichiers
                                </>
                              )}
                            </button>
                            <p className="text-xs text-gray-500 mt-2">
                              PDF, JPG, PNG jusqu'à 10MB
                            </p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file);
                            }}
                            className="hidden"
                          />
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {currentExpense.receipt.thumbnailUrl ? (
                                <img
                                  src={currentExpense.receipt.thumbnailUrl}
                                  alt="Justificatif"
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  {currentExpense.receipt.fileName}
                                </h4>
                                <button
                                  onClick={() => setCurrentExpense(prev => ({ ...prev, receipt: undefined, ocrData: undefined }))}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-500">
                                {(currentExpense.receipt.fileSize / 1024).toFixed(1)} KB
                              </p>
                              <div className="flex items-center mt-2">
                                {getOCRStatusIcon(currentExpense.receipt.ocrStatus)}
                                <span className="ml-2 text-sm text-gray-600">
                                  {processingOCR ? 'Extraction des données en cours...' :
                                   currentExpense.receipt.ocrStatus === 'completed' ? 'Données extraites automatiquement' :
                                   currentExpense.receipt.ocrStatus === 'failed' ? 'Erreur lors de l\'extraction' :
                                   'En attente de traitement'}
                                </span>
                              </div>
                              
                              {currentExpense.ocrData && currentExpense.ocrData.confidence > 0.8 && (
                                <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                                  <div className="flex items-center text-green-700 mb-1">
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    Données extraites (confiance: {Math.round(currentExpense.ocrData.confidence * 100)}%)
                                  </div>
                                  <div className="text-green-600 text-xs">
                                    Commerçant: {currentExpense.ocrData.merchantName}<br/>
                                    Montant: {currentExpense.ocrData.amount}€<br/>
                                    Date: {currentExpense.ocrData.date}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {errors.receipt && (
                        <p className="mt-1 text-sm text-red-600">{errors.receipt}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Catégorie *
                        </label>
                        <select
                          value={currentExpense.category?.id || ''}
                          onChange={(e) => {
                            const category = expenseCategories.find(cat => cat.id === e.target.value);
                            setCurrentExpense({ ...currentExpense, category });
                          }}
                          className="form-input"
                        >
                          {expenseCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                              {category.maxAmount && ` (max ${category.maxAmount}€)`}
                              {category.requiresReceipt && ' *'}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Montant *
                          {currentExpense.ocrData && (
                            <span className="text-green-600 text-xs ml-2">
                              (Auto-rempli)
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={currentExpense.amount || ''}
                            onChange={(e) => setCurrentExpense({ ...currentExpense, amount: parseFloat(e.target.value) || 0 })}
                            className={`form-input pr-12 ${errors.amount ? 'border-red-500' : ''} ${
                              currentExpense.ocrData ? 'bg-green-50 border-green-300' : ''
                            }`}
                            placeholder="0.00"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            €
                          </span>
                        </div>
                        {errors.amount && (
                          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                        )}
                        {currentExpense.category?.maxAmount && (
                          <p className="mt-1 text-xs text-gray-500">
                            Limite: {currentExpense.category.maxAmount}€
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                        {currentExpense.ocrData && (
                          <span className="text-green-600 text-xs ml-2">
                            (Auto-rempli)
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={currentExpense.description || ''}
                        onChange={(e) => setCurrentExpense({ ...currentExpense, description: e.target.value })}
                        className={`form-input ${errors.description ? 'border-red-500' : ''} ${
                          currentExpense.ocrData ? 'bg-green-50 border-green-300' : ''
                        }`}
                        placeholder="Ex: Train Paris A/R"
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date *
                          {currentExpense.ocrData && (
                            <span className="text-green-600 text-xs ml-2">
                              (Auto-rempli)
                            </span>
                          )}
                        </label>
                        <input
                          type="date"
                          value={currentExpense.date || ''}
                          onChange={(e) => setCurrentExpense({ ...currentExpense, date: e.target.value })}
                          className={`form-input ${errors.date ? 'border-red-500' : ''} ${
                            currentExpense.ocrData ? 'bg-green-50 border-green-300' : ''
                          }`}
                        />
                        {errors.date && (
                          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lieu
                        </label>
                        <input
                          type="text"
                          value={currentExpense.location || ''}
                          onChange={(e) => setCurrentExpense({ ...currentExpense, location: e.target.value })}
                          className="form-input"
                          placeholder="Ex: Paris"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowAddExpense(false);
                        setErrors({});
                        setCurrentExpense({
                          category: expenseCategories[0],
                          description: '',
                          amount: 0,
                          currency: 'EUR',
                          date: new Date().toISOString().split('T')[0],
                          location: ''
                        });
                      }}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleAddExpense}
                      className="btn-primary"
                      disabled={processingOCR}
                    >
                      {processingOCR ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        'Ajouter'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Résumé</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre de dépenses</span>
                <span className="font-medium">{expenses.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant total</span>
                <span className="text-lg font-bold text-gray-900">
                  {totalAmount.toLocaleString('fr-FR')}€
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center text-sm text-amber-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Justificatifs obligatoires
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Status */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Statut des justificatifs
            </h3>
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aucune dépense ajoutée
                </p>
              ) : (
                expenses.map((exp, index) => (
                  <div key={exp.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Dépense {index + 1}
                    </span>
                    <div className="flex items-center">
                      {exp.receipt ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Justificatif OK
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Manquant
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleSave('draft')}
                className="w-full btn-secondary"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder en brouillon
              </button>
              <button
                onClick={() => handleSave('submitted')}
                className="w-full btn-primary"
                disabled={expenses.length === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Soumettre pour validation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}