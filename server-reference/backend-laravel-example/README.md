# NET FORGE v0.40.50 -- example Laravel integration
These backend files are examples, not deployed to a server. Review with your backend developer.

1. Copy controller and migrations to an existing Laravel app. Run `php artisan migrate` after backup.
2. Integrate `routes-api-v1-snippet.php` with your route prefix and authentication middleware. API base expected: HTTPS /api/v1.
3. Define authorization in AppServiceProvider::boot() using Laravel Gate, e.g. `Gate::define('moderate-netforge-feedback', fn ($user) => (bool) $user->is_admin);` ONLY if your user model already has a trustworthy is_admin attribute; use your actual role/permission policy instead. Never grant this Gate to all users.
4. Configure CORS to the exact GitHub Pages origin; verify token authentication and avoid exposing private reports publicly.
5. Test ratings, report submissions, status transitions, moderator authorization, and responses against existing backend.
6. Put only public frontend PWA files in the GitHub Pages root. NEVER deploy controllers, migrations, secrets or .env into publicly served folders.

Public: GET /api/v1/ratings/summary
Authenticated: GET/PUT /api/v1/ratings/me, POST /api/v1/feedback/reports, GET /api/v1/feedback/reports/me
Admin authorized: GET /api/v1/admin/feedback/reports, PATCH /api/v1/admin/feedback/reports/{id}; GET /api/v1/admin/feedback/ratings, PATCH /api/v1/admin/feedback/ratings/{id}

These examples do not constitute a production-hardened moderation system; consider abuse filters, retention policy, observability, and rate limiting tuned to deployment.
