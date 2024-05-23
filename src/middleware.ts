import { authMiddleware } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./config";
const ItlMiddleware = createMiddleware({
  // A list of all locales that are supported

  locales,
  localePrefix,
  // Used when no locale matches
  defaultLocale: "en",
  localeDetection: true,
});
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  beforeAuth: (req) => {
    return ItlMiddleware(req);
  },

  publicRoutes: [
    "/",
    // "/en",
    // "/fr",
    "/:locale",
    "/:locale/sign-in",
    "/en/sign-in",
    "/fr/sign-in",
  ],
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*),'/(fr|en)/:path*'",
  ],
};

// export const config = {
//   matcher: ["/((?!api|_next|.*\\..*).*)"],
// };
