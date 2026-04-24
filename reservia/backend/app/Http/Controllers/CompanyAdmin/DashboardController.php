<?php

namespace App\Http\Controllers\CompanyAdmin;

use App\Http\Controllers\Controller;
use App\Models\{Company, Hebergement, Evenement, Reservation, Paiement, User};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    private function companyId(Request $request): int
    {
        return (int) $request->user()->company_id;
    }

    public function index(Request $request): JsonResponse
    {
        $cid = $this->companyId($request);

        $revenusMois = Paiement::where('statut', 'reussi')
            ->whereMonth('paye_le', now()->month)
            ->whereHas('reservation.user', fn($q) => $q->where('company_id', $cid))
            ->sum('montant_fcfa');

        $reservationsActives = Reservation::whereIn('statut', ['confirmee', 'en_attente'])
            ->whereHas('user', fn($q) => $q->where('company_id', $cid))
            ->count();

        $totalHebergements = Hebergement::where('company_id', $cid)->count();
        $totalEvenements   = Evenement::where('company_id', $cid)->count();
        $totalUtilisateurs = User::where('company_id', $cid)->count();

        $noteMoyenne = Hebergement::where('company_id', $cid)->avg('note_moyenne');

        $reservationsMois = Reservation::select(
                DB::raw('MONTH(reservations.created_at) as mois'),
                DB::raw('YEAR(reservations.created_at) as annee'),
                DB::raw('COUNT(*) as total')
            )
            ->join('users', 'reservations.user_id', '=', 'users.id')
            ->where('users.company_id', $cid)
            ->where('reservations.created_at', '>=', now()->subMonths(6))
            ->groupBy('annee', 'mois')
            ->orderBy('annee')->orderBy('mois')
            ->get();

        $dernieresReservations = Reservation::with(['user:id,nom,prenom', 'reservable', 'paiement'])
            ->whereHas('user', fn($q) => $q->where('company_id', $cid))
            ->latest()->take(10)->get();

        $company = Company::find($cid, ['id', 'nom', 'logo_url', 'ville']);

        return response()->json([
            'company' => $company,
            'kpis' => [
                'revenus_mois_fcfa'     => $revenusMois,
                'reservations_actives'  => $reservationsActives,
                'total_hebergements'    => $totalHebergements,
                'total_evenements'      => $totalEvenements,
                'total_utilisateurs'    => $totalUtilisateurs,
                'note_moyenne'          => round($noteMoyenne, 2),
            ],
            'graphiques' => [
                'reservations_par_mois' => $reservationsMois,
            ],
            'dernieres_reservations' => $dernieresReservations,
        ]);
    }

    public function reservations(Request $request): JsonResponse
    {
        $cid = $this->companyId($request);
        $reservations = Reservation::with(['user:id,nom,prenom', 'reservable', 'paiement'])
            ->whereHas('user', fn($q) => $q->where('company_id', $cid))
            ->when($request->statut, fn($q) => $q->where('statut', $request->statut))
            ->latest()->paginate(20);
        return response()->json($reservations);
    }

    public function hebergements(Request $request): JsonResponse
    {
        $cid = $this->companyId($request);
        $hebergements = Hebergement::where('company_id', $cid)
            ->withCount('reservations')
            ->when($request->search, fn($q) => $q->where('nom', 'like', "%{$request->search}%"))
            ->latest()->paginate(20);
        return response()->json($hebergements);
    }

    public function evenements(Request $request): JsonResponse
    {
        $cid = $this->companyId($request);
        $evenements = Evenement::where('company_id', $cid)
            ->withCount('reservations')
            ->when($request->search, fn($q) => $q->where('nom', 'like', "%{$request->search}%"))
            ->latest()->paginate(20);
        return response()->json($evenements);
    }

    public function utilisateurs(Request $request): JsonResponse
    {
        $cid = $this->companyId($request);
        $users = User::where('company_id', $cid)
            ->withCount('reservations')
            ->latest()->paginate(20);
        return response()->json($users);
    }

    public function statistiques(Request $request): JsonResponse
    {
        $cid = $this->companyId($request);
        return response()->json([
            'total_hebergements' => Hebergement::where('company_id', $cid)->count(),
            'total_evenements'   => Evenement::where('company_id', $cid)->count(),
            'total_reservations' => Reservation::whereHas('user', fn($q) => $q->where('company_id', $cid))->count(),
            'total_utilisateurs' => User::where('company_id', $cid)->count(),
            'revenus_total'      => Paiement::where('statut', 'reussi')
                ->whereHas('reservation.user', fn($q) => $q->where('company_id', $cid))
                ->sum('montant_fcfa'),
        ]);
    }
}
