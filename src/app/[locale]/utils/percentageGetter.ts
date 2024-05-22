export function percentageGetter(text: string) {
  // Regular expression to find 'coverage:' followed by any number of characters and a percentage
  const matches = text.match(/coverage:[^\d]*([\d.]+%)/gi);

  if (matches && matches.length) {
    // Get the last match
    const lastMatch = matches[matches.length - 1];
    // Extract the percentage value
    const percentage = lastMatch.match(/([\d.]+%)/);
    return percentage ? percentage[1] : null;
  } else {
    // Return a default or error message if no pattern is found
    return null;
  }
}
