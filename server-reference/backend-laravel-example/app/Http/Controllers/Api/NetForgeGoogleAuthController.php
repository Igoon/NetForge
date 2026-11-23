<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Google\Client as GoogleClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/** Example integration for a standard Laravel User model + Sanctum. Deploy only after reviewing migrations and policies. */
class NetForgeGoogleAuthController extends Controller
{
    private function clientId(): string
    {
        return trim((string) config('services.netforge_google.client_id', ''));
    }

    public function config()
    {
        $clientId = $this->clientId();
        return response()->json(['enabled' => $clientId !== '', 'googleClientId' => $clientId])
            ->header('Cache-Control', 'no-store');
    }

    private function sessionPair(User $user): array
    {
        // Sanctum returns "id|random" as plainTextToken, with a hash saved server-side.
        $access = $user->createToken('netforge-access', ['*'], now()->addMinutes(15));
        $refresh = 'nfr_' . bin2hex(random_bytes(32));
        DB::table('netforge_refresh_sessions')->insert([
            'user_id' => $user->getKey(),
            'token_hash' => hash('sha256', $refresh),
            'expires_at' => now()->addDays(30),
            'created_at' => now(), 'updated_at' => now(),
        ]);
        return ['accessToken' => $access->plainTextToken, 'refreshToken' => $refresh, 'expiresIn' => 900];
    }

    public function google(Request $request)
    {
        $input = $request->validate(['credential' => 'required|string|max:8192']);
        $clientId = $this->clientId();
        if ($clientId === '') return response()->json(['error' => 'Google Login belum dikonfigurasi.'], 503);

        // google/apiclient verifyIdToken checks token signature, expiry, issuer and audience.
        try {
            $google = new GoogleClient(['client_id' => $clientId]);
            $claims = $google->verifyIdToken($input['credential']);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Verifikasi Google gagal.'], 401);
        }
        if (!is_array($claims) || !hash_equals($clientId, (string) ($claims['aud'] ?? '')) ||
            !in_array($claims['iss'] ?? '', ['accounts.google.com', 'https://accounts.google.com'], true) ||
            empty($claims['sub']) || empty($claims['email']) || ($claims['email_verified'] ?? false) !== true) {
            return response()->json(['error' => 'Identitas Google tidak valid atau email belum terverifikasi.'], 401);
        }
        $sub = (string) $claims['sub'];
        $email = mb_strtolower(trim((string) $claims['email']));
        $name = trim((string) ($claims['name'] ?? 'NET FORGE Player'));
        if (strlen($sub) > 255 || strlen($email) > 255) return response()->json(['error' => 'Identitas Google tidak valid.'], 401);

        try {
            $user = DB::transaction(function () use ($sub, $email, $name) {
                $identity = DB::table('netforge_google_identities')->where('google_sub', $sub)->lockForUpdate()->first();
                if ($identity) {
                    $user = User::find($identity->user_id);
                    if (!$user) throw ValidationException::withMessages(['account' => 'Akun terhubung tidak ditemukan. Hubungi admin.']);
                    return $user;
                }
                // Never silently take over an existing email/password account by matching email alone.
                if (User::where('email', $email)->exists()) {
                    throw ValidationException::withMessages(['account' => 'Email sudah dipakai akun lain. Minta admin menghubungkan akun secara aman.']);
                }
                $user = new User();
                $user->name = mb_substr($name ?: 'NET FORGE Player', 0, 255);
                $user->email = $email;
                $user->password = Hash::make(Str::random(64));
                $user->save();
                DB::table('netforge_google_identities')->insert([
                    'user_id' => $user->getKey(), 'google_sub' => $sub,
                    'created_at' => now(), 'updated_at' => now(),
                ]);
                return $user;
            });
        } catch (ValidationException $e) {
            return response()->json(['error' => collect($e->errors())->flatten()->first()], 409);
        }
        return response()->json($this->sessionPair($user))->header('Cache-Control', 'no-store');
    }

    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json(['id' => $user->getKey(), 'name' => $user->name, 'email' => $user->email])
            ->header('Cache-Control', 'no-store');
    }

    public function refresh(Request $request)
    {
        $data = $request->validate(['refreshToken' => ['required','regex:/^nfr_[a-f0-9]{64}$/']]);
        $hash = hash('sha256', $data['refreshToken']);
        return DB::transaction(function () use ($hash) {
            $row = DB::table('netforge_refresh_sessions')->where('token_hash', $hash)->lockForUpdate()->first();
            if (!$row || now()->greaterThanOrEqualTo($row->expires_at)) {
                return response()->json(['error' => 'Refresh token tidak valid atau kedaluwarsa.'], 401);
            }
            $user = User::find($row->user_id);
            if (!$user) return response()->json(['error' => 'Akun tidak ditemukan.'], 401);
            DB::table('netforge_refresh_sessions')->where('id', $row->id)->delete();
            return response()->json($this->sessionPair($user))->header('Cache-Control', 'no-store');
        });
    }

    public function logout(Request $request)
    {
        $data = $request->validate(['refreshToken' => ['required','regex:/^nfr_[a-f0-9]{64}$/']]);
        $hash = hash('sha256', $data['refreshToken']);
        $row = DB::table('netforge_refresh_sessions')->where('token_hash', $hash)->first();
        // Revoke the exact access token only if it belongs to the owner of the supplied refresh token.
        // Do not permit a bearer token alone to revoke somebody else's refresh session.
        if ($row && $request->bearerToken()) {
            $access = \Laravel\Sanctum\PersonalAccessToken::findToken($request->bearerToken());
            if ($access && $access->tokenable_type === \App\Models\User::class &&
                (int) $access->tokenable_id === (int) $row->user_id && $access->name === 'netforge-access') {
                $access->delete();
            }
        }
        DB::table('netforge_refresh_sessions')->where('token_hash', $hash)->delete();
        // Other already-issued access tokens remain valid until they expire; revoke all devices separately.
        return response()->json(['loggedOut' => true])->header('Cache-Control', 'no-store');
    }
}
