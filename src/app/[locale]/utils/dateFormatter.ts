export function dateFormatter(dateString: string | number | Date): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format the date and time normally first
  let formattedDate = new Intl.DateTimeFormat("default", options).format(date);

  // Check if it's midnight and adjust the formatting manually
  if (date.getHours() === 0 && date.getMinutes() < 10) {
    formattedDate = formattedDate.replace("12", "00").replace("AM", "AM");
  } else if (date.getHours() === 0) {
    formattedDate = formattedDate.replace("12", "00");
  }

  return formattedDate;
}
