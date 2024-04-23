export function nameFormatter(name: string) {
  // Split the name into parts
  let parts = name.split(" ");

  // Replace 'null' with an empty string for each part
  parts = parts.map((part) => (part === "null" ? "" : part));

  // Filter out empty strings to remove extra spaces
  parts = parts.filter((part) => part !== "");

  // Join the parts back together
  let formattedName = parts.join(" ");

  // If both parts were 'null', set the formattedName to 'no name'
  if (formattedName === "") {
    formattedName = "no name";
  }

  return formattedName;
}
