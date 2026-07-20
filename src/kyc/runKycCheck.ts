import { calculateAge, isOfLegalAge } from "../checks/age.js";
import { hasCountryRisk, type Address } from "../checks/countryRisk.js";
import { isOnSanctionsList, type PersonInfo, type SanctionedPerson } from "../checks/sanctions.js";
import { makeDecision, explainDecision, type Verdict } from "./decision.js";