import express from 'express';
import { runKycCheck } from './kyc/runKycCheck.js';
import { applicantSchema } from './kyc/applicant.schema.js';
import { type SanctionedPerson } from './checks/sanctions.js';

const app = express();

app.use(express.json());

const sanctionsList: SanctionedPerson[] = [
    { name: 'William Nibodeau', dateOfBirth: new Date(1983, 11, 19) },
    { name: 'Jacques Bret', dateOfBirth: new Date(1999, 1, 20) },
];

app.post('/kyc/verify', (req, res) => {
    const result = applicantSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }

    const applicant = result.data;
    const kycResult = runKycCheck(applicant, sanctionsList);

    res.json(kycResult);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});