import express from 'express';
import { runKycCheck, type Applicant } from './kyc/runKycCheck.js';
import { type SanctionedPerson } from './checks/sanctions.js'

const app = express();

app.use(express.json());

const sanctionsList: SanctionedPerson[] = [
    { name: 'William Nibodeau', dateOfBirth: new Date(1983, 11, 19) },
    { name: 'Jacques Bret', dateOfBirth: new Date(1999, 1, 20) }
]

app.post('/kyc/verify', (req, res) => {
    const applicant: Applicant = req.body;
    applicant.dateOfBirth = new Date(applicant.dateOfBirth);
    const result = runKycCheck(applicant, sanctionsList);

    res.json(result);
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});