# Siscom ISP Credit Scoring & Loan Eligibility Portal

Zero-registration B2B lending pre-qualification for Kenyan ISPs. Upload a 6-month M-Pesa / Till / Paybill PDF, get an instant cash-flow score (up to **3×** average monthly net cash flow), and submit a loan request for Siscom customer care follow-up.

## Stack

- Next.js 15+ (App Router, TypeScript)
- PostgreSQL 16 via `pg`
- Docker Compose (`web`, `db`, `cleanup`)
- Design language inspired by Basis Theory (paper canvas, aqua conversion controls, layered technical diagrams)

## Quick start (local)

```bash
cp .env.example .env.local
# edit secrets if needed

docker compose up -d db
npm install
npm run dev
```

Open [http://localhost:3010](http://localhost:3010).

Admin portal: [http://localhost:3010/admin/login](http://localhost:3010/admin/login)  
Default local credentials come from `.env.local` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`).

Local Postgres is mapped to host port **5460** (see `docker-compose.yml`) so it does not clash with other databases.

Use **Try with sample data** on the landing page when `ALLOW_DEMO_ASSESSMENT=true` to walk the full flow without a real statement.

## Production (Docker)

```bash
cp .env.example .env
# set POSTGRES_PASSWORD, SESSION_SECRET, ADMIN_PASSWORD

docker compose --env-file .env up --build -d
```

App: [http://localhost:3010](http://localhost:3010)

## User flow

1. `/` — upload statement + ODPC consent  
2. `/result/[assessmentId]` — qualification result + loan slider  
3. `/apply/[assessmentId]` — ISP business details  
4. `/confirmation/[referenceCode]` — handoff receipt (`SIS-ISP-XXXXXX`)  
5. `/admin` — customer care review

## Security notes

- Raw PDFs are parsed in memory only (never written to disk)
- Assessment pages are bound to an HTTP-only `siscom_assessment_token` cookie
- Unconverted assessments expire after 24 hours (cleanup container purges them daily)
- Upload endpoint is rate-limited to 5 requests / IP / hour
