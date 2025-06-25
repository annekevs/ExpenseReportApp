import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  Calendar,
  DollarSign
} from 'lucide-react';
import { mockExpenseReports, expenseCategories } from '../data/mockData';
import { ExpenseReport } from '../types';

interface ExpenseListProps {
  onViewExpense: (expense: ExpenseReport) => void;
  onCreateExpense: () => void;
  onEditExpense: (expense: ExpenseReport) => void;
}

export default function ExpenseList({ onViewExpense, onCreateExpense, onEditExpense }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredExpenses = mockExpenseReports
    .filter(expense => {
      if (searchTerm && !expense.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !expense.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && expense.status !== statusFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: 'Brouillon', class: 'bg-gray-100 text-gray-800' },
      submitted: { label: 'En attente', class: 'status-pending' },
      approved: { label: 'Approuvé', class: 'status-approved' },
      rejected: { label: 'Rejeté', class: 'status-rejected' },
      paid: { label: 'Payé', class: 'status-paid' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const canEdit = (expense: ExpenseReport) => {
    return expense.status === 'draft' || expense.status === 'rejected';
  };

  const canDelete = (expense: ExpenseReport) => {
    return expense.status === 'draft' || expense.status === 'rejected';
  };

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes de frais</h1>
          <p className="text-gray-600 mt-1">
            {filteredExpenses.length} note{filteredExpenses.length > 1 ? 's' : ''} • 
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
          <button
            onClick={onCreateExpense}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle note
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Titre, description..."
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
                <option value="draft">Brouillon</option>
                <option value="submitted">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
                <option value="paid">Payé</option>
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
                <option value="date">Date</option>
                <option value="amount">Montant</option>
                <option value="title">Titre</option>
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

      {/* Expense Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExpenses.map((expense) => (
          <div key={expense.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {expense.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {expense.description}
                </p>
              </div>
              {getStatusBadge(expense.status)}
            </div>

            <div className="space-y-3">
              {/* Amount */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Montant total
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {expense.totalAmount.toLocaleString('fr-FR')}€
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Créé le
                </div>
                <span className="text-sm text-gray-900">
                  {new Date(expense.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              {/* Expenses count */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {expense.expenses.length} dépense{expense.expenses.length > 1 ? 's' : ''}
                </span>
                <div className="flex -space-x-1">
                  {expense.expenses.slice(0, 3).map((exp, index) => {
                    const category = expenseCategories.find(cat => cat.id === exp.category.id);
                    return (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${category?.color || 'bg-gray-500'}`}
                        title={category?.name}
                      >
                        <span className="text-xs text-white font-medium">
                          {category?.name.charAt(0) || 'X'}
                        </span>
                      </div>
                    );
                  })}
                  {expense.expenses.length > 3 && (
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        +{expense.expenses.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewExpense(expense)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200"
                  title="Voir les détails"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {canEdit(expense) && (
                  <button
                    onClick={() => onEditExpense(expense)}
                    className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors duration-200"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {canDelete(expense) && (
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-200"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {expense.status === 'submitted' && (
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                  En cours de traitement
                </span>
              )}
              
              {expense.approvedAt && (
                <span className="text-xs text-gray-500">
                  Approuvé le {new Date(expense.approvedAt).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune note de frais trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Aucune note ne correspond à vos critères de recherche.'
              : 'Commencez par créer votre première note de frais.'
            }
          </p>
          <button
            onClick={onCreateExpense}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une note de frais
          </button>
        </div>
      )}
    </div>
  );
}