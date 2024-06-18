export function limitStringLength(str: string, maxLength = 130) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "..."; // Truncate and add ellipsis
  }
  return str; // Return original string if it's within the limit
}
