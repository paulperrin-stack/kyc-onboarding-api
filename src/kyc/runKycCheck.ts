import { calculateAge, isOfLegalAge } from "../checks/age.js";
import { hasCountryRisk, type Address } from "../checks/countryRisk.js";
import { isOnSanctionsList, type PersonInfo, type SanctionedPerson } from "../checks/sanctions.js";
import { makeDecision, explainDecision, type Verdict } from "./decision.js";

export interface Applicant {
    fullName: string;
    dateOfBirth: Date;
    nationality: string;
    address: Address;
    middleName?: string;
}

export function runKycCheck(applicant: Applicant, sanctionsList: SanctionedPerson[]): KycResult {
    const age = calculateAge(applicant.dateOfBirth);
    const legalAge = isOfLegalAge(age);
    const countryRisk = hasCountryRisk(applicant.nationality, applicant.address);
    const { nameMatch, dobMatch } = isOnSanctionsList(applicant, sanctionsList);
    const decision = makeDecision(legalAge, nameMatch, dobMatch, countryRisk);
    const motif = explainDecision(legalAge, nameMatch, dobMatch, countryRisk);

    return { age, legalAge, countryRisk, nameMatch, dobMatch, decision, motif };
}

interface KycResult {
  age: number;
  legalAge: boolean;
  countryRisk: boolean;
  nameMatch: boolean;
  dobMatch: boolean;
  decision: Verdict;
  motif: string;
}