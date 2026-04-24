<?php

namespace App\Http\Controllers;

use App\Models\Hebergement;
use App\Models\Evenement;
use App\Models\Reservation;
use App\Jobs\EnvoyerConfirmationEmail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReservationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reservations = $request->user()
            ->reservations()
            ->with(['reservable', 'paiement'])
            ->latest()
            ->paginate(10);
        return response()->json($reservations);
    }

    public function show(Request $request, string $reference): JsonResponse
    {
        $reservation = $request->user()
            ->reservations()
            ->with(['reservable', 'paiement'])
            ->where('reference', $reference)
            ->firstOrFail();
        return response()->json($reservation);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type'              => 'required|in:hebergement,evenement',
            'reservable_id'     => 'required|integer',
            'date_arrivee'      => 'required_if:type,hebergement|nullable|date|after:today',
            'date_depart'       => 'required_if:type,hebergement|nullable|date|after:date_arrivee',
            'nb_personnes'      => 'required|integer|min:1',
            'demandes_speciales'=> 'nullable|string',
        ]);

        if ($data['type'] === 'hebergement') {
            $resource = Hebergement::findOrFail($data['reservable_id']);
            $nbNuits  = \Carbon\Carbon::parse($data['date_arrivee'])->diffInDays($data['date_depart']);
            $montants = Reservation::calculerMontant($resource->prix_nuit_fcfa, $nbNuits);

            // Vérifier disponibilité
            $conflit = $resource->reservations()
                ->where('statut', '!=', 'annulee')
                ->where('date_arrivee', '<', $data['date_depart'])
                ->where('date_depart', '>', $data['date_arrivee'])
                ->exists();

            if ($conflit) {
                return response()->json(['message' => 'Ces dates ne sont plus disponibles'], 422);
            }
        } else {
            $resource = Evenement::findOrFail($data['reservable_id']);
            if (!$resource->hasPlacesDisponibles()) {
                return response()->json(['message' => 'Plus de places disponibles'], 422);
            }
            $montants = Reservation::calculerMontant($resource->prix_fcfa, $data['nb_personnes']);
            $resource->decrement('places_restantes', $data['nb_personnes']);
        }

        $reservation = Reservation::create([
            'user_id'            => $request->user()->id,
            'reservable_id'      => $resource->id,
            'reservable_type'    => get_class($resource),
            'date_arrivee'       => $data['date_arrivee'] ?? null,
            'date_depart'        => $data['date_depart'] ?? null,
            'nb_personnes'       => $data['nb_personnes'],
            'montant_ht_fcfa'    => $montants['ht'],
            'frais_service_fcfa' => $montants['frais'],
            'taxes_fcfa'         => $montants['taxes'],
            'montant_total_fcfa' => $montants['total'],
            'statut'             => 'en_attente',
            'demandes_speciales' => $data['demandes_speciales'] ?? null,
        ]);

        return response()->json([
            'message'     => 'Réservation créée, procédez au paiement',
            'reservation' => $reservation->load('reservable'),
        ], 201);
    }

    public function annuler(Request $request, string $reference): JsonResponse
    {
        $reservation = $request->user()
            ->reservations()
            ->where('reference', $reference)
            ->where('statut', 'confirmee')
            ->firstOrFail();

        $reservation->update(['statut' => 'annulee']);

        // Remettre les places si événement
        if ($reservation->reservable_type === 'App\\Models\\Evenement') {
            $reservation->reservable->increment('places_restantes', $reservation->nb_personnes);
        }

        return response()->json(['message' => 'Réservation annulée']);
    }

    public function recu(Request $request, string $reference): \Illuminate\Http\Response
    {
        $reservation = $request->user()
            ->reservations()
            ->with(['reservable', 'paiement'])
            ->where('reference', $reference)
            ->where('statut', 'confirmee')
            ->firstOrFail();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.recu', compact('reservation'));
        return $pdf->download("recu-{$reference}.pdf");
    }
}
