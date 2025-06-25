import React, { useState } from "react";
import {
  ArrowLeft,
  Download,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  MapPin,
  User,
  FileText,
  Send,
  Eye,
  Paperclip,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Edit,
  X,
} from "lucide-react";
import { ExpenseReport } from "../types";

interface ExpenseDetailProps {
  expense: ExpenseReport;
  onBack: () => void;
  onEdit?: () => void;
}

export default function ExpenseDetail({
  expense,
  onBack,
  onEdit,
}: ExpenseDetailProps) {
  const [newComment, setNewComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "paid":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      draft: "Brouillon",
      submitted: "En attente de validation",
      approved: "Approuvé",
      rejected: "Rejeté",
      paid: "Payé",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const icons = {
      Car: <div className="w-5 h-5 bg-current rounded"></div>,
      Building2: <div className="w-5 h-5 bg-current rounded"></div>,
      UtensilsCrossed: <div className="w-5 h-5 bg-current rounded"></div>,
      Package: <div className="w-5 h-5 bg-current rounded"></div>,
      MapPin: <div className="w-5 h-5 bg-current rounded"></div>,
      Phone: <div className="w-5 h-5 bg-current rounded"></div>,
    };
    return (
      icons[iconName as keyof typeof icons] || (
        <div className="w-5 h-5 bg-current rounded"></div>
      )
    );
  };

  const getOCRStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    console.log("Adding comment:", newComment);
    setNewComment("");
    setShowCommentForm(false);
  };

  const canEdit = () => {
    return expense.status === "draft" || expense.status === "rejected";
  };

  const timeline = [
    {
      date: expense.createdAt,
      title: "Note créée",
      description: `Par ${expense.userName}`,
      icon: <FileText className="w-4 h-4" />,
      color: "bg-gray-500",
      comment: null,
    },
    ...(expense.submittedAt
      ? [
          {
            date: expense.submittedAt,
            title: "Soumise pour validation",
            description: `Par ${expense.userName}`,
            icon: <Send className="w-4 h-4" />,
            color: "bg-blue-500",
          },
        ]
      : []),
    ...expense.approvals.map((approval) => ({
      date: approval.timestamp,
      title: approval.action === "approved" ? "Approuvée" : "Rejetée",
      description: `Par ${approval.userName} (${approval.role})`,
      icon:
        approval.action === "approved" ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <XCircle className="w-4 h-4" />
        ),
      color: approval.action === "approved" ? "bg-green-500" : "bg-red-500",
      comment: approval.comment,
    })),
    ...(expense.paidAt
      ? [
          {
            date: expense.paidAt,
            title: "Remboursement effectué",
            description: "Traitement automatique",
            icon: <DollarSign className="w-4 h-4" />,
            color: "bg-blue-600",
          },
        ]
      : []),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {expense.title}
              </h1>
              <span
                className={`status-badge ${getStatusColor(expense.status)}`}
              >
                {getStatusText(expense.status)}
              </span>
            </div>
            <p className="text-gray-600">{expense.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {canEdit() && onEdit && (
            <button onClick={onEdit} className="btn-secondary">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </button>
          )}
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Exporter PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expense Details */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Détail des dépenses ({expense.expenses.length})
              </h3>
              <div className="text-xl font-bold text-gray-900">
                {expense.totalAmount.toLocaleString("fr-FR")}€
              </div>
            </div>

            <div className="space-y-4">
              {expense.expenses.map((exp, index) => (
                <div
                  key={exp.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-lg ${exp.category.color} text-white`}
                      >
                        {getCategoryIcon(exp.category.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {exp.category.name}
                            </h4>
                            {exp.ocrData && (
                              <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Auto-rempli
                              </div>
                            )}
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {exp.amount.toLocaleString("fr-FR")}€
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{exp.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(exp.date).toLocaleDateString("fr-FR")}
                          </div>
                          {exp.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {exp.location}
                            </div>
                          )}
                        </div>

                        {/* Receipt Section */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          {exp.receipt ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {getOCRStatusIcon(exp.receipt.ocrStatus)}
                                  <span className="text-sm text-gray-600">
                                    {exp.receipt.fileName}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    setSelectedReceipt(exp.receipt!.id)
                                  }
                                  className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                  <Eye className="w-4 h-4 inline mr-1" />
                                  Voir le justificatif
                                </button>
                              </div>

                              {exp.ocrData && exp.ocrData.confidence > 0.8 && (
                                <div className="bg-green-50 border border-green-200 rounded p-3">
                                  <div className="flex items-center text-green-700 mb-2">
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">
                                      Données extraites automatiquement
                                    </span>
                                    <span className="ml-2 text-xs bg-green-100 px-2 py-1 rounded">
                                      {Math.round(exp.ocrData.confidence * 100)}
                                      % confiance
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm text-green-600">
                                    <div>
                                      <span className="font-medium">
                                        Commerçant:
                                      </span>
                                      <br />
                                      {exp.ocrData.merchantName}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Montant:
                                      </span>
                                      <br />
                                      {exp.ocrData.amount}€
                                    </div>
                                    {exp.ocrData.taxAmount && (
                                      <div>
                                        <span className="font-medium">
                                          TVA:
                                        </span>
                                        <br />
                                        {exp.ocrData.taxAmount}€
                                      </div>
                                    )}
                                    {exp.ocrData.paymentMethod && (
                                      <div>
                                        <span className="font-medium">
                                          Paiement:
                                        </span>
                                        <br />
                                        {exp.ocrData.paymentMethod}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center text-sm text-red-600">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {exp.category.requiresReceipt
                                ? "Justificatif manquant (requis)"
                                : "Aucun justificatif"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Commentaires ({expense.comments.length})
              </h3>
              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="btn-secondary"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Ajouter un commentaire
              </button>
            </div>

            {showCommentForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajoutez votre commentaire..."
                  rows={3}
                  className="form-input mb-3"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCommentForm(false);
                      setNewComment("");
                    }}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddComment}
                    className="btn-primary"
                    disabled={!newComment.trim()}
                  >
                    Publier
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {expense.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucun commentaire pour le moment
                </p>
              ) : (
                expense.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.userName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.timestamp).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(expense.status)}
              <div>
                <h3 className="font-medium text-gray-900">
                  {getStatusText(expense.status)}
                </h3>
                <p className="text-sm text-gray-500">Statut actuel</p>
              </div>
            </div>

            {expense.status === "submitted" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  En attente de validation par votre manager
                </p>
              </div>
            )}

            {expense.status === "approved" && !expense.paidAt && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  Approuvé, remboursement en cours de traitement
                </p>
              </div>
            )}

            {expense.status === "rejected" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  Note rejetée. Vous pouvez la modifier et la soumettre à
                  nouveau.
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Résumé</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Soumis par</span>
                <span className="font-medium">{expense.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date de création</span>
                <span className="font-medium">
                  {new Date(expense.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre de dépenses</span>
                <span className="font-medium">{expense.expenses.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Justificatifs</span>
                <span className="font-medium">
                  {expense.expenses.filter((exp) => exp.receipt).length}/
                  {expense.expenses.length}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-600">Montant total</span>
                <span className="text-lg font-bold text-gray-900">
                  {expense.totalAmount.toLocaleString("fr-FR")}€
                </span>
              </div>
            </div>
          </div>

          {/* OCR Summary */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Extraction automatique
            </h3>
            <div className="space-y-3">
              {expense.expenses.map((exp, index) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">Dépense {index + 1}</span>
                  <div className="flex items-center">
                    {exp.ocrData ? (
                      <div className="flex items-center text-green-600">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Auto-rempli
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <FileText className="w-4 h-4 mr-1" />
                        Manuel
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Historique
            </h3>
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="flex space-x-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 ${event.color} rounded-full flex items-center justify-center text-white`}
                  >
                    {event.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.description}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    {event.comment && (
                      <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded p-2">
                        "{event.comment}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Justificatif
                </h3>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Receipt content would be displayed here */}
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Aperçu du justificatif (simulation)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
