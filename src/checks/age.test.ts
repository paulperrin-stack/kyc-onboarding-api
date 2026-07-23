import { describe, it, expect } from 'vitest';
import { calculateAge, isOfLegalAge } from './age.js';

describe('calculateAge', () => {
    it('calculates age correctly for a birthday that already passed this year', () => {
        const result = calculateAge(new Date(2000, 0, 1));
        expect(result).toBe(26);
    });
    
    it('calculates age correctly for a birthday that has NOT happened yet this year', () => {
        const result = calculateAge(new Date(1990, 11, 25));
        expect(result).toBe(35);
    });
});

describe('isOfLegalAge', () => {
    it('returns true when age is 18 or older', () => {
        const result = isOfLegalAge(20);
        expect(result).toBe(true);
    });

    it('returns false when age is 17 or younger', () => {
        const result = isOfLegalAge(14);
        expect(result).toBe(false);
    });
});