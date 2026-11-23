# NET FORGE v0.40.53 Cloud Save integration

This is an example backend module, not a deployed service. Keep the Laravel API server private; deploy only the PWA ZIP to public GitHub Pages.

The existing /api/v1/player-sync GET and PUT endpoints use optimistic revision checks. Frontend now requires a compare step and rechecks the revision before upload/restore. Server MUST retain HTTP 409 behavior for stale revisions.

Test with two authenticated browser sessions for the SAME user: both GET revision N, one PUT revision N -> N+1, second PUT revision N must return 409. Verify GET after the second request still contains only the first write. Test unauthorized users (401), different account data isolation, malformed payload (422), and CORS for GitHub Pages origin.

Do not use public client-submitted XP as trusted achievement history; validate authoritative mission events server-side before issuing competitive badges.
