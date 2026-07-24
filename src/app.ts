import express, { type Request, type Response, type NextFunction } from 'express';
import { runKycCheck } from './kyc/runKycCheck.js';
import { applicantSchema } from './kyc/applicant.schema.js';
import { type SanctionedPerson } from './checks/sanctions.js';
import { prisma } from './lib/prisma.js';

export const app = express();

app.use(express.json());

app.post('/kyc/verify', async (req, res) => {
    const result = applicantSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    const applicant = result.data;

    const savedApplicant = await prisma.applicant.upsert({
        where: { email: applicant.email },
        update: {
            fullName: applicant.fullName,
            middleName: applicant.middleName ?? null,
            dateOfBirth: applicant.dateOfBirth,
            nationality: applicant.nationality,
            addressStreet: applicant.address.street,
            addressCity: applicant.address.city,
            addressCountry: applicant.address.country,
            phone: applicant.phone,
        },
        create: {
            email: applicant.email,
            fullName: applicant.fullName,
            middleName: applicant.middleName ?? null,
            dateOfBirth: applicant.dateOfBirth,
            nationality: applicant.nationality,
            addressStreet: applicant.address.street,
            addressCity: applicant.address.city,
            addressCountry: applicant.address.country,
            phone: applicant.phone,
        },
    });

    const sanctionsList = await prisma.sanctionedPerson.findMany();
    const kycResult = runKycCheck(applicant, sanctionsList);

    const savedKycCheck = await prisma.kycCheck.create({
        data: {
            age: kycResult.age,
            legalAge: kycResult.legalAge,
            countryRisk: kycResult.countryRisk,
            nameMatch: kycResult.nameMatch,
            dobMatch: kycResult.dobMatch,
            decision: kycResult.decision,
            motif: kycResult.motif,
            applicantId: savedApplicant.id,
        }
    })

    res.json(kycResult);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
});