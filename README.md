# KYC Onboarding API

This is a Know Your Customer (KYC) API that checks each applicant's information to help prevent fraud, using sanctions list matching and country risk assessment.

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

## Tech Stack

- Node.js + TypeScript
- Express
- Zod (validation)
- Prisma + PostgreSQL (Neon)

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