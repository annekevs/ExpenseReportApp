import React, { useState } from 'react';
import {
  User,
  Mail,
  Building,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  CreditCard,
  Bell,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { currentUser } from '../data/mockData';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, 75001 Paris',
    department: currentUser.department,
    position: 'Chef de projet Marketing',
    manager: 'Pierre Martin',
    startDate: '2022-03-15',
    employeeId: 'EMP001234'
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    currency: 'EUR',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    autoApproval: false,
    receiptReminder: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    alert('Profil mis à jour avec succès !');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    console.log('Changing password');
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Mot de passe modifié avec succès !');
  };

  const getRoleLabel = (role: string) => {
    const roleMap = {
      employee: 'Employé',
      manager: 'Manager',
      finance: 'Finance'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-gray-600 mt-1">Gérez vos informations personnelles et préférences</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="relative inline-block mb-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{currentUser.name}</h3>
            <p className="text-gray-600 mb-2">{formData.position}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Shield className="w-4 h-4 mr-1" />
              {getRoleLabel(currentUser.role)}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">ID Employé</span>
                  <span className="font-medium">{formData.employeeId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Date d'embauche</span>
                  <span className="font-medium">
                    {new Date(formData.startDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Manager</span>
                  <span className="font-medium">{formData.manager}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {formData.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {formData.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {formData.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département
                </label>
                {isEditing ? (
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="form-input"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Commercial">Commercial</option>
                    <option value="RH">Ressources Humaines</option>
                    <option value="IT">Informatique</option>
                    <option value="Finance">Finance</option>
                  </select>
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    {formData.department}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="form-input"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {formData.address}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sécurité
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Mot de passe</h4>
                    <p className="text-sm text-gray-500">Dernière modification il y a 3 mois</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="btn-secondary"
                >
                  Modifier
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
                    <p className="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
                  </div>
                </div>
                <button className="btn-secondary">
                  Activer
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Préférences
            </h3>
            <div className="space-y-6">
              {/* Language & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="form-input"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Devise par défaut
                  </label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                    className="form-input"
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar US ($)</option>
                    <option value="GBP">Livre Sterling (£)</option>
                  </select>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">Notifications par email</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.email}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, email: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">Notifications push</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.push}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, push: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">Rappel de justificatifs</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.receiptReminder}
                        onChange={(e) => setPreferences({ ...preferences, receiptReminder: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Modifier le mot de passe
                </h3>
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="form-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPasswordForm(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="btn-primary"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}