import { NextResponse } from 'next/server';
import dns from 'dns/promises';

// Simple in-memory rate limiter to prevent abuse
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

export async function POST(req: Request) {
  try {
    // 1. Extract IP for rate limiting (using Next.js headers)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // 2. Apply Rate Limiting
    const now = Date.now();
    const requestData = rateLimit.get(ip);
    
    if (requestData && now - requestData.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (requestData.count >= MAX_REQUESTS_PER_WINDOW) {
        console.warn(`[Security] Rate limit exceeded for IP: ${ip}`);
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
      requestData.count++;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    // 3. Clean up old rate limit entries to prevent memory leaks
    if (Math.random() < 0.1) {
      for (const [key, value] of rateLimit.entries()) {
        if (now - value.timestamp > RATE_LIMIT_WINDOW_MS) {
          rateLimit.delete(key);
        }
      }
    }

    const { domain } = await req.json();

    // 4. Strict input sanitization
    if (!domain || typeof domain !== 'string' || domain.length > 255) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    try {
      const mxRecords = await dns.resolveMx(domain);
      
      if (!mxRecords || mxRecords.length === 0) {
        return NextResponse.json({ valid: false, reason: "No MX records found" });
      }

      return NextResponse.json({ valid: true });
    } catch (dnsError: unknown) {
      const errorMessage = dnsError instanceof Error ? dnsError.message : String(dnsError);
      console.warn(`[DNS Check] Error checking ${domain}:`, errorMessage);
      // ANY DNS error (ENOTFOUND, ENODATA, ESERVFAIL, ETIMEOUT) means we can't verify mail servers.
      // We assume the domain is invalid, misspelled, or non-existent.
      return NextResponse.json({ valid: false, reason: "Domain does not exist or has no mail servers" });
    }
  } catch (error) {
    console.error("[check-domain] API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
