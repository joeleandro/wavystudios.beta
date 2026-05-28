import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/behance-preview?url=https://www.behance.net/gallery/...
 *
 * Fetches the Behance project page and extracts the OG image.
 * Runs server-side to avoid CORS issues.
 * Cached for 24h via Cache-Control.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  // Only allow Behance URLs for safety
  if (!url.startsWith('https://www.behance.net/') && !url.startsWith('https://behance.net/')) {
    return NextResponse.json({ error: 'Only Behance URLs allowed' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WavyStudios/1.0)',
        'Accept': 'text/html',
      },
      next: { revalidate: 86400 }, // Cache 24h
    })

    if (!res.ok) {
      return NextResponse.json({ image: null }, { status: 200 })
    }

    const html = await res.text()

    // Extract og:image meta tag
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)

    const image = ogMatch?.[1] ?? null

    return NextResponse.json(
      { image },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    )
  } catch (err) {
    console.error('[behance-preview]', err)
    return NextResponse.json({ image: null }, { status: 200 })
  }
}
