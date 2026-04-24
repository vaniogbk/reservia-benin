<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EvenementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Evenement::with('user:id,nom,prenom')
            ->actif()
            ->avenir()
            ->parCategorie($request->categorie)
            ->parVille($request->ville);

        if ($request->date) {
            $query->whereDate('date_debut', $request->date);
        }

        $evenements = $query->orderBy('date_debut')->paginate($request->get('per_page', 12));
        return response()->json($evenements);
    }

    public function show(Evenement $evenement): JsonResponse
    {
        $evenement->load('user:id,nom,prenom');
        return response()->json($evenement);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom'             => 'required|string|max:200',
            'description'     => 'nullable|string',
            'categorie'       => 'required|in:vodoun,gastronomie,culture,seminaire,nature,art',
            'lieu'            => 'required|string|max:200',
            'ville'           => 'required|string|max:100',
            'departement'     => 'required|string|max:50',
            'date_debut'      => 'required|date|after:now',
            'date_fin'        => 'nullable|date|after:date_debut',
            'prix_fcfa'       => 'required|integer|min:0',
            'capacite_totale' => 'required|integer|min:1',
        ]);

        $data['places_restantes'] = $data['capacite_totale'];
        $evenement = $request->user()->evenements()->create($data);
        return response()->json(['message' => 'Événement créé', 'data' => $evenement], 201);
    }

    public function update(Request $request, Evenement $evenement): JsonResponse
    {
        $this->authorize('update', $evenement);
        $evenement->update($request->validate([
            'nom'         => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'prix_fcfa'   => 'sometimes|integer|min:0',
            'actif'       => 'sometimes|boolean',
        ]));
        return response()->json(['message' => 'Événement mis à jour', 'data' => $evenement]);
    }

    public function destroy(Evenement $evenement): JsonResponse
    {
        $evenement->delete();
        return response()->json(['message' => 'Événement supprimé']);
    }
}
