// basicAuth.ts
import type { Context } from 'elysia';

const BASIC_AUTH_USER = process.env.APP_DATA_BASIC_AUTH_USERNAME || 'employee';
const BASIC_AUTH_PASS = process.env.APP_DATA_BASIC_AUTH_PASSWORD || 'password123';

export function basicAuth(ctx: Context) {
  const authHeader = ctx.request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    ctx.set.headers['WWW-Authenticate'] = 'Basic realm="User Visible Realm"';
    return new Response(
      JSON.stringify({ error: 'Missing Authorization header' }),
      { status: 401 }
    );
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASS) {
    ctx.set.headers['WWW-Authenticate'] = 'Basic realm="User Visible Realm"';
    return new Response(
      JSON.stringify({ error: 'Invalid basic auth credentials' }),
      { status: 401 }
    );
  }

  // ✅ Kalau lolos auth
  return null; // null berarti lanjut request
}
