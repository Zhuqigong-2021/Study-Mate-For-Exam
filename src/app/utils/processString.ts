export const processString = (text: string) => {
  // RegEx pattern to match special characters and add spaces around them
  const newText = text.replace(/([_.,;:!?/>])/g, " $1 ");
  return newText.replace(/\s+/g, " ").trim();
};
