<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Reservation;
use App\Jobs\EnvoyerConfirmationEmail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use FedaPay\FedaPay;
use FedaPay\Transaction;

class PaiementController extends Controller
{
    public function __construct()
    {
        FedaPay::setApiKey(config('services.fedapay.secret_key'));
        FedaPay::setEnvironment(config('services.fedapay.env', 'sandbox'));
    }

    public function initier(Request $request): JsonResponse
    {
        $data = $request->validate([
            'reservation_reference' => 'required|string',
            'methode'               => 'required|in:fedapay,cinetpay,mtn_momo,moov_money,carte',
            'telephone'             => 'required_if:methode,mtn_momo,moov_money|nullable|string',
        ]);

        $reservation = Reservation::with('user')
            ->where('reference', $data['reservation_reference'])
            ->where('user_id', $request->user()->id)
            ->where('statut', 'en_attente')
            ->firstOrFail();

        // Créer la transaction FedaPay
        $transaction = Transaction::create([
            'description'    => "Réservation {$reservation->reference} - Réservia Bénin",
            'amount'         => $reservation->montant_total_fcfa,
            'currency'       => ['iso' => 'XOF'],
            'callback_url'   => config('app.url') . '/api/v1/paiements/webhook',
            'return_url'     => config('app.frontend_url') . "/reservation/confirmation/{$reservation->reference}",
            'customer'       => [
                'firstname' => $reservation->user->prenom,
                'lastname'  => $reservation->user->nom,
                'email'     => $reservation->user->email,
            ],
        ]);

        // Enregistrer le paiement en attente
        Paiement::create([
            'reservation_id'    => $reservation->id,
            'methode'           => $data['methode'],
            'reference_externe' => (string) $transaction->id,
            'montant_fcfa'      => $reservation->montant_total_fcfa,
            'statut'            => 'en_attente',
        ]);

        return response()->json([
            'payment_url'    => $transaction->generateToken()->url,
            'transaction_id' => $transaction->id,
        ]);
    }

    public function webhook(Request $request): JsonResponse
    {
        // Vérifier la signature FedaPay
        $payload = $request->getContent();
        $signature = $request->header('X-FEDAPAY-SIGNATURE');

        // En production, vérifier la signature avec le secret webhook FedaPay
        $data = $request->all();

        if (($data['name'] ?? '') === 'transaction.approved') {
            $transactionId = $data['entity']['id'] ?? null;

            $paiement = Paiement::where('reference_externe', (string) $transactionId)->first();

            if ($paiement && $paiement->statut === 'en_attente') {
                $paiement->update(['statut' => 'reussi', 'paye_le' => now()]);

                $reservation = $paiement->reservation;
                $reservation->update(['statut' => 'confirmee']);

                // Envoyer l'email de confirmation en arrière-plan
                EnvoyerConfirmationEmail::dispatch($reservation);
            }
        }

        return response()->json(['received' => true]);
    }

    public function statut(Request $request, Paiement $paiement): JsonResponse
    {
        return response()->json(['statut' => $paiement->statut, 'paye_le' => $paiement->paye_le]);
    }
}
