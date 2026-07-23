import { z } from 'zod';
import { addressSchema } from "../checks/address.schema.js";

const applicantSchema = z.object({
    fullName: z.string(),
    dateOfBirth: z.coerce.date(),
    nationality: z.string(),
    address: addressSchema,
    middleName: z.string().optional(),
    email: z.email(),
    phone: z.string(),
});

export type Applicant = z.infer<typeof applicantSchema>;
export { applicantSchema };