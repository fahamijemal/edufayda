import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins"
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    plugins: [
        genericOAuthClient(),
        emailOTPClient()
    ]
});
