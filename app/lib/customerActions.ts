'use server';

import { createPool } from '@vercel/postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter a name.',
  }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  image_url: z.string({
    invalid_type_error: 'Please select an image like /customers/evil-rabbit.png',
  })
  .regex(/^\/\w+$/, {
    message: 'String must start with a "/" followed by alphanumeric characters (no spaces)',
  }),
});

export type FormState = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

const CreateCustomer = FormSchema.omit({ id: true });

export async function createCustomer(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    console.log(validatedFields.success);
    console.log('Missing Fields. Failed to Create Customer.');
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }

  const { name, email, image_url } = validatedFields.data;

  try {
    console.log('try query');
    
    const pool = createPool({
      connectionString: process.env.POSTGRES_URL,
    });

    await pool.query(`
      INSERT INTO customers (name, email, image_url)
      VALUES ('${name}', '${email}', '${image_url}')
    `);

    
  } catch (error) {
    console.error(error);
    console.log('Database Error: Failed to Create Customer.');
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  console.log('redirect');

  revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}




