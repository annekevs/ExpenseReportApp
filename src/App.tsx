import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import ExpenseDetail from './components/ExpenseDetail';
import Reports from './components/Reports';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import ApprovalQueue from './components/ApprovalQueue';
import { ExpenseReport } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedExpense, setSelectedExpense] = useState<ExpenseReport | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedExpense(null);
  };

  const handleViewExpense = (expense: ExpenseReport) => {
    setSelectedExpense(expense);
    setCurrentPage('expense-detail');
  };

  const handleCreateExpense = () => {
    setSelectedExpense(null);
    setCurrentPage('create-expense');
  };

  const handleEditExpense = (expense: ExpenseReport) => {
    setSelectedExpense(expense);
    setCurrentPage('edit-expense');
  };

  const handleBackToExpenses = () => {
    setCurrentPage('expenses');
    setSelectedExpense(null);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return (
          <ExpenseList
            onViewExpense={handleViewExpense}
            onCreateExpense={handleCreateExpense}
            onEditExpense={handleEditExpense}
          />
        );
      case 'create-expense':
        return (
          <ExpenseForm
            onBack={handleBackToExpenses}
          />
        );
      case 'edit-expense':
        return selectedExpense ? (
          <ExpenseForm
            expense={selectedExpense}
            isEditing={true}
            onBack={handleBackToExpenses}
          />
        ) : (
          <ExpenseList
            onViewExpense={handleViewExpense}
            onCreateExpense={handleCreateExpense}
            onEditExpense={handleEditExpense}
          />
        );
      case 'expense-detail':
        return selectedExpense ? (
          <ExpenseDetail
            expense={selectedExpense}
            onBack={handleBackToExpenses}
            onEdit={() => handleEditExpense(selectedExpense)}
          />
        ) : (
          <ExpenseList
            onViewExpense={handleViewExpense}
            onCreateExpense={handleCreateExpense}
            onEditExpense={handleEditExpense}
          />
        );
      case 'reports':
        return <Reports />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      case 'approval-queue':
        return <ApprovalQueue onViewExpense={handleViewExpense} />;
      case 'users':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Gestion des utilisateurs
            </h2>
            <p className="text-gray-600">
              Module de gestion des utilisateurs en cours de développement
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Paramètres
            </h2>
            <p className="text-gray-600">
              Configuration de l'application en cours de développement
            </p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={handlePageChange}>
      {renderContent()}
    </Layout>
  );
}

export default App;