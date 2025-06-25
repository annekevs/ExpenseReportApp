import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  Calendar,
  DollarSign,
  User,
  Building,
  FileText,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { mockExpenseReports, currentUser } from "../data/mockData";
import { ExpenseReport } from "../types";

interface ApprovalQueueProps {
  onViewExpense: (expense: ExpenseReport) => void;
}

export default function ApprovalQueue({ onViewExpense }: ApprovalQueueProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "urgent">("pending");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);

  // Mock data pour les notes en attente selon le rôle
  const getPendingExpenses = () => {
    if (currentUser.role === "manager") {
      // Manager voit les notes de son équipe
      return mockExpenseReports.filter(
        (expense) =>
          expense.status === "submitted" && expense.userId !== currentUser.id
      );
    } else if (currentUser.role === "finance") {
      // Finance voit toutes les notes approuvées par les managers
      return mockExpenseReports.filter(
        (expense) =>
          expense.status === "approved" || expense.status === "submitted"
      );
    }
    return [];
  };

  const pendingExpenses = getPendingExpenses();

  const filteredExpenses = pendingExpenses.filter((expense) => {
    if (filter === "pending" && expense.status !== "submitted") return false;
    if (filter === "urgent") {
      const daysSinceSubmission = Math.floor(
        (new Date().getTime() -
          new Date(expense.submittedAt || expense.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysSinceSubmission < 3) return false;
    }
    if (
      departmentFilter !== "all" &&
      !expense.userName.includes(departmentFilter)
    )
      return false;
    if (
      searchTerm &&
      !expense.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !expense.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const handleApprove = (expenseId: string, comment?: string) => {
    console.log("Approving expense:", expenseId, comment);
    alert("Note de frais approuvée avec succès !");
  };

  const handleReject = (expenseId: string, comment: string) => {
    console.log("Rejecting expense:", expenseId, comment);
    alert("Note de frais rejetée.");
  };

  const handleBulkApprove = () => {
    console.log("Bulk approving expenses:", selectedExpenses);
    alert(`${selectedExpenses.length} note(s) de frais approuvée(s) !`);
    setSelectedExpenses([]);
  };

  const getDaysAgo = (date: string) => {
    const daysDiff = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff;
  };

  const getUrgencyLevel = (expense: ExpenseReport) => {
    const daysAgo = getDaysAgo(expense.submittedAt || expense.createdAt);
    if (daysAgo >= 5) return "high";
    if (daysAgo >= 3) return "medium";
    return "low";
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getWorkflowStep = () => {
    if (currentUser.role === "manager") {
      return {
        title: "Validation managériale",
        description: "Vérification de la légitimité et conformité des dépenses",
        step: 2,
        totalSteps: 4,
      };
    } else if (currentUser.role === "finance") {
      return {
        title: "Contrôle comptable/financier",
        description: "Contrôle fiscal et intégration comptable",
        step: 3,
        totalSteps: 4,
      };
    }
    return null;
  };

  const workflowInfo = getWorkflowStep();

  if (currentUser.role === "employee") {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-orange-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Accès non autorisé
        </h2>
        <p className="text-gray-600">
          Cette section est réservée aux managers et au service finance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            File d'attente de validation
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredExpenses.length} note
            {filteredExpenses.length > 1 ? "s" : ""} en attente de validation
          </p>
        </div>
        {selectedExpenses.length > 0 && (
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {selectedExpenses.length} sélectionnée
              {selectedExpenses.length > 1 ? "s" : ""}
            </span>
            <button onClick={handleBulkApprove} className="btn-primary">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approuver la sélection
            </button>
          </div>
        )}
      </div>

      {/* Workflow Info */}
      {workflowInfo && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-1">
                {workflowInfo.title}
              </h3>
              <p className="text-blue-700 text-sm">
                {workflowInfo.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {workflowInfo.step}/{workflowInfo.totalSteps}
              </div>
              <div className="text-sm text-blue-600">Étape du workflow</div>
            </div>
          </div>
        </div>
      )}

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
                placeholder="Titre, employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "pending" | "urgent")
              }
              className="form-input"
            >
              <option value="all">Toutes</option>
              <option value="pending">En attente</option>
              <option value="urgent">Urgentes ({">"}3 jours)</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Département
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">Tous les départements</option>
              <option value="Marketing">Marketing</option>
              <option value="Commercial">Commercial</option>
              <option value="RH">RH</option>
              <option value="IT">IT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {pendingExpenses.length}
          </div>
          <div className="text-sm text-gray-600">Total en attente</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {
              pendingExpenses.filter(
                (e) => getDaysAgo(e.submittedAt || e.createdAt) >= 3
              ).length
            }
          </div>
          <div className="text-sm text-gray-600">Urgentes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {pendingExpenses
              .reduce((sum, e) => sum + e.totalAmount, 0)
              .toLocaleString("fr-FR")}
            €
          </div>
          <div className="text-sm text-gray-600">Montant total</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">2.1j</div>
          <div className="text-sm text-gray-600">Délai moyen</div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune note en attente
            </h3>
            <p className="text-gray-500">
              {searchTerm || filter !== "pending" || departmentFilter !== "all"
                ? "Aucune note ne correspond à vos critères."
                : "Toutes les notes ont été traitées."}
            </p>
          </div>
        ) : (
          filteredExpenses.map((expense) => {
            const urgencyLevel = getUrgencyLevel(expense);
            const daysAgo = getDaysAgo(
              expense.submittedAt || expense.createdAt
            );

            return (
              <div
                key={expense.id}
                className="card hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={selectedExpenses.includes(expense.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedExpenses([
                            ...selectedExpenses,
                            expense.id,
                          ]);
                        } else {
                          setSelectedExpenses(
                            selectedExpenses.filter((id) => id !== expense.id)
                          );
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {expense.title}
                          </h3>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                              urgencyLevel
                            )}`}
                          >
                            {urgencyLevel === "high"
                              ? "Urgent"
                              : urgencyLevel === "medium"
                              ? "Prioritaire"
                              : "Normal"}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {expense.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {expense.userName}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Soumis il y a {daysAgo} jour{daysAgo > 1 ? "s" : ""}
                          </div>
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {expense.expenses.length} dépense
                            {expense.expenses.length > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 mb-1">
                          {expense.totalAmount.toLocaleString("fr-FR")}€
                        </div>
                        <div className="text-sm text-gray-500">
                          Montant total
                        </div>
                      </div>
                    </div>

                    {/* Expense Summary */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Détail des dépenses
                      </h4>
                      <div className="space-y-1">
                        {expense.expenses.slice(0, 3).map((exp, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {exp.category.name} - {exp.description}
                            </span>
                            <span className="font-medium">
                              {exp.amount.toLocaleString("fr-FR")}€
                            </span>
                          </div>
                        ))}
                        {expense.expenses.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{expense.expenses.length - 3} autre
                            {expense.expenses.length - 3 > 1 ? "s" : ""} dépense
                            {expense.expenses.length - 3 > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onViewExpense(expense)}
                        className="btn-secondary"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir les détails
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const comment = prompt(
                              "Commentaire de rejet (optionnel):"
                            );
                            if (comment !== null) {
                              handleReject(expense.id, comment || "");
                            }
                          }}
                          className="btn-secondary text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeter
                        </button>
                        <button
                          onClick={() => {
                            const comment = prompt(
                              "Commentaire d'approbation (optionnel):"
                            );
                            handleApprove(expense.id, comment || undefined);
                          }}
                          className="btn-primary"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approuver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Workflow Steps Info */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Processus de validation
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              1
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Saisie & dépôt</h4>
              <p className="text-sm text-gray-500">
                Salarié - Saisie, justification et soumission
              </p>
            </div>
          </div>

          <div
            className={`flex items-center space-x-4 ${
              currentUser.role === "manager" ? "bg-blue-50 p-3 rounded-lg" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                currentUser.role === "manager" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              2
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Validation managériale
              </h4>
              <p className="text-sm text-gray-500">
                Manager (N+1) - Vérification de la légitimité et conformité
              </p>
            </div>
          </div>

          <div
            className={`flex items-center space-x-4 ${
              currentUser.role === "finance" ? "bg-blue-50 p-3 rounded-lg" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                currentUser.role === "finance" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              3
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Contrôle comptable/financier
              </h4>
              <p className="text-sm text-gray-500">
                Service comptable - Contrôle fiscal, intégration comptable
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
              4
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Paiement & archivage
              </h4>
              <p className="text-sm text-gray-500">
                Service comptable/finance - Remboursement, archivage légal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
