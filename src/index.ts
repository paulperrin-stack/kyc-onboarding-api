import express, { type Request, type Response, type NextFunction } from 'express';
import { runKycCheck } from './kyc/runKycCheck.js';
import { applicantSchema } from './kyc/applicant.schema.js';
import { type SanctionedPerson } from './checks/sanctions.js';
import { prisma } from './lib/prisma.js';

const app = express();

app.use(express.json());

app.post('/kyc/verify', async (req, res) => {
    const result = applicantSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    const applicant = result.data;
    const sanctionsList = await prisma.sanctionedPerson.findMany();
    const kycResult = runKycCheck(applicant, sanctionsList);

    res.json(kycResult);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});