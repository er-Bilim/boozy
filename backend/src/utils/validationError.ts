import { Error } from 'mongoose';

const isValidationError = (error: unknown): Error.ValidationError | null => {
  if (error instanceof Error.ValidationError) {
    return error;
  }

  return null;
};

export default isValidationError;
