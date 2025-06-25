import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  DollarSign,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { invoices, suppliers } from '../data/mockData';
import { Invoice } from '../types';

interface InvoiceListProps {
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
}

export default function InvoiceList({ onViewInvoice, onEditInvoice }: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('receivedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredInvoices = invoices
    .filter(invoice => {
      if (searchTerm && !invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !invoice.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !invoice.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && invoice.status !== statusFilter) {
        return false;
      }
      if (supplierFilter !== 'all' && invoice.supplierId !== supplierFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'receivedDate':
          comparison = new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime();
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'amount':
          comparison = a.amountTTC - b.amountTTC;
          break;
        case 'supplier':
          comparison = a.supplierName.localeCompare(b.supplierName);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      received: { label: 'Reçue', class: 'bg-yellow-100 text-yellow-800' },
      validated: { label: 'Validée', class: 'bg-blue-100 text-blue-800' },
      approved: { label: 'Approuvée', class: 'status-approved' },
      paid: { label: 'Payée', class: 'status-paid' },
      rejected: { label: 'Rejetée', class: 'status-rejected' },
      disputed: { label: 'Litige', class: 'bg-red-100 text-red-800' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', class: 'bg-gray-100 text-gray-800' },
      scheduled: { label: 'Programmé', class: 'bg-blue-100 text-blue-800' },
      paid: { label: 'Payé', class: 'bg-green-100 text-green-800' },
      failed: { label: 'Échec', class: 'bg-red-100 text-red-800' },
      cancelled: { label: 'Annulé', class: 'bg-gray-100 text-gray-800' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const isOverdue = (invoice: Invoice) => {
    return new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amountTTC, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures fournisseurs</h1>
          <p className="text-gray-600 mt-1">
            {filteredInvoices.length} facture{filteredInvoices.length > 1 ? 's' : ''} • 
            Total: {totalAmount.toLocaleString('fr-FR')}€
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </button>
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="N°, fournisseur, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">Tous les statuts</option>
                <option value="received">Reçue</option>
                <option value="validated">Validée</option>
                <option value="approved">Approuvée</option>
                <option value="paid">Payée</option>
                <option value="rejected">Rejetée</option>
                <option value="disputed">Litige</option>
              </select>
            </div>

            {/* Supplier Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fournisseur
              </label>
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">Tous les fournisseurs</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input"
              >
                <option value="receivedDate">Date de réception</option>
                <option value="dueDate">Date d'échéance</option>
                <option value="amount">Montant</option>
                <option value="supplier">Fournisseur</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordre
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="form-input"
              >
                <option value="desc">Décroissant</option>
                <option value="asc">Croissant</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {filteredInvoices.filter(i => i.status === 'received').length}
          </div>
          <div className="text-sm text-gray-600">Reçues</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {filteredInvoices.filter(i => i.status === 'validated').length}
          </div>
          <div className="text-sm text-gray-600">Validées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {filteredInvoices.filter(i => i.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600">Approuvées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {filteredInvoices.filter(i => isOverdue(i)).length}
          </div>
          <div className="text-sm text-gray-600">En retard</div>
        </div>
      </div>

      {/* Invoice Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInvoices.map((invoice) => {
          const overdue = isOverdue(invoice);
          const daysUntilDue = getDaysUntilDue(invoice.dueDate);
          
          return (
            <div key={invoice.id} className={`card hover:shadow-md transition-shadow duration-200 ${
              overdue ? 'border-red-200 bg-red-50' : ''
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {invoice.number}
                    </h3>
                    {overdue && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {invoice.description}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {getStatusBadge(invoice.status)}
                  {getPaymentStatusBadge(invoice.paymentStatus)}
                </div>
              </div>

              <div className="space-y-3">
                {/* Supplier */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="w-4 h-4 mr-1" />
                    Fournisseur
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {invoice.supplierName}
                  </span>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Montant TTC
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {invoice.amountTTC.toLocaleString('fr-FR')}€
                  </span>
                </div>

                {/* Due Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Échéance
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      overdue ? 'text-red-600' : 
                      daysUntilDue <= 7 ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                    </span>
                    {!overdue && daysUntilDue >= 0 && (
                      <div className="text-xs text-gray-500">
                        Dans {daysUntilDue} jour{daysUntilDue > 1 ? 's' : ''}
                      </div>
                    )}
                    {overdue && (
                      <div className="text-xs text-red-600">
                        En retard de {Math.abs(daysUntilDue)} jour{Math.abs(daysUntilDue) > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Received Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Reçue le
                  </div>
                  <span className="text-sm text-gray-900">
                    {new Date(invoice.receivedDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {/* Documents */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="w-4 h-4 mr-1" />
                    Documents
                  </div>
                  <span className="text-sm text-gray-900">
                    {invoice.documents.length} fichier{invoice.documents.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewInvoice(invoice)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200"
                    title="Voir les détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {(invoice.status === 'received' || invoice.status === 'rejected') && (
                    <button
                      onClick={() => onEditInvoice(invoice)}
                      className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors duration-200"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {invoice.status === 'received' && (
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-200"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {invoice.validations.length > 0 && (
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {invoice.validations.length} validation{invoice.validations.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <FileText className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune facture trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' || supplierFilter !== 'all'
              ? 'Aucune facture ne correspond à vos critères de recherche.'
              : 'Aucune facture n\'a été reçue pour le moment.'
            }
          </p>
        </div>
      )}
    </div>
  );
}