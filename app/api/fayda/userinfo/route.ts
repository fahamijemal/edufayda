import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { access_token } = await req.json();

  if (!access_token) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
  }

  try {
    const response = await fetch(process.env.VERIFAYDA_USERINFO_ENDPOINT!, {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || 'Userinfo request failed');
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
