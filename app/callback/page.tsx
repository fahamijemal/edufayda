'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { decodeJwt } from 'jose';

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = sessionStorage.getItem('fayda_state');
    const codeVerifier = sessionStorage.getItem('fayda_code_verifier');

    if (!code || !state || !codeVerifier) {
      setError('Missing code, state, or code_verifier');
      return;
    }
    if (state !== storedState) {
      setError('Invalid state');
      return;
    }

    const fetchTokenAndUserInfo = async () => {
      try {
        // Exchange code for tokens
        const tokenRes = await fetch('/api/fayda/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, code_verifier: codeVerifier })
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) throw new Error(tokenData.error);

        // Fetch user info
        const userinfoRes = await fetch('/api/fayda/userinfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: tokenData.access_token })
        });
        const userinfoData = await userinfoRes.json();
        if (!userinfoRes.ok) throw new Error(userinfoData.error);

        // If userinfo is a JWT, decode it
        let decoded: any = userinfoData;
        if (typeof userinfoData === 'string' && userinfoData.split('.').length === 3) {
          decoded = decodeJwt(userinfoData);
        }
        setUserInfo(decoded);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchTokenAndUserInfo();
  }, [searchParams]);

  if (error) return <div>Error: {error}</div>;
  if (!userInfo) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          <li><strong>Name:</strong> {userInfo.name || 'N/A'}</li>
          <li><strong>Email:</strong> {userInfo.email || 'N/A'}</li>
          <li><strong>Gender:</strong> {userInfo.gender || 'N/A'}</li>
          <li><strong>Phone:</strong> {userInfo.phone_number || 'N/A'}</li>
          <li><strong>Date of Birth:</strong> {userInfo.birthdate || 'N/A'}</li>
          <li><strong>Address:</strong> {userInfo.address ? JSON.stringify(userInfo.address) : 'N/A'}</li>
          {userInfo.picture && (
            <li>
              <img src={userInfo.picture} alt="User" width={150} style={{ borderRadius: '50%' }} />
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
} 