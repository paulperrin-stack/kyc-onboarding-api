export type Verdict = "PASS" | "FAIL" | "NEEDS_REVIEW";

export function makeDecision(legalAge: boolean, nameMatch: boolean, dobMatch: boolean, countryRisk: boolean): Verdict {
    if (!legalAge) {
        return "FAIL";
    } else if (nameMatch && dobMatch) {
        return "FAIL";
    } else if (nameMatch && !dobMatch) {
        return "NEEDS_REVIEW";
    } else if (countryRisk) {
        return "NEEDS_REVIEW";
    } else {
        return "PASS";
    }
}

export function explainDecision(legalAge: boolean, nameMatch: boolean, dobMatch: boolean, countryRisk: boolean): string {
    if (!legalAge) {
        return "This person is not of legal age";
    } else if (nameMatch && dobMatch) {
        return "This person's name and date of birth matched the sanctions list.";
    } else if (nameMatch && !dobMatch) {
        return "This person's name matches the sanctions list, but their date of birth does not. Therefore, a review of their case is necessary.";
    } else if (countryRisk) {
        return "This person's country of residence presents a risk linked to one of the countries concerned.";
    } else {
        return "No risk factors identified; applicant meets all KYC requirements.";
    }
}