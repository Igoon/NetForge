# NET FORGE v0.40.63 — Google Login Checklist

1. Publish frontend via HTTPS (GitHub Pages): https://igoon.github.io/NetForge/.
2. Google Cloud OAuth Client: Web application, Authorized JavaScript origins includes exactly https://igoon.github.io (no path).
3. Backend responds GET /api/v1/auth/config with {"enabled":true,"googleClientId":"...apps.googleusercontent.com"} and appropriate CORS headers.
4. POST /api/v1/auth/google verifies Google ID token at server (signature, issuer, audience/Client ID, expiration), binds to user by Google `sub`, and returns accessToken, refreshToken, expiresIn.
5. GET /api/v1/me with Authorization Bearer access token must return valid player id, name; POST /api/v1/auth/refresh returns rotated token pair, and POST /api/v1/auth/logout revokes refresh token.
6. Verify CORS allowlist of https://igoon.github.io, allow Authorization and Content-Type headers; ensure TLS and API accessible publicly (not just Tailscale).
7. Login must show verified only after /me succeeds. Verify failed /me never stores a new refresh token. Check session expiration and logout.
8. Player Cloud Save remains manual; test compare, upload, retrieve, conflict detection with two devices.
9. Avoid placing OAuth Client Secret in frontend. Do not log Google credential, access tokens or refresh tokens.

The bundled Laravel feedback/backend example DOES NOT implement OAuth. Implement auth in the existing backend separately. No live Google account or production endpoint was used for these tests.
