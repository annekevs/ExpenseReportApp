import React from 'react';
import {
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { dashboardStats, budgets, mockExpenseReports } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function Dashboard() {
  const recentExpenses = mockExpenseReports.slice(0, 5);
  
  const monthlyData = [
    { month: 'Jan', amount: 2400 },
    { month: 'Fév', amount: 2851 },
    { month: 'Mar', amount: 2200 },
    { month: 'Avr', amount: 2780 },
    { month: 'Mai', amount: 3100 },
    { month: 'Jun', amount: 2900 }
  ];

  const categoryData = budgets.map(budget => ({
    name: budget.category,
    value: budget.spent,
    percentage: (budget.spent / budget.allocated) * 100
  }));

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }: any) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
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
          <p className="text-gray-600 mt-1">Vue d'ensemble de vos notes de frais</p>
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
          title="Total des frais"
          value={`${dashboardStats.totalExpenses.toLocaleString('fr-FR')}€`}
          subtitle="Ce mois-ci"
          icon={DollarSign}
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="En attente"
          value={dashboardStats.pendingApprovals}
          subtitle="Notes à approuver"
          icon={Clock}
          trend="down"
          trendValue="-5%"
        />
        <StatCard
          title="Dépenses mensuelles"
          value={`${dashboardStats.monthlySpent.toLocaleString('fr-FR')}€`}
          subtitle="Budget alloué"
          icon={TrendingUp}
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Temps de traitement"
          value={`${dashboardStats.averageProcessingTime}j`}
          subtitle="Délai moyen"
          icon={FileText}
          trend="down"
          trendValue="-15%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expenses Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Évolution mensuelle</h3>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12% vs mois dernier
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}€`, 'Montant']} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Répartition par catégorie</h3>
            <div className="text-sm text-gray-500">
              Utilisation: {dashboardStats.budgetUtilization}%
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}€`, 'Dépensé']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center text-sm">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Suivi budgétaire</h3>
          <button className="text-sm text-blue-600 hover:text-blue-500">
            Voir détails
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {budgets.map((budget) => {
            const utilizationPercentage = (budget.spent / budget.allocated) * 100;
            const isOverBudget = utilizationPercentage > 100;
            const isNearLimit = utilizationPercentage > 80;

            return (
              <div key={budget.category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{budget.category}</h4>
                  {isOverBudget ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dépensé</span>
                    <span className="font-medium">{budget.spent}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium">{budget.allocated}€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isOverBudget ? 'bg-red-500' : 
                        isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={`${
                      isOverBudget ? 'text-red-600' : 
                      isNearLimit ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {utilizationPercentage.toFixed(1)}% utilisé
                    </span>
                    <span className="text-gray-500">
                      {budget.remaining < 0 ? 'Dépassé' : `${budget.remaining}€ restant`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Notes récentes</h3>
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
                    Note de frais
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {expense.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {expense.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {expense.totalAmount.toLocaleString('fr-FR')}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-badge ${
                        expense.status === 'submitted' ? 'status-pending' :
                        expense.status === 'approved' ? 'status-approved' :
                        expense.status === 'rejected' ? 'status-rejected' :
                        'status-paid'
                      }`}>
                        {expense.status === 'submitted' ? 'En attente' :
                         expense.status === 'approved' ? 'Approuvé' :
                         expense.status === 'rejected' ? 'Rejeté' :
                         'Payé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.createdAt).toLocaleDateString('fr-FR')}
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