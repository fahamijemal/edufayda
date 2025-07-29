"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';
import { Loader, Loader2, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function LoginForm(){
      const [verifaydaPending, startVerifaydaTransition] = useTransition();
      const router=useRouter();
      const [emailPending, startEmailTransition] = useTransition();
      const[email, setEmail]=useState("");
      async function signInWithVerifayda() {
        startVerifaydaTransition(async () =>{
          try {
            // Generate PKCE and state
            const codeVerifier = generateRandomString(64);
            const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);
            const state = generateRandomString(16);
            const nonce = generateRandomString(16);

            // Store in sessionStorage for callback
            sessionStorage.setItem('fayda_code_verifier', codeVerifier);
            sessionStorage.setItem('fayda_state', state);
            sessionStorage.setItem('fayda_nonce', nonce);

            // Build OIDC URL
            const params = new URLSearchParams({
              client_id: process.env.NEXT_PUBLIC_VERIFAYDA_CLIENT_ID!,
              redirect_uri: process.env.NEXT_PUBLIC_VERIFAYDA_REDIRECT_URI!,
              response_type: 'code',
              scope: 'openid profile email',
              acr_values: 'mosip:idp:acr:generated-code',
              claims: JSON.stringify({
                userinfo: {
                  name: { essential: true },
                  phone_number: { essential: true },
                  email: { essential: true },
                  picture: { essential: true },
                  gender: { essential: true },
                  birthdate: { essential: true },
                  address: { essential: true }
                },
                id_token: {}
              }),
              code_challenge: codeChallenge,
              code_challenge_method: 'S256',
              state,
              nonce,
              ui_locales: 'en'
            });

            // Redirect to Fayda
            window.location.href = `${process.env.NEXT_PUBLIC_VERIFAYDA_AUTHORIZATION_ENDPOINT}?${params.toString()}`;
          } catch (error) {
            toast.error("Error initiating Fayda login");
          }
        });
      }

      // Helper functions for PKCE
      function generateRandomString(length: number) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let result = '';
        const values = window.crypto.getRandomValues(new Uint8Array(length));
        for (let i = 0; i < length; i++) {
          result += charset[values[i] % charset.length];
        }
        return result;
      }

      async function pkceChallengeFromVerifier(verifier: string) {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      async function signInWithEmail() {
        startEmailTransition(async () =>{
          await authClient.emailOtp.sendVerificationOtp({
            email:email,
            type:'sign-in',
            fetchOptions:{
              onSuccess: ()=>{
                toast.success('Email  send')
                router.push( `/verify-request?email=${encodeURIComponent(email)}`);
              },
              onError:() =>{
                toast.error("Message Sending Error");
              }
            }
          })
        })
      }
    return(
            <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Welcome back!</CardTitle>
        <CardDescription >Login with your VeriFayda or Email Account</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'> 
        <Button 
          disabled={verifaydaPending}
          onClick={signInWithVerifayda} 
          className='w-full' 
          variant="outline" >
          {verifaydaPending ? (
            <>
            <Loader className='size-4 animate-spin'/>
            <span>Loading... </span>
            </>
          ):(
            <>
              {/* Optionally add a Fayda icon here */}
              Sign in with VeriFayda
            </>
          )}
        </Button>
        <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
          <span className='relative z-10 bg-card px-2 text-muted-foreground'>Or continue with</span>
        </div>

        <div className='grip gap-3'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input 
             value={email} 
             onChange={(e) => setEmail(e.target.value)} 
             type='email' placeholder='sample@example.com' 
             required
             />
          </div>
          <Button onClick={signInWithEmail} disabled={emailPending} >
            {emailPending ?(
              <>
              <Loader2 className='size-4 animate-spin '/>
              <span>Loading ...</span>
              </>
            ):(
              <>
              <Send className='size-4'/>
              <span>continue with Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
    )
}