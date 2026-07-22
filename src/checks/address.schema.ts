import { z } from 'zod';

const addressSchema = z.object({
    street: z.string(),
    city: z.string(),
    country: z.string()
})

export type Address = z.infer<typeof addressSchema>;
export { addressSchema };