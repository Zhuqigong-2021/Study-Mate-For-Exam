export function fullnameFormatter(firstName: any, lastName: any) {
  // Check if both names exist and are not empty
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  // Check if only firstName exists and is not empty
  if (firstName) {
    return firstName;
  }
  // Check if only lastName exists and is not empty
  if (lastName) {
    return lastName;
  }
  // If neither name exists, return 'no name'
  return "no name";
}
