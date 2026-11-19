import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development' || !['localhost', '127.0.0.1', '[::1]'].includes(new URL(request.url).hostname)) {
    return new Response(null, { status: 404 });
  }

  const image = await readFile(join(process.cwd(), 'public/images/literacy-rate-in-india-state-wise-plfs-2025.png'));
  return new Response(new Uint8Array(image), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex,noimageindex',
    },
  });
}
