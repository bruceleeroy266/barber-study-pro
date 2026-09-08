# ASCYN PRO — NABBA Offline Demo Setup (VERIFIED)

**Purpose:** Run the full NABBA demo on a booth laptop with **zero internet**.
**Method:** production build (`npm run build`) → `npm start` → `http://localhost:3000/demo`.
**Verified:** 2026-09-08 — fresh clone + placeholder env → build PASS, all key routes HTTP 200, zero external assets in rendered demo HTML (evidence in §7).
**Do NOT use:** `npx next export` / static export — invalid on Next 16 and unnecessary.
**Founder directive (2026-09-08):** the demo must NOT rely on conference Wi-Fi. This offline build is the primary booth path; production (`https://ascynpro.com/demo`) is the secondary path only when internet is available.

---

## 1. Why placeholder env is required

A fresh clone will **not build** without environment variables:

- `src/app/api/email/route.ts` creates a service-role Supabase client at module scope → throws during build if `SUPABASE_SERVICE_ROLE_KEY` is absent.
- Env validation (`src/lib/demo-helpers.ts` → `diagnoseSupabaseConfig`) requires:
  - `NEXT_PUBLIC_SUPABASE_URL` — starts with `https://`, and must NOT contain `your-project` or `example.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — must be **longer than 20 characters**
- In production builds, unconfigured Supabase throws loudly instead of falling back to mock data (intentional safety design).

Placeholder values satisfy the build. The demo routes (`/demo*`) run entirely on built-in fictional data — no real Supabase is ever contacted.

## 2. One-time setup (per booth laptop)

```bash
# 1. Clone
git clone https://github.com/bruceleeroy266/barber-study-pro.git
cd barber-study-pro

# 2. Create .env.local (placeholder values — verified working 2026-09-08)
cat > .env.local <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=offline-placeholder-anon-key-0000
SUPABASE_SERVICE_ROLE_KEY=offline-placeholder-service-key
EOF

# 3. Install + build
npm install
npm run build
```

⚠️ The anon key MUST be longer than 20 characters and the URL must not contain `your-project` or `example.supabase.co` — otherwise the build fails with "Supabase is not configured" (see §1). The exact values above are verified; do not shorten them.

## 3. Start the offline demo

```bash
npm start          # serves on http://localhost:3000
# if port 3000 is busy:  npm start -- -p 3100
```

Verified routes (all HTTP 200, 2026-09-08):

- `http://localhost:3000/` — public site
- `http://localhost:3000/demo`
- `http://localhost:3000/demo/student`
- `http://localhost:3000/demo/instructor`
- `http://localhost:3000/pilot`
- `http://localhost:3000/contact`

## 4. Booth laptop installation & test procedure — DO BEFORE DEPARTURE

On **each** booth laptop (1–2):

1. [ ] Complete §2 setup (clone → `.env.local` → `npm install` → `npm run build`).
2. [ ] `npm start`; confirm `http://localhost:3000/demo` loads.
3. [ ] **Wi-Fi OFF test:** disable Wi-Fi entirely → hard-refresh → run the full golden path:
   `/demo` → Student → Targeted Review → Scalp Disorders & Infections → Knowledge Check → Results → Instructor Overview/Roster.
   Every screen must render with zero network. (Locked demo is covered by 13/13 vitest + fresh-clone route verification; this test proves it on the actual event hardware.)
4. [ ] Leave Wi-Fi off for the booth. The demo runs from localhost only.
5. [ ] Browser prep: bookmark `http://localhost:3000/demo`; disable sleep/screen-lock for event hours (laptop plugged in).
6. [ ] External display: connect and verify the looping promo/demo video plays continuously (video = external asset, founder-verified separately — do not recreate).

### Day-of startup (5 minutes)

1. [ ] Power on laptop, plug into power strip.
2. [ ] `cd barber-study-pro && npm start`
3. [ ] Open browser → `http://localhost:3000/demo`
4. [ ] Start looping video on external display.
5. [ ] Confirm QR board/stands placed; paper lead sheets + pens on table.

## 5. What does NOT work offline (by design)

- `/demo/request` (demo request form) — needs internet.
- NABBA lead capture form + `/admin/nabba/leads` — needs internet (Supabase).
- → **Fallback:** paper lead-capture sheets at the booth; enter leads into the system when connectivity returns (post-event step in `NABBA_BOOTH_CHECKLISTS.md`).

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Build fails: `[ASCYN PRO] Server ERROR: Supabase is not configured` | `.env.local` missing, anon key ≤20 chars, or URL contains `your-project`/`example.supabase.co` | Recreate `.env.local` exactly as in §2 |
| Build fails: `Service role client is not configured` | `SUPABASE_SERVICE_ROLE_KEY` missing | Recreate `.env.local` exactly as in §2 |
| `npm start` fails: port in use | Another server on :3000 | `npm start -- -p 3100` and use that port |
| Demo page errors offline | Dev server (`npm run dev`) used instead of production build | Stop it; run `npm run build`, then `npm start` |

## 7. Verification evidence (2026-09-08)

- Fresh `git clone` → no env → build **FAILS** ("Supabase is not configured"; diagnostic `keyLongEnough: false`) — confirms §1.
- Same clone + placeholder `.env.local` (§2 values) → `npm install` (530 packages) → `npm run build` **PASS** → `npm start` → GET `/`, `/demo`, `/demo/student`, `/demo/instructor`, `/pilot`, `/contact` all **200**.
- Rendered `/demo/student` HTML contains **zero external asset URLs** (no CDN/font/script/image fetches) — fully self-contained.
- Prior full audit: local production build serves demo byte-identical to production (see workspace `nabba-verification/repo-audit.md`).
