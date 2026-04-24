<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\{Company, Hebergement, Evenement, Reservation, Paiement, User};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalRevenus     = Paiement::where('statut', 'reussi')->sum('montant_fcfa');
        $revenusMois      = Paiement::where('statut', 'reussi')
                                    ->whereMonth('paye_le', now()->month)->sum('montant_fcfa');
        $totalCompanies   = Company::count();
        $totalUtilisateurs = User::count();
        $totalReservations = Reservation::count();
        $reservationsActives = Reservation::whereIn('statut', ['confirmee', 'en_attente'])->count();

        $reservationsMois = Reservation::select(
                DB::raw('MONTH(created_at) as mois'),
                DB::raw('YEAR(created_at) as annee'),
                DB::raw('COUNT(*) as total')
            )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('annee', 'mois')
            ->orderBy('annee')->orderBy('mois')
            ->get();

        $revenusParCompany = Company::withSum(
                ['hebergements as revenus' => fn($q) =>
                    $q->join('reservations', 'hebergements.id', '=', 'reservations.reservable_id')
                      ->join('paiements', 'reservations.id', '=', 'paiements.reservation_id')
                      ->where('paiements.statut', 'reussi')
                ],
                'paiements.montant_fcfa'
            )
            ->take(5)->get(['id', 'nom']);

        $dernieresReservations = Reservation::with(['user:id,nom,prenom,company_id', 'reservable'])
            ->latest()->take(10)->get();

        return response()->json([
            'kpis' => [
                'revenus_total_fcfa'    => $totalRevenus,
                'revenus_mois_fcfa'     => $revenusMois,
                'total_companies'       => $totalCompanies,
                'total_utilisateurs'    => $totalUtilisateurs,
                'total_reservations'    => $totalReservations,
                'reservations_actives'  => $reservationsActives,
            ],
            'graphiques' => [
                'reservations_par_mois' => $reservationsMois,
                'revenus_par_company'   => $revenusParCompany,
            ],
            'dernieres_reservations' => $dernieresReservations,
        ]);
    }

    public function companies(Request $request): JsonResponse
    {
        $companies = Company::withCount(['users', 'hebergements', 'evenements'])
            ->when($request->search, fn($q) => $q->where('nom', 'like', "%{$request->search}%"))
            ->latest()->paginate(20);
        return response()->json($companies);
    }

    public function storeCompany(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom'           => 'required|string|max:150',
            'email_contact' => 'required|email|unique:companies',
            'description'   => 'nullable|string',
            'telephone'     => 'nullable|string|max:20',
            'ville'         => 'nullable|string|max:100',
            'pays'          => 'nullable|string|max:100',
            'logo_url'      => 'nullable|url',
        ]);

        $company = Company::create($data);
        return response()->json(['message' => 'Entreprise créée', 'company' => $company], 201);
    }

    public function updateCompany(Request $request, Company $company): JsonResponse
    {
        $data = $request->validate([
            'nom'           => 'sometimes|string|max:150',
            'email_contact' => "sometimes|email|unique:companies,email_contact,{$company->id}",
            'description'   => 'nullable|string',
            'telephone'     => 'nullable|string|max:20',
            'ville'         => 'nullable|string|max:100',
            'pays'          => 'nullable|string|max:100',
            'logo_url'      => 'nullable|url',
            'actif'         => 'sometimes|boolean',
        ]);

        $company->update($data);
        return response()->json(['message' => 'Entreprise mise à jour', 'company' => $company]);
    }

    public function destroyCompany(Company $company): JsonResponse
    {
        $company->delete();
        return response()->json(['message' => 'Entreprise supprimée']);
    }

    public function utilisateurs(Request $request): JsonResponse
    {
        $users = User::with('company:id,nom')
            ->withCount('reservations')
            ->when($request->company_id, fn($q) => $q->where('company_id', $request->company_id))
            ->when($request->role, fn($q) => $q->where('role', $request->role))
            ->latest()->paginate(20);
        return response()->json($users);
    }

    public function updateRole(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'role'       => 'required|in:client,prestataire,admin,company_admin,super_admin',
            'company_id' => 'nullable|exists:companies,id',
        ]);
        $user->update($request->only('role', 'company_id'));
        return response()->json(['message' => 'Rôle mis à jour', 'user' => $user]);
    }

    public function reservations(Request $request): JsonResponse
    {
        $reservations = Reservation::with(['user:id,nom,prenom,company_id', 'reservable', 'paiement'])
            ->when($request->company_id, function ($q) use ($request) {
                $q->whereHas('user', fn($u) => $u->where('company_id', $request->company_id));
            })
            ->latest()->paginate(20);
        return response()->json($reservations);
    }

    public function paiements(Request $request): JsonResponse
    {
        $paiements = Paiement::with(['reservation.user:id,nom,prenom,company_id', 'reservation.reservable'])
            ->when($request->statut, fn($q) => $q->where('statut', $request->statut))
            ->latest()->paginate(20);
        return response()->json($paiements);
    }

    public function statistiques(): JsonResponse
    {
        return response()->json([
            'total_companies'    => Company::count(),
            'total_hebergements' => Hebergement::count(),
            'total_evenements'   => Evenement::count(),
            'total_reservations' => Reservation::count(),
            'total_utilisateurs' => User::count(),
            'revenus_total'      => Paiement::where('statut', 'reussi')->sum('montant_fcfa'),
            'revenus_mois'       => Paiement::where('statut', 'reussi')
                                            ->whereMonth('paye_le', now()->month)->sum('montant_fcfa'),
        ]);
    }
}
