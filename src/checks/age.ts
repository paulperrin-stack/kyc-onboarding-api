export function calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    const birthYear = dateOfBirth.getFullYear();
    const birthMonth = dateOfBirth.getMonth();
    const birthDay = dateOfBirth.getDate();

    let age = todayYear - birthYear;

    if (todayMonth < birthMonth) {
        age = age - 1;
    } else if (todayMonth == birthMonth && todayDay < birthDay) {
        age = age - 1;
    }

    return age;
}

export function isOfLegalAge(age: number): boolean {
    return age >= 18;
}