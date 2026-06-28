import { ProfileFormValues } from './types';

/**
 * Cleans the profile form values before submitting them to the API.
 * Specifically, it filters out empty or whitespace-only phone numbers.
 *
 * @param value The raw form values from the inputs.
 * @returns The cleaned form values object.
 */
export const cleanProfileFormValues = (
  value: ProfileFormValues,
): ProfileFormValues => {
  // Filter out any trailing or empty phone numbers
  return {
    ...value,
    phone_number: value.phone_number.filter((p: string) => p.trim() !== ''),
  };
};
