"use client"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
    const router = useRouter();
    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    toast.success("SignOut successfully!");
                },
                onError: () => {
                    toast.error("Error signing out");
                }
            },
        });
    }

    return handleSignOut;
}
