<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Hebergement, Evenement, Reservation, Paiement, User};
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $revenusMois = Paiement::where('statut', 'reussi')
            ->whereMonth('paye_le', now()->month)
            ->sum('montant_fcfa');

        $reservationsActives = Reservation::whereIn('statut', ['confirmee', 'en_attente'])->count();
        $noteMoyenne = DB::table('hebergements')->avg('note_moyenne');
        $utilisateursActifs = User::whereMonth('created_at', now()->month)->count();

        // Réservations par mois (6 derniers mois)
        $reservationsMois = Reservation::select(
                DB::raw('MONTH(created_at) as mois'),
                DB::raw('YEAR(created_at) as annee'),
                DB::raw('COUNT(*) as total')
            )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('annee', 'mois')
            ->orderBy('annee')->orderBy('mois')
            ->get();

        // Répartition revenus
        $revenusHebergements = Paiement::where('statut', 'reussi')
            ->whereHas('reservation', fn($q) => $q->where('reservable_type', 'App\\Models\\Hebergement'))
            ->sum('montant_fcfa');

        $revenusEvenements = Paiement::where('statut', 'reussi')
            ->whereHas('reservation', fn($q) => $q->where('reservable_type', 'App\\Models\\Evenement'))
            ->sum('montant_fcfa');

        $dernieresReservations = Reservation::with(['user:id,nom,prenom', 'reservable'])
            ->latest()->take(10)->get();

        return response()->json([
            'kpis' => [
                'revenus_mois_fcfa'     => $revenusMois,
                'reservations_actives'  => $reservationsActives,
                'note_moyenne'          => round($noteMoyenne, 2),
                'utilisateurs_ce_mois'  => $utilisateursActifs,
            ],
            'graphiques' => [
                'reservations_par_mois' => $reservationsMois,
                'repartition_revenus'   => [
                    ['label' => 'Hébergements', 'montant' => $revenusHebergements],
                    ['label' => 'Événements',   'montant' => $revenusEvenements],
                ],
            ],
            'dernieres_reservations' => $dernieresReservations,
        ]);
    }

    public function reservations(): JsonResponse
    {
        $reservations = Reservation::with(['user:id,nom,prenom,email', 'reservable', 'paiement'])
            ->latest()
            ->paginate(20);
        return response()->json($reservations);
    }

    public function utilisateurs(): JsonResponse
    {
        $users = User::withCount(['reservations'])->latest()->paginate(20);
        return response()->json($users);
    }

    public function updateRole(\Illuminate\Http\Request $request, User $user): JsonResponse
    {
        $request->validate(['role' => 'required|in:client,prestataire,admin']);
        $user->update(['role' => $request->role]);
        return response()->json(['message' => 'Rôle mis à jour', 'user' => $user]);
    }

    public function statistiques(): JsonResponse
    {
        $tauxOccupation = DB::table('hebergements')
            ->selectRaw('AVG(occupation_rate) as taux_moyen')
            ->first();

        return response()->json([
            'total_hebergements' => Hebergement::count(),
            'total_evenements'   => Evenement::count(),
            'total_reservations' => Reservation::count(),
            'total_utilisateurs' => User::count(),
            'revenus_total'      => Paiement::where('statut', 'reussi')->sum('montant_fcfa'),
        ]);
    }
}
