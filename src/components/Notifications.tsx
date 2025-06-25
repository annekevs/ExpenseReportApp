import React, { useState } from 'react';
import {
  Bell,
  Check,
  Trash2,
  Filter,
  Search,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  Sparkles,
  Clock,
  MoreVertical
} from 'lucide-react';
import { notifications } from '../data/mockData';
import { NotificationItem } from '../types';

export default function Notifications() {
  const [notificationList, setNotificationList] = useState<NotificationItem[]>(notifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifications = notificationList.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotificationList(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotificationList(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval_request':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'expense_approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expense_rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'payment_processed':
        return <DollarSign className="w-5 h-5 text-blue-600" />;
      case 'ocr_completed':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    const typeMap = {
      approval_request: 'Demande d\'approbation',
      expense_approved: 'Note approuvée',
      expense_rejected: 'Note rejetée',
      payment_processed: 'Paiement traité',
      ocr_completed: 'Extraction OCR'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return time.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn-secondary"
            >
              <Check className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Titre, message..."
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
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
              className="form-input"
            >
              <option value="all">Toutes</option>
              <option value="unread">Non lues</option>
              <option value="read">Lues</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">Tous les types</option>
              <option value="approval_request">Demandes d'approbation</option>
              <option value="expense_approved">Notes approuvées</option>
              <option value="expense_rejected">Notes rejetées</option>
              <option value="payment_processed">Paiements</option>
              <option value="ocr_completed">Extraction OCR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="card text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune notification
            </h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' || typeFilter !== 'all'
                ? 'Aucune notification ne correspond à vos critères.'
                : 'Vous n\'avez aucune notification pour le moment.'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`card hover:shadow-md transition-all duration-200 cursor-pointer ${
                !notification.read ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm ${
                        !notification.read ? 'text-gray-700' : 'text-gray-500'
                      } mb-2`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          {getNotificationTypeLabel(notification.type)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          title="Marquer comme lu"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {filteredNotifications.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {notificationList.length}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {unreadCount}
              </div>
              <div className="text-sm text-gray-500">Non lues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {notificationList.filter(n => n.type === 'expense_approved').length}
              </div>
              <div className="text-sm text-gray-500">Approuvées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {notificationList.filter(n => n.type === 'ocr_completed').length}
              </div>
              <div className="text-sm text-gray-500">OCR</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}