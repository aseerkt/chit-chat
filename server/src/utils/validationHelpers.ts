import { validate } from 'class-validator';
import { Errors } from '../types/globalTypes';

export default async function validateEntity(obj: Object): Promise<Errors> {
  const validationErrors = await validate(obj);
  if (validationErrors.length < 1) return { errors: undefined };
  const formatedErrors = validationErrors.map((err) => ({
    field: err.property,
    message: Object.values(err.constraints!)[0],
  }));
  return { errors: formatedErrors };
}
