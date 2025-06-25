import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  FileText,
  PlusCircle,
  BarChart3,
  Users,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  CheckCircle,
  User as UserIcon,
} from "lucide-react";
import { currentUser, notifications } from "../data/mockData";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Tableau de bord", icon: Home },
  { id: "expenses", label: "Notes de frais", icon: FileText },
  { id: "create-expense", label: "Nouvelle note", icon: PlusCircle },
  {
    id: "approval-queue",
    label: "File de validation",
    icon: CheckCircle,
    roles: ["manager", "finance"],
  },
  { id: "reports", label: "Rapports", icon: BarChart3 },
  {
    id: "users",
    label: "Utilisateurs",
    icon: Users,
    roles: ["manager", "finance"],
  },
  {
    id: "settings",
    label: "Paramètres",
    icon: Settings,
    roles: ["manager", "finance"],
  },
];

export default function Layout({
  children,
  currentPage,
  onPageChange,
}: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(currentUser.role)
  );

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                  ExpenseFlow
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {filteredMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                >
                  <Bell className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Notifications
                        </h3>
                        <button
                          onClick={() => handlePageChange("notifications")}
                          className="text-sm text-blue-600 hover:text-blue-500"
                        >
                          Voir tout
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                notification.timestamp
                              ).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <span className="ml-2 text-gray-700 hidden sm:block">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser.email}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        {currentUser.role === "employee"
                          ? "Employé"
                          : currentUser.role === "manager"
                          ? "Manager"
                          : "Finance"}
                      </span>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => handlePageChange("profile")}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <UserIcon className="w-4 h-4 mr-2" />
                        Mon profil
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {filteredMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`block w-full text-left pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Click outside to close menus */}
      {(isUserMenuOpen || isNotificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsNotificationsOpen(false);
          }}
        />
      )}
    </div>
  );
}
