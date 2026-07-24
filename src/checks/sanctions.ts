export interface SanctionedPerson {
    name: string;
    dateOfBirth: Date;
}

export interface PersonInfo {
    fullName: string;
    dateOfBirth: Date;
}

export interface SanctionsMatchResult {
    nameMatch: boolean;
    dobMatch: boolean;
}

export function isOnSanctionsList(personInfo: PersonInfo, sanctionsList: SanctionedPerson[]): SanctionsMatchResult {
    const nameMatch = sanctionsList.some(function (sanctionedPerson) {
        return personInfo.fullName.toLowerCase().trim() === sanctionedPerson.name.toLowerCase().trim();
    });
    const dobMatch = sanctionsList.some(function (sanctionedPerson) {
        return (
            personInfo.dateOfBirth.getUTCFullYear() === sanctionedPerson.dateOfBirth.getUTCFullYear() &&
            personInfo.dateOfBirth.getUTCMonth() === sanctionedPerson.dateOfBirth.getUTCMonth() &&
            personInfo.dateOfBirth.getUTCDate() === sanctionedPerson.dateOfBirth.getUTCDate()
        )
    });

    return { nameMatch, dobMatch };
}