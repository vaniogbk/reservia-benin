<?php

namespace App\Http\Controllers;

use App\Models\Hebergement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HebergementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Hebergement::with('user:id,nom,prenom')
            ->actif()
            ->parVille($request->ville)
            ->parType($request->type)
            ->prixMax($request->prix_max)
            ->capacite($request->nb_personnes);

        if ($request->departement) {
            $query->where('departement', $request->departement);
        }

        if ($request->filled(['date_arrivee', 'date_depart'])) {
            $query->whereDoesntHave('reservations', function ($q) use ($request) {
                $q->where('statut', '!=', 'annulee')
                  ->where('date_arrivee', '<', $request->date_depart)
                  ->where('date_depart', '>', $request->date_arrivee);
            });
        }

        $hebergements = $query->orderBy('note_moyenne', 'desc')
            ->paginate($request->get('per_page', 12));

        return response()->json($hebergements);
    }

    public function show(Hebergement $hebergement): JsonResponse
    {
        $hebergement->load('user:id,nom,prenom');
        return response()->json($hebergement);
    }

    public function disponibilites(Hebergement $hebergement): JsonResponse
    {
        return response()->json(['dates_reservees' => $hebergement->datesReservees()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom'           => 'required|string|max:200',
            'description'   => 'nullable|string',
            'type'          => 'required|in:hotel,ecolodge,gite,villa,auberge',
            'ville'         => 'required|string|max:100',
            'departement'   => 'required|string|max:50',
            'adresse'       => 'nullable|string',
            'latitude'      => 'nullable|numeric',
            'longitude'     => 'nullable|numeric',
            'prix_nuit_fcfa'=> 'required|integer|min:1000',
            'nb_chambres'   => 'required|integer|min:1',
            'capacite_max'  => 'required|integer|min:1',
            'commodites'    => 'nullable|array',
        ]);

        $hebergement = $request->user()->hebergements()->create($data);
        return response()->json(['message' => 'Hébergement créé', 'data' => $hebergement], 201);
    }

    public function update(Request $request, Hebergement $hebergement): JsonResponse
    {
        $this->authorize('update', $hebergement);
        $data = $request->validate([
            'nom'           => 'sometimes|string|max:200',
            'description'   => 'nullable|string',
            'prix_nuit_fcfa'=> 'sometimes|integer|min:1000',
            'capacite_max'  => 'sometimes|integer|min:1',
            'commodites'    => 'nullable|array',
            'actif'         => 'sometimes|boolean',
        ]);
        $hebergement->update($data);
        return response()->json(['message' => 'Hébergement mis à jour', 'data' => $hebergement]);
    }

    public function destroy(Hebergement $hebergement): JsonResponse
    {
        $hebergement->delete();
        return response()->json(['message' => 'Hébergement supprimé']);
    }
}
