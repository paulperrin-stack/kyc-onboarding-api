import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from './app.js';

describe('POST /kyc/verify', () => {
    it('returns PASS for a clean applicant', async () => {
        const response = await request(app)
        .post('/kyc/verify')
        .send({
            fullName: 'Jane Doe',
            dateOfBirth: '1990-01-01',
            nationality: 'FR',
            address: { street: '1 Rue Test', city: 'Paris', country: 'FR' },
            email: 'jane-test@example.com',
            phone: '0600000000'
        });
        
        expect(response.status).toBe(200);
        expect(response.body.decision).toBe('PASS');
    });

    it('returns 400 when required fields are missing', async () => {
        const response = await request(app).post('/kyc/verify').send({ fullName: 'Test Person' });
        expect(response.status).toBe(400);
    });

    it('returns FAIL for a risk applicant', async () => {
        const response = await request(app)
        .post('/kyc/verify')
        .send({
            fullName: 'William Nibodeau',
            dateOfBirth: '1983-12-19',
            nationality: 'FR',
            address: { street: '1 Rue Test', city: 'Paris', country: 'FR' },
            email: 'william-test@example.com',
            phone: '0600000000'
        });

        expect(response.status).toBe(200);
        expect(response.body.decision).toBe('FAIL');
    });
});