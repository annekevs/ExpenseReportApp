import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InvoiceList from './components/InvoiceList';
import { Invoice } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedInvoice(null);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentPage('invoice-detail');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentPage('edit-invoice');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return (
          <InvoiceList
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
          />
        );
      case 'upload':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Déposer une facture
            </h2>
            <p className="text-gray-600">
              Module de dépôt de factures en cours de développement
            </p>
          </div>
        );
      case 'validation':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Validation des factures
            </h2>
            <p className="text-gray-600">
              Module de validation en cours de développement
            </p>
          </div>
        );
      case 'payments':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Gestion des paiements
            </h2>
            <p className="text-gray-600">
              Module de paiements en cours de développement
            </p>
          </div>
        );
      case 'suppliers':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Gestion des fournisseurs
            </h2>
            <p className="text-gray-600">
              Module de gestion des fournisseurs en cours de développement
            </p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Rapports et analyses
            </h2>
            <p className="text-gray-600">
              Module de reporting en cours de développement
            </p>
          </div>
        );
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
      case 'profile':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mon profil
            </h2>
            <p className="text-gray-600">
              Gestion du profil utilisateur en cours de développement
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