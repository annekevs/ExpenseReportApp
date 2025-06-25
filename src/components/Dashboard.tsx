import React from 'react';
import {
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Users,
  CreditCard,
  Building
} from 'lucide-react';
import { dashboardStats, invoices, suppliers } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function Dashboard() {
  const recentInvoices = invoices.slice(0, 5);
  
  const monthlyData = [
    { month: 'Août', amount: 45200, count: 38 },
    { month: 'Sept', amount: 52800, count: 42 },
    { month: 'Oct', amount: 48600, count: 39 },
    { month: 'Nov', amount: 61200, count: 48 },
    { month: 'Déc', amount: 58900, count: 45 },
    { month: 'Jan', amount: 67400, count: 52 }
  ];

  const statusData = [
    { name: 'Reçues', value: 15, color: '#F59E0B' },
    { name: 'Validées', value: 28, color: '#3B82F6' },
    { name: 'Approuvées', value: 35, color: '#10B981' },
    { name: 'Payées', value: 78, color: '#06B6D4' }
  ];

  const processingTimeData = [
    { month: 'Août', time: 3.8 },
    { month: 'Sept', time: 3.2 },
    { month: 'Oct', time: 2.9 },
    { month: 'Nov', time: 3.1 },
    { month: 'Déc', time: 2.8 },
    { month: 'Jan', time: 3.2 }
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "blue" }: any) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end">
          <div className={`p-3 bg-${color}-50 rounded-lg`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de la gestion des factures fournisseurs</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total factures"
          value={dashboardStats.totalInvoices}
          subtitle="Ce mois-ci"
          icon={FileText}
          trend="up"
          trendValue="+15%"
          color="blue"
        />
        <StatCard
          title="En attente validation"
          value={dashboardStats.pendingValidation}
          subtitle="À traiter"
          icon={Clock}
          trend="down"
          trendValue="-8%"
          color="orange"
        />
        <StatCard
          title="Montant total"
          value={`${dashboardStats.totalAmount.toLocaleString('fr-FR')}€`}
          subtitle="Ce mois-ci"
          icon={DollarSign}
          trend="up"
          trendValue="+22%"
          color="green"
        />
        <StatCard
          title="En retard"
          value={dashboardStats.overdueInvoices}
          subtitle="Échéances dépassées"
          icon={AlertTriangle}
          trend="down"
          trendValue="-2"
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Validation en attente</h3>
              <p className="text-blue-100 mt-1">{dashboardStats.pendingValidation} factures à valider</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-200" />
          </div>
          <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            Voir les factures
          </button>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Paiements programmés</h3>
              <p className="text-green-100 mt-1">{dashboardStats.pendingPayment} paiements à effectuer</p>
            </div>
            <CreditCard className="h-8 w-8 text-green-200" />
          </div>
          <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            Gérer les paiements
          </button>
        </div>

        <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Fournisseurs actifs</h3>
              <p className="text-purple-100 mt-1">{dashboardStats.supplierCount} fournisseurs</p>
            </div>
            <Building className="h-8 w-8 text-purple-200" />
          </div>
          <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            Gérer les fournisseurs
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Volume Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Volume mensuel</h3>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +22% vs mois dernier
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'amount' ? `${value.toLocaleString('fr-FR')}€` : value,
                    name === 'amount' ? 'Montant' : 'Nombre'
                  ]}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Répartition par statut</h3>
            <div className="text-sm text-gray-500">
              Total: {statusData.reduce((sum, item) => sum + item.value, 0)} factures
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Factures']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {statusData.map((item, index) => (
              <div key={item.name} className="flex items-center text-sm">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Processing Time Trend */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Temps de traitement moyen</h3>
          <div className="text-sm text-gray-500">
            Objectif: 3 jours
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processingTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Jours', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}j`, 'Temps de traitement']} />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Factures récentes</h3>
          <button className="text-sm text-blue-600 hover:text-blue-500">
            Voir toutes
          </button>
        </div>
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fournisseur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Échéance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.supplierName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {invoice.amountTTC.toLocaleString('fr-FR')}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-badge ${
                        invoice.status === 'received' ? 'status-pending' :
                        invoice.status === 'validated' ? 'bg-blue-100 text-blue-800' :
                        invoice.status === 'approved' ? 'status-approved' :
                        invoice.status === 'paid' ? 'status-paid' :
                        'status-rejected'
                      }`}>
                        {invoice.status === 'received' ? 'Reçue' :
                         invoice.status === 'validated' ? 'Validée' :
                         invoice.status === 'approved' ? 'Approuvée' :
                         invoice.status === 'paid' ? 'Payée' :
                         'Rejetée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}