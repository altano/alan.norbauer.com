/**
 * Checks for null and undefined
 */
export default function notNullish<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
