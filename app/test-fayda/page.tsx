'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestFaydaPage() {
  const testEnvironmentVars = () => {
    console.log('Environment Variables Test:');
    console.log('NEXT_PUBLIC_VERIFAYDA_CLIENT_ID:', process.env.NEXT_PUBLIC_VERIFAYDA_CLIENT_ID);
    console.log('NEXT_PUBLIC_VERIFAYDA_REDIRECT_URI:', process.env.NEXT_PUBLIC_VERIFAYDA_REDIRECT_URI);
    console.log('NEXT_PUBLIC_VERIFAYDA_AUTHORIZATION_ENDPOINT:', process.env.NEXT_PUBLIC_VERIFAYDA_AUTHORIZATION_ENDPOINT);
  };

  const testPKCE = async () => {
    try {
      // Test PKCE generation
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);
      
      console.log('PKCE Test:');
      console.log('Code Verifier:', codeVerifier);
      console.log('Code Challenge:', codeChallenge);
      
      // Test sessionStorage
      sessionStorage.setItem('test_code_verifier', codeVerifier);
      const retrieved = sessionStorage.getItem('test_code_verifier');
      console.log('SessionStorage Test:', retrieved === codeVerifier ? 'PASS' : 'FAIL');
      
      alert('Check console for test results');
    } catch (error) {
      console.error('PKCE Test Failed:', error);
      alert('PKCE Test Failed - check console');
    }
  };

  const testFaydaURL = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_VERIFAYDA_CLIENT_ID || 'missing',
      redirect_uri: process.env.NEXT_PUBLIC_VERIFAYDA_REDIRECT_URI || 'missing',
      response_type: 'code',
      scope: 'openid profile email',
      state: 'test-state',
      code_challenge: 'test-challenge',
      code_challenge_method: 'S256'
    });

    const url = `${process.env.NEXT_PUBLIC_VERIFAYDA_AUTHORIZATION_ENDPOINT}?${params.toString()}`;
    console.log('Generated Fayda URL:', url);
    
    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      alert('Fayda URL copied to clipboard and logged to console');
    });
  };

  // Helper functions
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

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Fayda OIDC Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testEnvironmentVars} variant="outline">
            Test Environment Variables
          </Button>
          
          <Button onClick={testPKCE} variant="outline">
            Test PKCE Generation
          </Button>
          
          <Button onClick={testFaydaURL} variant="outline">
            Generate Fayda URL
          </Button>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Quick Links:</h3>
            <div className="space-x-2">
              <Button asChild variant="secondary">
                <a href="/login">Go to Login</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="/callback">Go to Callback</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 