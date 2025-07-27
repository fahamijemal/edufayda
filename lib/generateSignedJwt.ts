import { importJWK, SignJWT } from 'jose';

export const generateSignedJwt = async () => {
  const {
    VERIFAYDA_CLIENT_ID,
    VERIFAYDA_TOKEN_ENDPOINT,
    VERIFAYDA_PRIVATE_KEY_BASE64
  } = process.env;

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: VERIFAYDA_CLIENT_ID,
    sub: VERIFAYDA_CLIENT_ID,
    aud: VERIFAYDA_TOKEN_ENDPOINT
  };

  const jwkJson = Buffer.from(VERIFAYDA_PRIVATE_KEY_BASE64!, 'base64').toString();
  const jwk = JSON.parse(jwkJson);
  const privateKey = await importJWK(jwk, 'RS256');

  return await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(privateKey);
};
