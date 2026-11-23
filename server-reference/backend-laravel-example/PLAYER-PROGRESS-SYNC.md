# NET FORGE v0.40.52 — Player Progress Sync

This is an integration example, not deployed production backend.

- Add the migration/controller/routes to the existing Laravel app. The frontend still connects using the URL configured in Settings > Official Account.
- GET `/api/v1/player-sync` returns `{revision, records, updated_at}`.
- PUT `/api/v1/player-sync` requires `{revision, records}` and responds with a new revision; HTTP 409 means re-read before saving. Require `auth:sanctum`, rate limiting, HTTPS and restricted CORS.
- There is **no background auto-sync**. Download and upload require deliberate player actions. Before restore the frontend downloads a backup of the local data.
- Rating and access tokens are excluded. The backend identifies players from the authenticated session, never from user_id in the request.
- This storage is a convenience mirror of local saves. It does **not** award trusted XP/badges or mark official achievements complete. For official leaderboards recompute validated results server-side.
- Test conflicting updates from two devices; also test login/logout, empty records, corrupted saves and storage quota errors before production use.
- Run database migration after taking a database backup. The main game frontend and auth provider are not bundled into this Laravel example.
