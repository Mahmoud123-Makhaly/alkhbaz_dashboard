import { NextResponse, NextRequest } from 'next/server';

interface IParams {
  fileName: string;
  url?: string;
}

export async function GET(request: NextRequest, params: IParams) {
  const response = await fetch(request.nextUrl.searchParams.get('url') || '');
  if (response.ok) {
    return new Response(response.body, {
      headers: {
        'content-type': 'application/octet-stream', //use application
      },
    });
  }
  return new NextResponse('', { status: 404, statusText: 'Image not found' });
}
