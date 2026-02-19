import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  
  if (!date || !lat || !lng) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=1`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Add CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    })
  } catch (error) {
    console.error('Prayer times API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prayer times' },
      { status: 500 }
    )
  }
}