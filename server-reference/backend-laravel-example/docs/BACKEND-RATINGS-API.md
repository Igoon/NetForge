# NET FORGE — Proposed ratings API (not implemented by this frontend package)

Frontend integration currently supports **local ratings only**, deliberately avoiding fabricated aggregate scores. To support community ratings, implement authenticated endpoints in the NET FORGE backend:

- `GET /ratings/summary` → `{ "average": 4.5, "count": 20, "distribution": {"1":0,"2":1,"3":2,"4":3,"5":14} }` (example only, not real ratings)
- `GET /ratings/me` → existing viewer's rating or `null` (requires authenticated user)
- `PUT /ratings/me` with JSON `{ "rating": 1..5, "category": "overall|learning|interface|missions|performance", "comment": "max 600 characters" }`

Backend requirements: verify authentication server-side, rate-limit writes, enforce one rating per account (upsert), validate and sanitize user input, configure CORS allowlist, defend against CSRF when cookie-authenticated, store timestamps, and moderate public reviews. Return aggregates only after reliable storage is deployed. Do not expose tokens in GitHub Pages or bundle secrets into the frontend.

GitHub Pages is static hosting and does not itself provide database or API execution. The NET FORGE frontend already contains optional integrations for a separately deployed API for accounts and Guided Lab progress; this archive does not contain that backend's source.

## v0.40.50 feedback additions
See backend-laravel-example/README.md for separate bug-report and admin moderation endpoints.
