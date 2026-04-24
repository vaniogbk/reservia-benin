# 🇧🇯 Réservia Bénin — Plateforme de Réservation

> Plateforme web complète de réservation d'hébergements et d'événements au Bénin  
> **Stack :** React.js 18 + Laravel 11 (PHP 8.3) + MySQL 8 + FedaPay

---

## 📁 Structure du projet

```
reservia/
├── backend/          ← Laravel API REST
│   ├── app/
│   │   ├── Models/              ← User, Hebergement, Evenement, Reservation, Paiement
│   │   ├── Http/Controllers/    ← Auth, Hebergement, Evenement, Reservation, Paiement
│   │   │   └── Admin/           ← DashboardController
│   │   ├── Jobs/                ← EnvoyerConfirmationEmail
│   │   └── Http/Middleware/     ← CheckRole
│   ├── database/
│   │   ├── migrations/          ← 6 migrations (users → paiements)
│   │   └── seeders/             ← Données de test béninoises
│   ├── routes/api.php           ← 25+ endpoints versionnés (/api/v1)
│   └── .env.example
│
└── frontend/         ← React.js SPA
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx            ← Accueil + hero + stats
    │   │   ├── Hebergements.jsx    ← Liste + filtres
    │   │   ├── HebergementDetail.jsx
    │   │   ├── Evenements.jsx      ← Catalogue + filtres
    │   │   ├── EvenementDetail.jsx
    │   │   ├── Reservation.jsx     ← Tunnel 3 étapes
    │   │   ├── Confirmation.jsx
    │   │   ├── Profil.jsx
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   └── admin/
    │   │       ├── Dashboard.jsx   ← KPIs + graphiques recharts
    │   │       ├── Reservations.jsx
    │   │       ├── Hebergements.jsx
    │   │       ├── Evenements.jsx
    │   │       └── Utilisateurs.jsx
    │   ├── components/
    │   │   ├── layout/   ← Navbar, Footer, AdminLayout
    │   │   └── ui/       ← HebergementCard, EvenementCard, SearchBar, StatutBadge
    │   ├── context/AuthContext.jsx ← État auth global
    │   └── services/api.js        ← Toutes les fonctions API (axios)
    └── package.json
```

---

## 🚀 Installation & Lancement

### Prérequis
- PHP 8.3+ / Composer
- Node.js 18+ / npm
- MySQL 8+

### 1. Backend Laravel

```bash
cd backend

# Copier l'environnement
cp .env.example .env

# Remplir .env : DB_DATABASE, DB_USERNAME, DB_PASSWORD, FEDAPAY_SECRET_KEY...

# Installer les dépendances
composer install

# Générer la clé d'application
php artisan key:generate

# Enregistrer le middleware de rôle dans bootstrap/app.php :
# ->withMiddleware(function (Middleware $middleware) {
#     $middleware->alias(['role' => \App\Http\Middleware\CheckRole::class]);
# })

# Créer la base de données MySQL
mysql -u root -p -e "CREATE DATABASE reservia_benin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Lancer les migrations + données de test
php artisan migrate --seed

# Démarrer le serveur
php artisan serve
# → API accessible sur http://localhost:8000/api/v1
```

### 2. Frontend React

```bash
cd frontend

# Installer les dépendances
npm install

# Vérifier .env (VITE_API_URL=http://localhost:8000/api/v1)

# Lancer le serveur de développement
npm run dev
# → Application sur http://localhost:5173
```

---

## 🔑 Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@reservia-benin.com | password123 |
| Prestataire | prestataire@reservia-benin.com | password123 |
| Client | client@reservia-benin.com | password123 |

---

## 🌍 Fonctionnalités

### Côté utilisateur
- ✅ Accueil avec hero, barre de recherche multicritères, statistiques
- ✅ Catalogue hébergements (6 propriétés béninoises) avec filtres
- ✅ Catalogue événements (6 événements authentiques) avec filtres par catégorie
- ✅ Fiches détaillées hébergements et événements
- ✅ Processus de réservation 3 étapes (dates → infos → paiement)
- ✅ Intégration FedaPay (redirect vers page de paiement)
- ✅ Choix : MTN MoMo / Moov Money / Carte / CinetPay
- ✅ Page de confirmation avec téléchargement reçu PDF
- ✅ Profil utilisateur avec historique des réservations
- ✅ Inscription / Connexion (Laravel Sanctum)

### Côté admin
- ✅ Dashboard : KPIs (revenus, réservations, note, utilisateurs)
- ✅ Graphique barres — réservations par mois (Recharts)
- ✅ Répartition revenus hébergements / événements
- ✅ Tableau toutes réservations avec filtres par statut
- ✅ Gestion hébergements (activation/désactivation, suppression)
- ✅ Gestion événements (liste + suppression)
- ✅ Gestion utilisateurs avec modification des rôles

---

## 💳 Paiement (FedaPay)

Le flux complet :
1. Client clique **Payer** → React appelle `POST /api/v1/paiements/initier`
2. Laravel crée une transaction FedaPay via le SDK PHP
3. L'URL de paiement FedaPay est retournée
4. Redirection vers la page de paiement FedaPay
5. Client paie via Mobile Money ou carte
6. FedaPay appelle le webhook `POST /api/v1/paiements/webhook`
7. Laravel confirme la réservation + envoie email (Job asynchrone)
8. Redirection vers `/confirmation/{ref}`

**Variables .env nécessaires :**
```
FEDAPAY_SECRET_KEY=sk_sandbox_VOTRE_CLE
FEDAPAY_ENV=sandbox   # → 'live' en production
```

---

## 🔒 Sécurité

- Authentification : Laravel Sanctum (tokens Bearer)
- Middleware `CheckRole` : protection des routes admin/prestataire
- Bcrypt pour les mots de passe
- CORS configuré via Laravel
- Validation des webhooks FedaPay par signature HMAC
- Protection CSRF via Sanctum SPA

---

## 🗃️ Base de Données — Tables

| Table | Description |
|-------|-------------|
| `users` | Clients, prestataires, admins |
| `hebergements` | Hôtels, écolodges, villas, gîtes... |
| `evenements` | Festivals, séminaires, safaris... |
| `reservations` | Polymorphique (hébergement OU événement) |
| `paiements` | Transactions FedaPay/CinetPay/MoMo |
| `personal_access_tokens` | Tokens Sanctum |

---

## 📡 Endpoints API (résumé)

```
POST   /api/v1/register
POST   /api/v1/login
GET    /api/v1/hebergements?ville=&type=&prix_max=&nb_personnes=
GET    /api/v1/hebergements/{id}
GET    /api/v1/hebergements/{id}/disponibilites
GET    /api/v1/evenements?categorie=&ville=
GET    /api/v1/evenements/{id}
POST   /api/v1/reservations          [auth]
GET    /api/v1/reservations          [auth]
GET    /api/v1/reservations/{ref}    [auth]
PATCH  /api/v1/reservations/{ref}/annuler  [auth]
GET    /api/v1/reservations/{ref}/recu     [auth]
POST   /api/v1/paiements/initier     [auth]
POST   /api/v1/paiements/webhook     [public]
GET    /api/v1/admin/dashboard       [admin]
GET    /api/v1/admin/reservations    [admin]
GET    /api/v1/admin/utilisateurs    [admin]
PATCH  /api/v1/admin/utilisateurs/{id}/role  [admin]
```

---

## 🚀 Déploiement Production

### Backend (VPS OVH)
```bash
# Sur le serveur
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan migrate --force
# Configurer Nginx + PHP-FPM + SSL (Certbot)
```

### Frontend (Vercel)
```bash
npm run build
# Déployer le dossier dist/ sur Vercel ou Netlify
# Configurer VITE_API_URL vers l'URL de production
```

---

## 📦 Librairies clés

**Backend :** `fedapay/fedapay-php` · `barryvdh/laravel-dompdf` · `laravel/sanctum`  
**Frontend :** `axios` · `react-query` · `react-hook-form` · `recharts` · `react-hot-toast` · `date-fns` · `tailwindcss`

---

*Réservia Bénin — Projet Académique 2025/2026 · Stack React.js + Laravel + MySQL*
