import { NextRequest, NextResponse } from 'next/server';
import { generateSignedJwt } from '@/lib/generateSignedJwt';

export async function POST(req: NextRequest) {
  const { code, code_verifier } = await req.json();

  if (!code || !code_verifier) {
    return NextResponse.json({ error: 'Missing code or code_verifier' }, { status: 400 });
  }

  try {
    const jwt = await generateSignedJwt();

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.VERIFAYDA_REDIRECT_URI!,
      client_id: process.env.VERIFAYDA_CLIENT_ID!,
      client_assertion_type: process.env.VERIFAYDA_CLIENT_ASSERTION_TYPE!,
      client_assertion: jwt,
      code_verifier
    });

    const response = await fetch(process.env.VERIFAYDA_TOKEN_ENDPOINT!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || 'Token request failed');

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
