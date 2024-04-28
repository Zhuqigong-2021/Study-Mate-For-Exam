const dev = process.env.NODE_ENV !== "production";

export const server = dev
  ? "http://localhost:3000" // Development URL
  : "https://study-mate-for-exam.vercel.app/";
