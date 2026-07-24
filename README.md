# KYC Onboarding API

This is a Know Your Customer (KYC) API that checks each applicant's information to help prevent fraud, using sanctions list matching and country risk assessment.

**Live demo:** `https://kyc-onboarding-api.onrender.com` (hosted on Render's free tier — the first request after a period of inactivity may take up to a minute while the service wakes up)

Example request:
```bash
curl -X POST https://kyc-onboarding-api.onrender.com/kyc/verify \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Jane Doe", "dateOfBirth": "1990-01-01", "nationality": "FR", "address": {"street": "1 Rue Test", "city": "Paris", "country": "FR"}, "email": "jane@example.com", "phone": "0600000000"}'
```

## How It Works

The API runs four checks on each applicant:

1. **Age check** — confirms the applicant is of legal age (18+).
2. **Country risk check** — checks whether the applicant's nationality or address is in a high-risk country.
3. **Sanctions check** — checks whether the applicant's name (and date of birth) matches an entry on a sanctions list.
4. **Decision logic** — combines the results of the above checks into one of three outcomes:
   - **FAIL** — underage, or a confirmed sanctions match (name + date of birth both match)
   - **NEEDS_REVIEW** — a partial match (name matches but date of birth doesn't) or a country-risk flag
   - **PASS** — no risk factors found

Every verification attempt is saved to the database, linked to the applicant, so there's a full history of every decision ever made — not just the latest one.

## Key Design Decisions

**Sanctions matching uses exact match, not fuzzy matching.**
I intentionally kept the matching system simple, using exact name matching. If a name matches but the date of birth doesn't, the system can't be sure it's the same person, so it sends the case for human review instead of guessing. A production system would likely add fuzzy/phonetic matching to reduce false positives.

**Country risk checks both nationality and address.**
Country risk checks both nationality and address, flagging if either is high-risk. An applicant could be a national of a low-risk country but currently live in a high-risk one, or the reverse — checking only one field would miss real risk.

**Age gets an automatic FAIL, not review.**
Legal age is a hard legal requirement, not a judgment call — there's no ambiguity to send to a human, unlike sanctions or country-risk matches.

**`Applicant.email` is unique, but `SanctionedPerson.name` is not.**
Email is unique per applicant — it identifies returning users. Names aren't unique, since different people (including different sanctioned individuals) can share the same name.

**Dates are always compared in UTC, never local time.**
Early versions of this project compared dates using local timezone components. This worked fine locally, but broke in CI, because the machine seeding the test data (my own computer, in a different timezone) and the machine running the tests (GitHub's servers, in UTC) disagreed on what date a given timestamp represented — a date could shift by a day depending on which timezone read it. Every date in this project is now created and compared using UTC explicitly, so the result is the same no matter which machine or timezone runs the code.

## Tech Stack

- Node.js + TypeScript
- Express
- Zod (validation)
- Prisma + PostgreSQL (Neon)
- Vitest + Supertest (testing)
- GitHub Actions (CI)

## Testing

The project has two layers of tests:

- **Unit tests** for the pure logic functions (age calculation, country risk, sanctions matching, decision logic) — no database needed, fast.
- **Integration tests** for the actual `/kyc/verify` route, using Supertest — these hit a real, separate test database.

Tests run against a dedicated Neon database, kept completely separate from the production database, so running tests never touches real data. Tests also run automatically in CI on every push, via GitHub Actions.

To run tests locally:
1. Set up a second Neon database for testing
2. Create a `.env.test` file with its `DATABASE_URL`
3. `npx dotenv-cli -e .env.test -- npx prisma migrate dev`
4. `npx dotenv-cli -e .env.test -- npx tsx prisma/seed.ts`
5. `npm test`

## Running Locally

1. Clone the repo
2. `npm install`
3. Set up a `.env` file with `DATABASE_URL` (PostgreSQL connection string)
4. `npx prisma migrate dev`
5. `npx tsx prisma/seed.ts` (optional — adds sample sanctions data)
6. `npx tsx src/index.ts`

## Future Improvements

- Fuzzy/phonetic name matching to reduce false positives
- Ongoing monitoring — automatically re-screen applicants if the sanctions list is updated after their initial check
- Additional identifying fields (e.g. address, nationality) in sanctions matching for higher confidence