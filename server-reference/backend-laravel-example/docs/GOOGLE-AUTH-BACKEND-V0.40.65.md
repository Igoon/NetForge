# NET FORGE 0.40.65 — Google login backend installation (example, not deployed)

## Prerequisites
- Laravel backend reachable via HTTPS and configured with Laravel Sanctum, migrations, and a standard App\Models\User with name, email, password fields. Requires `HasApiTokens` trait on User.
- Install `composer require google/apiclient` and `composer require laravel/sanctum` as applicable to your Laravel version.
- Configure `config/services.php` with `'netforge_google' => ['client_id' => env('NETFORGE_GOOGLE_CLIENT_ID')],`. Set `NETFORGE_GOOGLE_CLIENT_ID` in backend `.env`. Never put a Client Secret in the frontend.
- Configure `config/cors.php` to allow https://igoon.github.io for /api/*, with methods GET, POST, PUT, PATCH and headers Content-Type, Authorization, Accept. Review Sanctum token abilities, retention, per-user throttling.
- Review and copy controller + migration into Laravel app. Merge `routes-api-v1-snippet.php` into routes/api.php WITHOUT duplicating /api or /v1 prefixes. Run `php artisan migrate`, `php artisan config:clear` after backup.
- Google Cloud: create OAuth Client ID type Web application and add Authorized JavaScript origin `https://igoon.github.io` (NO /NetForge path); register app and consent screen as needed.
- Frontend: enter actual URL `https://YOUR-API-DOMAIN/api/v1` in Settings/Backend API. GitHub Pages does not run PHP.

## Contract
- GET /api/v1/auth/config: enabled and googleClientId
- POST /api/v1/auth/google: credential (Google GIS ID token) -> `{accessToken, refreshToken, expiresIn}`. Backend verifies token with Google and binds identity to Google `sub` (never email alone).
- GET /api/v1/me: Authorization Bearer **Sanctum** accessToken -> `{id,name,email}`.
- POST /api/v1/auth/refresh: refreshToken -> rotated pair; securely hashed refresh token in DB.
- POST /api/v1/auth/logout: refreshToken -> revokes refresh token. Current access token remains valid until its short expiry.
- PUT/GET /api/v1/player-sync protected by auth:sanctum as before; Cloud Save is opt-in.

## Security limitations / production checklist
- Example has not been deployed or tested against a real Google account. Test invalid signature, wrong audience, expired token, CORS, duplicate account, token rotation, database rollback, and Cloud Save across devices.
- Logout here revokes refresh, but **does not immediately revoke existing access token** (up to 15 minutes). For immediate revocation, add an authenticated logout endpoint and delete currentAccessToken as appropriate.
- Refresh sessions are single-use, DB-locked, and hashed. Concurrent refresh from multiple tabs may invalidate one request; retry login on an expired session.
- Use a dedicated DB/account role configuration if the application requires specific tenancy rules. Protect the API with TLS, rate limits, monitoring, backups and HTTPS security headers. Set retention/deletion for player profiles.
- Existing email accounts are not auto-linked; admins must implement a verified linking workflow. Standard User email field must be unique.
- Access tokens are stored in sessionStorage and refresh tokens in localStorage by the current frontend; this is susceptible to XSS and is not suitable for high-assurance authentication without further hardening.
- The endpoint examples require the `google/apiclient` dependency, a functioning Laravel app and Sanctum setup. The ZIP is NOT a ready-to-run backend server.
