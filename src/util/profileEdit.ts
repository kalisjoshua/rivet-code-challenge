import { Profile } from "../type/Profile";

type ReducerResult = {
  data: Partial<Profile>;
  errors?: { [key in keyof Profile]?: { pattern: boolean; required: boolean } };
};

type UpdatePayload = {
  name: string;
  //   name: keyof Profile;
  maxLength?: number;
  override?: Partial<Profile>; // enabling a workaround hack
  pattern?: string;
  required?: boolean;
  value: string;
};

/**
 * @name updateReducer
 *
 * @description
 * Reducer function for React's userReducer Hook. Updates state and validates changes.
 */
function updateReducer(
  { data, errors = {} }: ReducerResult,
  { name, maxLength, override, pattern, required, value }: UpdatePayload
): ReducerResult {
  if (override) {
    return { data: override, errors: {} };
  }

  return {
    data: { ...structuredClone(data), [name]: value },
    errors: {
      ...errors,
      [name]: {
        maxLength: (value && maxLength && value.length > maxLength) || false,
        pattern: (value && pattern && !RegExp(pattern).test(value)) || false,
        required: (required && !value) || false,
      },
    },
  };
}

export type { ReducerResult, UpdatePayload };
export { updateReducer };
