# Cahier des charges détaillé

**Application de gestion des demandes de sortie de caisse**

---

## 1. Présentation de l’entreprise et du projet

L’entreprise souhaite digitaliser le processus de demande, validation et suivi des sorties de caisse afin de garantir la traçabilité, la conformité et la rapidité de traitement. L’application cible les employés demandeurs, les responsables hiérarchiques, les services comptables et le caissier[4].

---

## 2. Objectifs du projet

- Dématérialiser les demandes de sortie de caisse
- Automatiser le circuit de validation (workflow)
- Assurer la traçabilité et l’archivage des pièces justificatives
- Centraliser le suivi des mouvements de caisse
- Faciliter l’édition des rapports et le contrôle interne[4]

---

## 3. Utilisateurs et rôles

- **Demandeur** : initie la demande de sortie de caisse
- **Responsable hiérarchique** : valide ou rejette la demande
- **Comptable** : contrôle et valide la conformité
- **Caissier** : effectue le décaissement et génère le reçu
- **Administrateur** : paramètre les accès et supervise le système

---

## 4. Fonctionnalités principales

### 4.1 Gestion des demandes

- Création de la demande avec saisie des informations obligatoires :
  - Identité du demandeur
  - Montant demandé
  - Objet/motif de la dépense
  - Projet ou centre de coût concerné
  - Pièces justificatives en pièce jointe (scan, photo, PDF)
- Numérotation automatique et unique des demandes
- Possibilité de sauvegarde en brouillon

### 4.2 Circuit de validation (workflow)

- Transmission automatique au supérieur hiérarchique
- Validation par le service comptable
- Notifications automatiques à chaque étape
- Historique des validations, commentaires et rejets

### 4.3 Décaissement et suivi

- Génération automatique du bon de sortie de caisse
- Saisie du décaissement par le caissier (date, montant, mode de paiement)
- Signature électronique du bénéficiaire
- Archivage du bon de sortie et des pièces justificatives

### 4.4 Gestion documentaire

- Classement automatique des pièces justificatives
- Accès sécurisé aux archives
- Recherche multicritère

### 4.5 Suivi et reporting

- Tableau de bord synthétique
- Export des données (Excel, PDF)
- Journal de caisse automatique
- Alertes en cas d’écart entre solde théorique et réel

---

## 5. Spécifications techniques

- Application web responsive (PC, tablette, mobile)
- Authentification sécurisée (SSO, LDAP ou autre)
- Gestion fine des droits d’accès
- Archivage sécurisé des données
- Conformité RGPD
- Intégration possible avec le logiciel comptable existant
- Sauvegarde et restauration automatique[2][3]

---

## 6. Contraintes et exigences complémentaires

- Multilingue (français, anglais…)
- Historisation complète des actions
- Paramétrage des circuits de validation selon le montant ou le type de dépense
- Gestion des avances et remboursements
- Ajout d’annexes (modèles, procédures internes)

---

## 7. Délais et budget

- Planning prévisionnel avec jalons :
  - Initialisation
  - Planification
  - Réalisation
  - Contrôle et suivi
  - Clôture
- Budget estimatif à préciser selon le périmètre technique[1]

---

## 8. Annexes

### 8.1 Modèle de bon de sortie de caisse

```
BON DE SORTIE DE CAISSE
N° : [Numéro automatique]
Date : [JJ/MM/AAAA]

Demandeur :
Nom : [Nom complet]
Service / Département : [Nom du service]

Montant demandé : [Montant en chiffres] € ([Montant en lettres])

Motif / Objet de la dépense :
[Description détaillée]

Projet / Centre de coût :
[Référence projet ou centre de coût]

Validation
| Rôle                  | Nom et signature          | Date       | Commentaires              |
|-----------------------|--------------------------|------------|--------------------------|
| Responsable hiérarchique |                          |            |                          |
| Service comptable        |                          |            |                          |
| Caissier                |                          |            |                          |

Décaissement
Montant versé : [Montant en chiffres] €
Mode de paiement : [Espèces / Chèque / Virement]
Date du décaissement : [JJ/MM/AAAA]

Signature du bénéficiaire : ___________________________
```

---

### 8.2 Procédure interne pour la demande de sortie de caisse

**Procédure de demande de sortie de caisse**

**Objectif :**  
Garantir un contrôle rigoureux et une traçabilité des sorties de fonds en espèces.

**Étapes :**

1. Initiation de la demande : formulaire rempli avec justificatifs.
2. Validation hiérarchique : validation ou rejet.
3. Contrôle comptable : vérification des pièces et fonds.
4. Décaissement : paiement, signature du bénéficiaire, archivage.
5. Archivage et suivi : conservation des documents pour audit.

**Responsables :**

- Demandeur : initiation
- Supérieur hiérarchique : validation
- Comptable : contrôle
- Caissier : décaissement et archivage

---

### 8.3 Diagramme de workflow simplifié

1. Création de la demande dans l’application.
2. Envoi au responsable hiérarchique.
3. Validation ou rejet (notification au demandeur).
4. Si validée, transmission au service comptable.
5. Après validation comptable, envoi au caissier.
6. Décaissement et enregistrement.
7. Signature électronique du bénéficiaire.
8. Archivage des documents.

---

### 8.4 Exemple de rapport synthétique des sorties de caisse

| N° Demande | Date demande | Demandeur     | Montant (€) | Motif               | Statut     | Date décaissement | Responsable validation | Commentaires          |
| ---------- | ------------ | ------------- | ----------- | ------------------- | ---------- | ----------------- | ---------------------- | --------------------- |
| 000123     | 01/06/2025   | Dupont Jean   | 150,00      | Achat fournitures   | Validée    | 03/06/2025        | Martin Sophie          | OK                    |
| 000124     | 02/06/2025   | Durand Claire | 300,00      | Frais déplacement   | En attente | -                 | -                      | En attente validation |
| 000125     | 05/06/2025   | Moreau Paul   | 200,00      | Réparation matériel | Rejetée    | -                 | Martin Sophie          | Justificatif manquant |

---

**Ce cahier des charges complet intègre les modèles et annexes nécessaires pour cadrer la conception et le développement de l’application, conformément aux bonnes pratiques de structuration[2][3][4].**

[1] https://blog-gestion-de-projet.com/cahier-des-charges-projet/
[2] https://www.appvizer.fr/magazine/operations/gestion-de-projet/cahier-des-charges
[3] https://www.lafabriquedunet.fr/modele/exemple-cahier-des-charges-application-mobile/
[4] https://hello-pomelo.com/articles/comment-rediger-un-cahier-des-charges-pour-une-application-web-ou-mobile/
[5] https://fr.scribd.com/document/588320400/Cahier-de-charge-logiciel-de-gestion-de-stock
[6] https://www.sooyoos.com/publication/cahier-des-charges-application-mobile/
[7] https://www.labocea.fr/wp-content/uploads/2016/01/CAHIER-DES-CHARGES.pdf
[8] https://fr.scribd.com/document/741669264/MODELE-DE-CAHIER-DES-CHARGES-APPLICATION-WEB
