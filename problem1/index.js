/**
 * Method 1: Using a for loop
 * Time complexity: O(n) due to the loop running n times
 * Space complexity: O(1) due to the constant space used for the sum variable
 */
var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; ++i) {
    sum += i;
  }
  return sum;
};
console.log(`Loop method: ${sum_to_n_a(11)}`); // Expected output: 66

/**
 * Method 2: Using a recursive function (Worst case scenario)
 * Time complexity: O(n) due to the recursive calls
 * Space complexity: O(n) due to the call stack
 */
var sum_to_n_b = function (n) {
  // TODO1: Define base case
  if (n === 1) {
    return 1;
  }
  // TODO2: Define recursive case
  return n + sum_to_n_b(n - 1);
};
console.log(`Recursive method: ${sum_to_n_b(11)}`); // Expected output: 66

/**
 * Method 3: Using a mathematical formula (Best case scenario)
 * Time complexity: O(1) due to the constant time operation
 * Space complexity: O(1) due to the constant space used
 * My approach:
 * 1. Imagine n is a sequence of blocks of size 1 to n
 * 2. If n is odd, we can create (n/2 + 1/2) pairs of blocks of size n
 * Formula: (n/2 + 1/2) * n = (n * (n + 1)) / 2
 * 3. If n is even, we can create (n/2) pairs of blocks of size (n + 1)
 * Formula: (n/2) * (n + 1) = (n * (n + 1)) / 2
 * 4. Therefore, the general formula is (n * (n + 1)) / 2
 */
var sum_to_n_c = function (n) {
  return (n / 2 + 1 / 2) * n;
  // return (n / 2 + 1 / 2) * n;
  // return (n/2) * (n + 1);
};
console.log(`Mathematical formula: ${sum_to_n_c(11)}`); // Expected output: 66
