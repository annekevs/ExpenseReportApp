import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  PieChart as PieChartIcon,
  Users,
  DollarSign,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function Reports() {
  const [dateRange, setDateRange] = useState('6months');
  const [reportType, setReportType] = useState('overview');

  // Mock data for different chart types
  const monthlyData = [
    { month: 'Juil', amount: 2400, expenses: 45, avgTime: 2.1 },
    { month: 'Août', amount: 2851, expenses: 52, avgTime: 2.3 },
    { month: 'Sept', amount: 2200, expenses: 38, avgTime: 1.9 },
    { month: 'Oct', amount: 2780, expenses: 49, avgTime: 2.0 },
    { month: 'Nov', amount: 3100, expenses: 56, avgTime: 2.4 },
    { month: 'Déc', amount: 2900, expenses: 51, avgTime: 2.2 }
  ];

  const categoryData = [
    { name: 'Transport', value: 4500, percentage: 35 },
    { name: 'Hébergement', value: 3200, percentage: 25 },
    { name: 'Repas', value: 2800, percentage: 22 },
    { name: 'Fournitures', value: 1500, percentage: 12 },
    { name: 'Communication', value: 800, percentage: 6 }
  ];

  const departmentData = [
    { department: 'Marketing', amount: 5200, count: 45 },
    { department: 'Commercial', amount: 4800, count: 38 },
    { department: 'RH', amount: 2100, count: 15 },
    { department: 'IT', amount: 3600, count: 25 },
    { department: 'Finance', amount: 1800, count: 12 }
  ];

  const processingTimeData = [
    { month: 'Juil', avgTime: 2.1, target: 2.0 },
    { month: 'Août', avgTime: 2.3, target: 2.0 },
    { month: 'Sept', avgTime: 1.9, target: 2.0 },
    { month: 'Oct', avgTime: 2.0, target: 2.0 },
    { month: 'Nov', avgTime: 2.4, target: 2.0 },
    { month: 'Déc', avgTime: 2.2, target: 2.0 }
  ];

  const StatCard = ({ title, value, subtitle, change, changeType, icon: Icon }: any) => (
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
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {change}
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
          <h1 className="text-2xl font-bold text-gray-900">Rapports et analyses</h1>
          <p className="text-gray-600 mt-1">Analyse des dépenses et indicateurs de performance</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="form-input"
          >
            <option value="1month">1 mois</option>
            <option value="3months">3 mois</option>
            <option value="6months">6 mois</option>
            <option value="1year">1 an</option>
          </select>
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'categories', label: 'Par catégorie', icon: PieChartIcon },
            { id: 'departments', label: 'Par département', icon: Users },
            { id: 'performance', label: 'Performance', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                reportType === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {reportType === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total des dépenses"
              value="15 250€"
              subtitle="6 derniers mois"
              change="+12%"
              changeType="positive"
              icon={DollarSign}
            />
            <StatCard
              title="Nombre de notes"
              value="291"
              subtitle="Notes traitées"
              change="+8%"
              changeType="positive"
              icon={FileText}
            />
            <StatCard
              title="Temps de traitement"
              value="2.2j"
              subtitle="Délai moyen"
              change="-15%"
              changeType="positive"
              icon={Calendar}
            />
            <StatCard
              title="Taux d'approbation"
              value="94%"
              subtitle="Notes approuvées"
              change="+2%"
              changeType="positive"
              icon={TrendingUp}
            />
          </div>

          {/* Monthly Trend */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Évolution mensuelle</h3>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% vs période précédente
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'amount' ? `${value}€` : value,
                      name === 'amount' ? 'Montant' : 'Nombre de notes'
                    ]}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                  <Bar dataKey="expenses" fill="#10B981" yAxisId="right" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {reportType === 'categories' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Répartition par catégorie
              </h3>
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
                    <Tooltip formatter={(value) => [`${value}€`, 'Montant']} />
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
                    <span className="text-gray-600">{item.name} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Details */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Détail par catégorie
              </h3>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.percentage}% du total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{category.value.toLocaleString('fr-FR')}€</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {reportType === 'departments' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Dépenses par département
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="department" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value}€`, 'Montant']} />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentData.map((dept) => (
              <div key={dept.department} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{dept.department}</h4>
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Montant total</span>
                    <span className="font-medium">{dept.amount.toLocaleString('fr-FR')}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Nombre de notes</span>
                    <span className="font-medium">{dept.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Moyenne par note</span>
                    <span className="font-medium">
                      {Math.round(dept.amount / dept.count).toLocaleString('fr-FR')}€
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {reportType === 'performance' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Temps de traitement moyen
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processingTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Jours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}j`, 'Temps de traitement']} />
                  <Line 
                    type="monotone" 
                    dataKey="avgTime" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Temps réel"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Objectif"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Temps réel</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 border-2 border-red-500 border-dashed rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Objectif (2j)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">94%</div>
              <div className="text-sm text-gray-600">Taux d'approbation</div>
              <div className="text-xs text-green-600 mt-1">+2% vs mois dernier</div>
            </div>

            <div className="card text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2.2j</div>
              <div className="text-sm text-gray-600">Délai moyen</div>
              <div className="text-xs text-red-600 mt-1">+0.2j vs objectif</div>
            </div>

            <div className="card text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">291</div>
              <div className="text-sm text-gray-600">Notes traitées</div>
              <div className="text-xs text-green-600 mt-1">+8% vs période précédente</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}