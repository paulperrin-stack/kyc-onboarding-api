import { describe, it, expect } from 'vitest';
import { hasCountryRisk } from './countryRisk.js'

describe('hasCountryRisk', () => {
    it('returns true when nationality is high-risk', () => {
        const result = hasCountryRisk('IR', { street: '1 Rue Test', city: 'Paris', country: 'FR' });
        expect(result).toBe(true);
    });

    it('returns true when address.country is high-risk', () => {
        const result = hasCountryRisk('FR', { street: '3 Street Test', city: 'Risk', country: 'IR' });
        expect(result).toBe(true);
    });

    it('return false when nationality and address is not high-risk', () => {
        const result = hasCountryRisk('FR', { street: '1 Rue Test', city: 'Paris', country: 'FR' });
        expect(result).toBe(false);
    });
});