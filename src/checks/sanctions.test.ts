import { describe, it, expect } from 'vitest';
import { isOnSanctionsList } from './sanctions.js';

describe('isOnSanctionsList', () => {
    it('returns true for both nameMatch and dobMatch when name and DOB both match', () => {
        const personInfo = { fullName: "William Nibodeau", dateOfBirth: new Date(1983, 11, 19) };
        const sanctionsList = [{ name: "William Nibodeau", dateOfBirth: new Date(1983, 11, 19) }];

        const result = isOnSanctionsList(personInfo, sanctionsList);

        expect(result).toEqual({ nameMatch: true, dobMatch: true });
    });

    it('returns nameMatch true and dobMatch false when name matches but DOB does not', () => {
        const personInfo = { fullName: "William Nibodeau", dateOfBirth: new Date(2003, 3, 10) };
        const sanctionsList = [{ name: "William Nibodeau", dateOfBirth: new Date(1983, 11, 19)}];

        const result = isOnSanctionsList(personInfo, sanctionsList);

        expect(result).toEqual({ nameMatch: true, dobMatch: false });
    })
})