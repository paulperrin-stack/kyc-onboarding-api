import { describe, it, expect } from 'vitest';
import { makeDecision, explainDecision } from './decision.js';

describe('makeDecision', () => {
    it('returns FAIL when name and DOB both match sanctions list', () => {
        const result = makeDecision(true, true, true, false);
        expect(result).toBe("FAIL");
    });

    it('returns NEEDS_REVIEW when name matches and DOB does not', () => {
        const result = makeDecision(true, true, false, false);
        expect(result).toBe("NEEDS_REVIEW");
    });

    it('returns NEEDS_REVIEW when only countryRisk matches', () => {
        const result = makeDecision(true, false, false, true);
        expect(result).toBe("NEEDS_REVIEW");
    });

    it('returns PASS when nothing triggered', () => {
        const result = makeDecision(true, false, false, false);
        expect(result).toBe("PASS");
    });

    it('returns FAIL when applicant is underage, regardless of other checks', () => {
        const result = makeDecision(false, false, false, false);
        expect(result).toBe("FAIL");
    });
});

describe('explainDecision', () => {
    it('explains underage FAIL', () => {
        const result = explainDecision(false, false, false, false);
        expect(result).toBe('This person is not of legal age');
    });

    it('explains sanctions match FAIL', () => {
        const result = explainDecision(true, true, true, false);
        expect(result).toBe("This person's name and date of birth matched the sanctions list.");
    });

    it('explains name-only match NEEDS_REVIEW', () => {
        const result = explainDecision(true, true, false, false);
        expect(result).toBe(
        "This person's name matches the sanctions list, but their date of birth does not. Therefore, a review of their case is necessary."
        );
    });

    it('explains country risk NEEDS_REVIEW', () => {
        const result = explainDecision(true, false, false, true);
        expect(result).toBe(
        "This person's country of residence presents a risk linked to one of the countries concerned."
        );
    });

    it('explains PASS', () => {
        const result = explainDecision(true, false, false, false);
        expect(result).toBe('No risk factors identified; applicant meets all KYC requirements.');
    });
});