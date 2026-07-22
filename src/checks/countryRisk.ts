import { type Address } from "./address.schema.js";

const HIGH_RISK_COUNTRIES: string[] = ['KP', 'IR', 'MM', 'AF', 'SY'];

export function hasCountryRisk(nationality: string, address: Address): boolean {
    return HIGH_RISK_COUNTRIES.includes(nationality) || HIGH_RISK_COUNTRIES.includes(address.country);
}