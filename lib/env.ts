import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET:z.string().min(1),
    BETTER_AUTH_URL:z.string().url(),
    RESEND_API_KEY:z.string().min(1),
    ARCJET_KEY: z.string().min(1),
    VERIFAYDA_CLIENT_ID: z.string().min(1),
    VERIFAYDA_REDIRECT_URI: z.string().url(),
    VERIFAYDA_AUTHORIZATION_ENDPOINT: z.string().url(),
    VERIFAYDA_TOKEN_ENDPOINT: z.string().url(),
    VERIFAYDA_USERINFO_ENDPOINT: z.string().url(),
    VERIFAYDA_CLIENT_ASSERTION_TYPE: z.string().min(1),
    VERIFAYDA_PRIVATE_KEY_BASE64: z.string().min(1),
  },

  client: {
    NEXT_PUBLIC_VERIFAYDA_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_VERIFAYDA_REDIRECT_URI: z.string().url(),
    NEXT_PUBLIC_VERIFAYDA_AUTHORIZATION_ENDPOINT: z.string().url(),
  },

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_VERIFAYDA_CLIENT_ID: process.env.NEXT_PUBLIC_VERIFAYDA_CLIENT_ID,
    NEXT_PUBLIC_VERIFAYDA_REDIRECT_URI: process.env.NEXT_PUBLIC_VERIFAYDA_REDIRECT_URI,
    NEXT_PUBLIC_VERIFAYDA_AUTHORIZATION_ENDPOINT: process.env.NEXT_PUBLIC_VERIFAYDA_AUTHORIZATION_ENDPOINT,
  }
});