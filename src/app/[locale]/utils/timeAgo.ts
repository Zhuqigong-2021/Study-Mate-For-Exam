export function timeAgo(
  isoString: string | number | Date,
  nowString: string | number | Date,
) {
  const now: any = new Date(nowString);
  const pastDate: any = new Date(isoString);
  const diffInSeconds = Math.floor((now - pastDate) / 1000);

  if (diffInSeconds <= 20) {
    return "just now";
  }

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds);
    if (interval >= 1) {
      return interval === 1
        ? `1 ${unit.name} ago`
        : `${interval} ${unit.name}s ago`;
    }
  }

  return "just now";
}

// export function timeAgo(isoString: string | number | Date) {
//   const date: any = new Date(isoString);
//   const now: any = new Date();
//   const seconds = Math.round((now - date) / 1000);
//   const minutes = Math.round(seconds / 60);
//   const hours = Math.round(minutes / 60);
//   const days = Math.round(hours / 24);
//   const months = Math.round(days / 30);
//   const years = Math.round(months / 12);

//   if (seconds < 25) {
//     return "just now";
//   } else if (seconds < 60) {
//     return `${seconds} seconds ago`;
//   } else if (minutes < 60) {
//     return `${minutes} minutes ago`;
//   } else if (hours < 24) {
//     return `${hours} hours ago`;
//   } else if (days < 30) {
//     return `${days} days ago`;
//   } else if (months < 12) {
//     return `${months} months ago`;
//   } else {
//     return `${years} years ago`;
//   }
// }
