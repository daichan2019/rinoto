import { headers } from 'next/headers';

export async function baseUrl() {
  const headersList = headers();
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
  return `${protocol}://${host}`;
}
