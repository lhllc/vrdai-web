import { NextRequest, NextResponse } from "next/server";
import { getURL } from '@/utils/helpers';

// Add type definitions for process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL?: string;
      NEXT_PUBLIC_API_URL: string;
      API_SECRET_KEY: string;
    }
  }
}

function setCORSHeaders(res: NextResponse) {
  const allowedOrigins = [
    'https://vrdai-web.vercel.app',
    'http://localhost:3000'
  ];
  const envOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  const origin = allowedOrigins.includes(envOrigin || '')
    ? envOrigin || allowedOrigins[0]
    : allowedOrigins[0];

  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Origin', origin);
  res.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization');
  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 200 });
  return setCORSHeaders(res);
}

export async function POST(req: NextRequest) {
  // Log method and origin for debugging CORS
  console.log('CORS Debug:', {
    method: req.method,
    origin: req.headers.get('origin'),
    headers: req.headers
  });

  let body;
  try {
    body = await req.json();
  } catch {
    return setCORSHeaders(NextResponse.json({ error: "Invalid JSON" }, { status: 400 }));
  }

  const { priceId, success_url, cancel_url } = body;

  if (!priceId) {
    return setCORSHeaders(NextResponse.json({ error: "Price ID is required" }, { status: 400 }));
  }

  try {
    // Forward the request to the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
      },
      body: JSON.stringify({
        priceId,
        success_url: success_url || `${getURL()}/post-payment?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancel_url || `${getURL()}/pricing`
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const data = await response.json();
    return setCORSHeaders(NextResponse.json(data));
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return setCORSHeaders(NextResponse.json({ error: error.message }, { status: 500 }));
  }
} 