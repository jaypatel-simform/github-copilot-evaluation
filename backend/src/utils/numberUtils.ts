/**
 * Filters and returns only even numbers from the given array.
 * @param numbers - Array of numbers to filter
 * @returns Array containing only even numbers
 */
export function findEvenNumbers(numbers: number[]): number[] {
  return numbers.filter((num) => num % 2 === 0);
}
