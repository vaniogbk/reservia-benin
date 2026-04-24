<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HebergementController;
use App\Http\Controllers\EvenementController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboard;
use App\Http\Controllers\CompanyAdmin\DashboardController as CompanyAdminDashboard;

Route::prefix('v1')->group(function () {

    // ── Authentification publique ──
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);

    // Webhook paiement (signé mais public)
    Route::post('/paiements/webhook', [PaiementController::class, 'webhook']);

    // ── Routes publiques ──
    Route::get('/hebergements',                              [HebergementController::class, 'index']);
    Route::get('/hebergements/{hebergement}',                [HebergementController::class, 'show']);
    Route::get('/hebergements/{hebergement}/disponibilites', [HebergementController::class, 'disponibilites']);
    Route::get('/evenements',              [EvenementController::class, 'index']);
    Route::get('/evenements/{evenement}',  [EvenementController::class, 'show']);

    // ── Routes authentifiées ──
    Route::middleware('auth:sanctum')->group(function () {

        // Profil
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user',    [AuthController::class, 'me']);
        Route::put('/user',    [AuthController::class, 'updateProfile']);

        // Réservations
        Route::get('/reservations',                       [ReservationController::class, 'index']);
        Route::post('/reservations',                      [ReservationController::class, 'store']);
        Route::get('/reservations/{reference}',           [ReservationController::class, 'show']);
        Route::patch('/reservations/{reference}/annuler', [ReservationController::class, 'annuler']);
        Route::get('/reservations/{reference}/recu',      [ReservationController::class, 'recu']);

        // Paiements
        Route::post('/paiements/initier',          [PaiementController::class, 'initier']);
        Route::get('/paiements/{paiement}/statut', [PaiementController::class, 'statut']);

        // ── Prestataire + Admin ──
        Route::middleware('role:prestataire,admin,company_admin,super_admin')->group(function () {
            Route::post('/hebergements',               [HebergementController::class, 'store']);
            Route::put('/hebergements/{hebergement}',  [HebergementController::class, 'update']);
            Route::post('/evenements',                 [EvenementController::class, 'store']);
            Route::put('/evenements/{evenement}',      [EvenementController::class, 'update']);
        });

        // ── Admin entreprise (legacy) ──
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/dashboard',                   [DashboardController::class, 'index']);
            Route::get('/reservations',                [DashboardController::class, 'reservations']);
            Route::get('/utilisateurs',                [DashboardController::class, 'utilisateurs']);
            Route::patch('/utilisateurs/{user}/role',  [DashboardController::class, 'updateRole']);
            Route::get('/statistiques',                [DashboardController::class, 'statistiques']);
            Route::delete('/hebergements/{hebergement}', [HebergementController::class, 'destroy']);
            Route::delete('/evenements/{evenement}',     [EvenementController::class, 'destroy']);
        });

        // ── Super Admin ──
        Route::middleware('role:super_admin')->prefix('super-admin')->group(function () {
            Route::get('/dashboard',                        [SuperAdminDashboard::class, 'index']);
            Route::get('/statistiques',                     [SuperAdminDashboard::class, 'statistiques']);
            Route::get('/reservations',                     [SuperAdminDashboard::class, 'reservations']);
            Route::get('/paiements',                        [SuperAdminDashboard::class, 'paiements']);
            Route::get('/utilisateurs',                     [SuperAdminDashboard::class, 'utilisateurs']);
            Route::patch('/utilisateurs/{user}/role',       [SuperAdminDashboard::class, 'updateRole']);
            // Gestion des entreprises
            Route::get('/companies',                        [SuperAdminDashboard::class, 'companies']);
            Route::post('/companies',                       [SuperAdminDashboard::class, 'storeCompany']);
            Route::put('/companies/{company}',              [SuperAdminDashboard::class, 'updateCompany']);
            Route::delete('/companies/{company}',           [SuperAdminDashboard::class, 'destroyCompany']);
        });

        // ── Admin entreprise (company_admin) ──
        Route::middleware('role:company_admin,super_admin')->prefix('company-admin')->group(function () {
            Route::get('/dashboard',      [CompanyAdminDashboard::class, 'index']);
            Route::get('/reservations',   [CompanyAdminDashboard::class, 'reservations']);
            Route::get('/hebergements',   [CompanyAdminDashboard::class, 'hebergements']);
            Route::get('/evenements',     [CompanyAdminDashboard::class, 'evenements']);
            Route::get('/utilisateurs',   [CompanyAdminDashboard::class, 'utilisateurs']);
            Route::get('/statistiques',   [CompanyAdminDashboard::class, 'statistiques']);
            Route::delete('/hebergements/{hebergement}', [HebergementController::class, 'destroy']);
            Route::delete('/evenements/{evenement}',     [EvenementController::class, 'destroy']);
        });
    });
});
