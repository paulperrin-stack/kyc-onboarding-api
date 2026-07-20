const HIGH_RISK_COUNTRIES: string[] = ['KP', 'IR', 'MM', 'AF', 'SY'];

export interface Address {
    street: string;
    city: string;
    country: string;
}

export function hasCountryRisk(nationality: string, address: Address): boolean {
    return HIGH_RISK_COUNTRIES.includes(nationality) || HIGH_RISK_COUNTRIES.includes(address.country);
}